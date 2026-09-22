#!/usr/bin/env python3
"""
Generate a Chromoscope configuration file for structural variant (SV) data
from the NCI Genomic Data Commons (GDC) Data Portal.

All GDC SV files are controlled-access. To download files you need a GDC token
obtained from your GDC Data Portal user profile:
  https://portal.gdc.cancer.gov/

Usage:
  # List available projects with SV data (no token needed for metadata):
  python generate_gdc_config.py --list-projects

  # Generate config for all SV files in a project:
  python generate_gdc_config.py --project TCGA-BRCA --token gdc-token.txt

  # Generate config for a specific set of case IDs:
  python generate_gdc_config.py --cases case_ids.txt --token gdc-token.txt

  # Limit number of samples:
  python generate_gdc_config.py --project TCGA-OV --token gdc-token.txt --limit 20

  # Output to a specific file:
  python generate_gdc_config.py --project TCGA-BRCA --token gdc-token.txt --output tcga_brca_config.json

  # Download BEDPE files locally (requires token; decompresses .gz automatically):
  python generate_gdc_config.py --project TCGA-OV --token gdc-token.txt --download-dir ./sv_files

  # The config will then use relative paths (e.g. sv_files/case_id.bedpe).
  # Serve the directory with a local HTTP server to load into Chromoscope:
  #   python -m http.server 8080
  # Then load: https://chromoscope.bio/?external=http://localhost:8080/gdc_sv_config.json

The generated config can be loaded into Chromoscope via:
  https://chromoscope.bio/loading-data/through-data-config

Note on CORS: GDC does not serve CORS headers, so the generated URLs
(https://api.gdc.cancer.gov/data/{file_id}) will only work directly in
Chromoscope once the app has a mechanism to proxy or forward the auth token.
This script generates the configuration; browser-side authentication is a
separate integration step.
"""

import argparse
import gzip
import json
import os
import shutil
import ssl
import sys
import urllib.request
import urllib.parse
import urllib.error

GDC_FILES_ENDPOINT = "https://api.gdc.cancer.gov/files"
GDC_DOWNLOAD_BASE = "https://api.gdc.cancer.gov/data"

# SSL context: prefer system CA bundle (needed on macOS with framework Python)
_SSL_CA_CANDIDATES = ["/etc/ssl/cert.pem", "/etc/ssl/certs/ca-certificates.crt"]

def _ssl_context() -> ssl.SSLContext:
    for ca in _SSL_CA_CANDIDATES:
        if os.path.exists(ca):
            return ssl.create_default_context(cafile=ca)
    return ssl.create_default_context()

# Mapping from GDC project ID prefix to Chromoscope cancer label
# GDC project IDs look like "TCGA-BRCA", "TCGA-OV", "TARGET-AML", etc.
CANCER_LABEL_MAP = {
    "TCGA-ACC":  "adrenocortical",
    "TCGA-BLCA": "bladder",
    "TCGA-BRCA": "breast",
    "TCGA-CESC": "cervical",
    "TCGA-CHOL": "bile_duct",
    "TCGA-COAD": "colorectal",
    "TCGA-DLBC": "lymphoma",
    "TCGA-ESCA": "esophageal",
    "TCGA-GBM":  "glioblastoma",
    "TCGA-HNSC": "head_neck",
    "TCGA-KICH": "kidney_chromophobe",
    "TCGA-KIRC": "kidney_renal_clear_cell",
    "TCGA-KIRP": "kidney_renal_papillary",
    "TCGA-LAML": "acute_myeloid_leukemia",
    "TCGA-LGG":  "brain_lower_grade_glioma",
    "TCGA-LIHC": "liver",
    "TCGA-LUAD": "lung_adenocarcinoma",
    "TCGA-LUSC": "lung_squamous",
    "TCGA-MESO": "mesothelioma",
    "TCGA-OV":   "ovarian",
    "TCGA-PAAD": "pancreatic",
    "TCGA-PCPG": "pheochromocytoma",
    "TCGA-PRAD": "prostate",
    "TCGA-READ": "rectal",
    "TCGA-SARC": "sarcoma",
    "TCGA-SKCM": "melanoma",
    "TCGA-STAD": "stomach",
    "TCGA-TGCT": "testicular",
    "TCGA-THCA": "thyroid",
    "TCGA-THYM": "thymoma",
    "TCGA-UCEC": "uterine",
    "TCGA-UCS":  "uterine_carcinosarcoma",
    "TCGA-UVM":  "uveal_melanoma",
}


def get_cancer_label(project_id: str) -> str:
    """Return a Chromoscope-friendly cancer label for a GDC project ID."""
    if project_id in CANCER_LABEL_MAP:
        return CANCER_LABEL_MAP[project_id]
    # Fallback: use the suffix after the first dash, lower-cased
    parts = project_id.split("-", 1)
    return parts[-1].lower() if len(parts) > 1 else project_id.lower()


def gdc_post(endpoint: str, payload: dict, token: str | None = None) -> dict:
    """POST a JSON payload to a GDC API endpoint and return parsed JSON."""
    data = json.dumps(payload).encode("utf-8")
    headers = {"Content-Type": "application/json", "Accept": "application/json"}
    if token:
        headers["X-Auth-Token"] = token
    req = urllib.request.Request(endpoint, data=data, headers=headers, method="POST")
    try:
        with urllib.request.urlopen(req, context=_ssl_context(), timeout=60) as resp:
            return json.loads(resp.read())
    except urllib.error.HTTPError as e:
        print(f"HTTP error {e.code}: {e.reason}", file=sys.stderr)
        body = e.read().decode("utf-8", errors="replace")
        print(body[:500], file=sys.stderr)
        sys.exit(1)


_GDC_MAX_PAGE = 10_000
_FLIP_STRAND = {"+": "-", "-": "+"}


def fetch_sv_files(
    project_id: str | None = None,
    case_ids: list[str] | None = None,
    token: str | None = None,
    limit: int = 0,
) -> list[dict]:
    """
    Query the GDC API for BEDPE structural variant files.

    limit=0 (default) fetches all available files using pagination.
    Returns a list of dicts with keys: file_id, file_name, case_id, project_id.
    """
    filters_content = [
        {"op": "=", "content": {"field": "data_category", "value": "Somatic Structural Variation"}},
        {"op": "=", "content": {"field": "data_format",   "value": "BEDPE"}},
    ]

    if project_id:
        filters_content.append(
            {"op": "=", "content": {"field": "cases.project.project_id", "value": project_id}}
        )

    if case_ids:
        filters_content.append(
            {"op": "in", "content": {"field": "cases.case_id", "value": case_ids}}
        )

    filters = {"op": "and", "content": filters_content}
    fields = (
        "file_id,file_name,access,file_size,"
        "cases.case_id,cases.project.project_id,"
        "cases.demographic.gender,cases.diagnoses.primary_diagnosis"
    )

    def _build_payload(size: int, from_: int = 0) -> dict:
        return {
            "filters": filters,
            "fields": fields,
            "size": size,
            "from": from_,
            "format": "json",
        }

    # First request: get total count
    probe = gdc_post(GDC_FILES_ENDPOINT, _build_payload(1), token=token)
    total = probe.get("data", {}).get("pagination", {}).get("total", 0)
    fetch_count = total if limit == 0 else min(limit, total)
    print(f"Found {total} BEDPE SV files total; fetching {fetch_count}.", file=sys.stderr)

    all_hits: list[dict] = []
    from_ = 0
    while len(all_hits) < fetch_count:
        page_size = min(_GDC_MAX_PAGE, fetch_count - len(all_hits))
        result = gdc_post(GDC_FILES_ENDPOINT, _build_payload(page_size, from_), token=token)
        page_hits = result.get("data", {}).get("hits", [])
        if not page_hits:
            break
        all_hits.extend(page_hits)
        from_ += len(page_hits)
        if len(all_hits) < fetch_count:
            print(f"  fetched {len(all_hits)}/{fetch_count} …", file=sys.stderr)

    hits = all_hits

    records = []
    for hit in hits:
        file_id = hit["file_id"]
        file_name = hit.get("file_name", "")
        cases = hit.get("cases", [{}])
        # A file may be linked to multiple cases; take the first
        case = cases[0] if cases else {}
        case_id = case.get("case_id", file_id)
        proj_id = case.get("project", {}).get("project_id", "unknown")

        # Optional clinical fields
        gender = None
        primary_diagnosis = None
        demographics = case.get("demographic", {})
        if demographics:
            gender = demographics.get("gender")
        diagnoses = case.get("diagnoses", [])
        if diagnoses:
            primary_diagnosis = diagnoses[0].get("primary_diagnosis")

        records.append({
            "file_id":           file_id,
            "file_name":         file_name,
            "case_id":           case_id,
            "project_id":        proj_id,
            "gender":            gender,
            "primary_diagnosis": primary_diagnosis,
        })

    return records


def list_projects(token: str | None = None) -> None:
    """Print a table of GDC projects that have SV BEDPE files."""
    payload = {
        "filters": {
            "op": "and",
            "content": [
                {"op": "=", "content": {"field": "data_category", "value": "Somatic Structural Variation"}},
                {"op": "=", "content": {"field": "data_format",   "value": "BEDPE"}},
            ],
        },
        "facets": "cases.project.project_id",
        "size": 0,
        "format": "json",
    }
    result = gdc_post(GDC_FILES_ENDPOINT, payload, token=token)
    buckets = (
        result.get("data", {})
              .get("aggregations", {})
              .get("cases.project.project_id", {})
              .get("buckets", [])
    )
    if not buckets:
        print("No projects found (or aggregations not returned).", file=sys.stderr)
        return
    print(f"{'Project ID':<25}  {'BEDPE SV Files':>15}")
    print("-" * 45)
    for b in sorted(buckets, key=lambda x: -x["doc_count"]):
        print(f"{b['key']:<25}  {b['doc_count']:>15}")


def transform_bedpe(raw_text: str) -> tuple[str, str]:
    """Transform a GDC BEDPE file to Chromoscope-compatible format.

    Returns (transformed_text, caller) where caller is 'BRASS' or 'Manta'.

    - Removes '#' prefix from first column header
    - Renames chr1/chr2 -> chrom1/chrom2 (BRASS files)
    - Renames 'name' column to 'sv_id'
    - Filters rows where filter != 'PASS' (Manta files)
    - Fixes strand conventions per caller
    """
    lines = raw_text.splitlines(keepends=True)
    if not lines:
        return raw_text

    # Find header line (skip any leading blank lines)
    header_idx = next((i for i, ln in enumerate(lines) if ln.strip()), 0)
    cols = lines[header_idx].rstrip("\r\n").split("\t")

    if cols[0].startswith("#"):
        cols[0] = cols[0][1:]

    # BRASS files use '#chr1'/'chr2'; Manta files use '#chrom1'/'chrom2'.
    # Chromoscope requires 'chrom1'/'chrom2', so rename BRASS columns.
    # BRASS strand convention is also opposite to Chromoscope's, so strand2 must be flipped.
    # Manta strand convention already matches Chromoscope's — no flip needed.
    is_brass = cols[0] == "chr1"
    if is_brass:
        cols = ["chrom1" if c == "chr1" else "chrom2" if c == "chr2" else c for c in cols]

    name_idx = cols.index("name") if "name" in cols else -1
    if name_idx >= 0:
        cols[name_idx] = "sv_id"

    strand1_idx = cols.index("strand1") if "strand1" in cols else -1
    strand2_idx = cols.index("strand2") if "strand2" in cols else -1
    filter_idx  = cols.index("filter")  if "filter"  in cols else -1
    type_idx    = cols.index("type")    if "type"    in cols else -1

    result = ["\t".join(cols) + "\n"]
    for line in lines[header_idx + 1:]:
        stripped = line.rstrip("\r\n")
        if not stripped or stripped.startswith("#"):
            result.append(line)
            continue
        fields = stripped.split("\t")
        if filter_idx >= 0 and filter_idx < len(fields) and fields[filter_idx] != "PASS":
            continue
        if is_brass:
            # BRASS convention is opposite to Chromoscope's — flip strand2 only
            if strand2_idx >= 0 and strand2_idx < len(fields):
                fields[strand2_idx] = _FLIP_STRAND.get(fields[strand2_idx], fields[strand2_idx])
        else:
            # Manta: DEL/BND already match Chromoscope; DUP is opposite — flip both strands
            sv_type = fields[type_idx] if type_idx >= 0 and type_idx < len(fields) else ""
            if sv_type == "DUP":
                if strand1_idx >= 0 and strand1_idx < len(fields):
                    fields[strand1_idx] = _FLIP_STRAND.get(fields[strand1_idx], fields[strand1_idx])
                if strand2_idx >= 0 and strand2_idx < len(fields):
                    fields[strand2_idx] = _FLIP_STRAND.get(fields[strand2_idx], fields[strand2_idx])
        result.append("\t".join(fields) + "\n")

    caller = "BRASS" if is_brass else "Manta"
    return "".join(result), caller


def download_sv_file(record: dict, download_dir: str, token: str) -> str:
    """
    Download a GDC BEDPE file to download_dir using the auth token.

    GDC serves BEDPE files gzipped; this function decompresses them so that
    Chromoscope can read them directly.  Returns the local file path.
    """
    os.makedirs(download_dir, exist_ok=True)

    file_id = record["file_id"]
    # Derive a clean local filename: use case_id + .bedpe
    local_name = f"{record['case_id']}.bedpe"
    local_path = os.path.join(download_dir, local_name)

    if os.path.exists(local_path):
        print(f"  [skip] {local_name} already exists", file=sys.stderr)
        with open(local_path) as fh:
            header_cols = fh.readline().split("\t")
        record["sv_caller"] = "BRASS" if "sample" in header_cols else "Manta"
        return local_path

    url = f"{GDC_DOWNLOAD_BASE}/{file_id}"
    headers = {
        "X-Auth-Token": token,
        "Accept":       "application/octet-stream",
    }
    req = urllib.request.Request(url, headers=headers)

    tmp_path = local_path + ".tmp"
    try:
        with urllib.request.urlopen(req, context=_ssl_context(), timeout=120) as resp:
            # GDC returns gzipped content; decompress on the fly
            content_disp = resp.headers.get("Content-Disposition", "")
            raw = resp.read()

        # Detect gzip by magic bytes (GDC always gzips BEDPE)
        if raw[:2] == b"\x1f\x8b":
            raw = gzip.decompress(raw)

        transformed, caller = transform_bedpe(raw.decode("utf-8", errors="replace"))
        record["sv_caller"] = caller
        with open(tmp_path, "w", encoding="utf-8") as f:
            f.write(transformed)
        shutil.move(tmp_path, local_path)
        print(f"  [ok]   {local_name}  ({len(raw):,} bytes, {caller})", file=sys.stderr)

    except urllib.error.HTTPError as e:
        if e.code == 403:
            print(
                f"  [403]  {file_id}: access denied — check your token has access to this file",
                file=sys.stderr,
            )
        else:
            print(f"  [err]  {file_id}: HTTP {e.code} {e.reason}", file=sys.stderr)
        if os.path.exists(tmp_path):
            os.remove(tmp_path)
        return ""  # Caller will skip this entry

    return local_path


def build_chromoscope_entry(record: dict, local_path: str | None = None, base_url: str | None = None) -> dict:
    """Convert a GDC file record into a Chromoscope config entry.

    If base_url is given, the sv field is base_url + filename.
    If local_path is given (and no base_url), the sv field points to that path.
    Otherwise it points to the GDC download URL.
    """
    if base_url and local_path:
        filename = os.path.basename(local_path)
        sv_url = base_url.rstrip("/") + "/" + filename
    elif local_path:
        sv_url = local_path
    else:
        sv_url = f"{GDC_DOWNLOAD_BASE}/{record['file_id']}"
    cancer = get_cancer_label(record["project_id"])

    entry: dict = {
        "id":       record["case_id"],
        "cancer":   cancer,
        "assembly": "hg38",
        "sv":       sv_url,
    }

    if record.get("sv_caller"):
        entry["note"] = record["sv_caller"]

    # Include optional clinical summary when available
    summary = []
    if record.get("primary_diagnosis"):
        summary.append({"label": "Primary Diagnosis", "value": record["primary_diagnosis"]})
    if record.get("gender"):
        summary.append({"label": "Gender", "value": record["gender"]})
    summary.append({"label": "GDC Project", "value": record["project_id"]})
    summary.append({"label": "GDC File ID", "value": record["file_id"]})

    if summary:
        entry["clinicalInfo"] = {"summary": summary}

    return entry


def main() -> None:
    parser = argparse.ArgumentParser(
        description="Generate a Chromoscope config JSON for GDC SV (BEDPE) files."
    )
    group = parser.add_mutually_exclusive_group()
    group.add_argument(
        "--project", "-p",
        help="GDC project ID, e.g. TCGA-BRCA. Omit to fetch across all projects.",
    )
    group.add_argument(
        "--cases", "-c",
        help="Path to a text file with one GDC case UUID per line.",
    )
    parser.add_argument(
        "--token", "-t",
        help="Path to a GDC authentication token file (required for controlled-access files).",
    )
    parser.add_argument(
        "--limit", "-n",
        type=int,
        default=0,
        help="Maximum number of files to include (default: 0 = all).",
    )
    parser.add_argument(
        "--output", "-o",
        default="gdc_sv_config.json",
        help="Output JSON file path (default: gdc_sv_config.json).",
    )
    parser.add_argument(
        "--download-dir", "-d",
        metavar="DIR",
        help=(
            "Download BEDPE files into DIR (requires --token). "
            "Files are decompressed from .gz automatically. "
            "The config will use paths relative to the output file location."
        ),
    )
    parser.add_argument(
        "--base-url",
        metavar="URL",
        help=(
            "Base URL to prefix SV file paths in the config, e.g. "
            "http://localhost:8080/sv_files. "
            "Only used when --download-dir is set."
        ),
    )
    parser.add_argument(
        "--list-projects",
        action="store_true",
        help="List projects with available SV BEDPE files and exit.",
    )

    args = parser.parse_args()

    # Load token if provided
    token: str | None = None
    if args.token:
        with open(args.token) as f:
            token = f.read().strip()

    if args.list_projects:
        list_projects(token=token)
        return

    if args.download_dir and not token:
        print("Error: --download-dir requires --token.", file=sys.stderr)
        sys.exit(1)

    # Load case IDs from file if provided
    case_ids: list[str] | None = None
    if args.cases:
        with open(args.cases) as f:
            case_ids = [line.strip() for line in f if line.strip()]
        print(f"Loaded {len(case_ids)} case IDs from {args.cases}.", file=sys.stderr)

    records = fetch_sv_files(
        project_id=args.project,
        case_ids=case_ids,
        token=token,
        limit=args.limit,
    )

    if not records:
        print("No files found matching the specified filters.", file=sys.stderr)
        sys.exit(1)

    # Optionally download files locally
    config = []
    if args.download_dir:
        # Compute the directory of the output file so we can write relative paths
        output_dir = os.path.dirname(os.path.abspath(args.output))
        print(
            f"Downloading {len(records)} files to '{args.download_dir}' …",
            file=sys.stderr,
        )
        for i, record in enumerate(records, 1):
            print(f"  [{i}/{len(records)}] {record['case_id']}", file=sys.stderr)
            local_path = download_sv_file(record, args.download_dir, token)
            if not local_path:
                continue  # Skip files that failed (e.g. 403)
            # Store a path relative to the output config file
            rel_path = os.path.relpath(local_path, output_dir)
            config.append(build_chromoscope_entry(record, local_path=rel_path, base_url=args.base_url))
    else:
        config = [build_chromoscope_entry(r) for r in records]

    if not config:
        print("No entries to write (all downloads may have failed).", file=sys.stderr)
        sys.exit(1)

    with open(args.output, "w") as f:
        json.dump(config, f, indent=2)

    print(f"\nWritten {len(config)} sample entries to {args.output}.", file=sys.stderr)

    if args.download_dir:
        print(
            "\nTo serve files locally and load in Chromoscope:\n"
            f"  cd {os.path.dirname(os.path.abspath(args.output)) or '.'}\n"
            "  python -m http.server 8080\n"
            f"  # Then open: https://chromoscope.bio/?external=http://localhost:8080/{os.path.basename(args.output)}",
            file=sys.stderr,
        )
    else:
        print(
            "\nTo load in Chromoscope, use the URL parameter:\n"
            f"  https://chromoscope.bio/?external={urllib.parse.quote(args.output)}\n"
            "Or load the file via the Chromoscope UI.",
            file=sys.stderr,
        )

    # Print a preview of the first entry
    if config:
        print("\nFirst config entry preview:", file=sys.stderr)
        print(json.dumps(config[0], indent=2), file=sys.stderr)


if __name__ == "__main__":
    main()
