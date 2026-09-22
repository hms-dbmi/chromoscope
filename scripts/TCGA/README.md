# TCGA / GDC Structural Variant Config Generator

Scripts for generating [Chromoscope](https://chromoscope.bio) configuration files from NCI Genomic Data Commons (GDC) somatic structural variant (SV) data.

## Overview

`generate_gdc_config.py` queries the GDC API for BEDPE-format SV files, optionally downloads them locally, transforms them into Chromoscope-compatible format, and writes a JSON config file that can be loaded directly into Chromoscope.

All GDC SV files are **controlled-access**. You need a GDC authentication token to download files.

## Prerequisites

- Python 3.10+
- A GDC user token (for downloading files) — obtain from your [GDC Data Portal profile](https://portal.gdc.cancer.gov/)
- [`http-server`](https://www.npmjs.com/package/http-server), see [Chromoscope Documentation] (https://chromoscope.bio/loading-data/local-data)

## Usage

```
python3 generate_gdc_config.py [OPTIONS]
```

| Option | Short | Description |
|---|---|---|
| `--project PROJECT` | `-p` | GDC project ID, e.g. `TCGA-BRCA`. Omit to fetch across all projects. |
| `--cases FILE` | `-c` | Path to a text file with one GDC case UUID per line. Mutually exclusive with `--project`. |
| `--token FILE` | `-t` | Path to a GDC authentication token file. Required for downloading files. |
| `--limit N` | `-n` | Maximum number of files to include (default: 0 = all). |
| `--output FILE` | `-o` | Output JSON file path (default: `gdc_sv_config.json`). |
| `--download-dir DIR` | `-d` | Download BEDPE files into DIR. Requires `--token`. Files are decompressed from `.gz` automatically. |
| `--base-url URL` | | Base URL to prefix SV file paths in the config (e.g. `http://localhost:8080/`). Only used with `--download-dir`. |
| `--list-projects` | | List all GDC projects with available SV BEDPE files and exit. |

## Workflow

### 1. Explore available projects

No token required for metadata queries:

```bash
python3 generate_gdc_config.py --list-projects
```

### 2. Download files and generate a config

```bash
python3 generate_gdc_config.py \
    --project TCGA-BRCA \
    --token gdc-user-token.2026-09-22T21_22_20.386Z.txt \
    --output brca_gdc_sv_config.json \
    --download-dir ./brca_sv_files \
    --limit 20 \
    --base-url "http://127.0.0.1:8080/"
```

Move the config into the download directory:

```bash
mv brca_gdc_sv_config.json ./brca_sv_files/
```

### 3. Serve files locally

```bash
# Using http-server (with CORS and no caching):
http-server ./brca_sv_files --cors -c-1 -p 8080
```

### 4. Open in Chromoscope

```
https://chromoscope.bio/app/?external=http://localhost:8080/brca_gdc_sv_config.json
```

## Examples

**Single project (TCGA-ACC):**

```bash
python3 generate_gdc_config.py \
    --project TCGA-ACC \
    --token gdc-user-token.txt \
    --output acc_gdc_sv_config.json \
    --download-dir ./acc_sv_files \
    --base-url "http://127.0.0.1:8080/"

mv acc_gdc_sv_config.json ./acc_sv_files/
http-server ./acc_sv_files --cors -c-1
# https://chromoscope.bio/app/?external=http://localhost:8080/acc_gdc_sv_config.json
```

**All projects:**

```bash
python3 generate_gdc_config.py \
    --token gdc-user-token.txt \
    --output all_gdc.json \
    --download-dir ./all_gdc_files \
    --base-url "http://127.0.0.1:8080/"
```

**Limit to a subset of samples:**

```bash
python3 generate_gdc_config.py \
    --project TCGA-OV \
    --token gdc-user-token.txt \
    --limit 20 \
    --output ov_gdc_sv_config.json \
    --download-dir ./ov_sv_files \
    --base-url "http://127.0.0.1:8080/"
```

**Specific cases from a file:**

```bash
python3 generate_gdc_config.py \
    --cases case_ids.txt \
    --token gdc-user-token.txt \
    --output custom_config.json \
    --download-dir ./custom_sv_files \
    --base-url "http://127.0.0.1:8080/"
```

## Notes

- **BEDPE transformation:** The script normalizes BEDPE files from both BRASS (used for some TCGA tumor types) and Manta callers into a format compatible with Chromoscope. This includes renaming columns (`chr1`/`chr2` -> `chrom1`/`chrom2`, `name` -> `sv_id`), filtering non-PASS calls, and correcting strand conventions per caller.
- **CORS:** GDC does not serve CORS headers, so direct GDC URLs in the config will not work in the browser. Use `--download-dir` to serve files locally.
- **Skipped files:** Files that return HTTP 403 (access denied) are skipped with a warning. Verify that your token has access to the requested project.
- **Assembly:** All generated configs use `hg38`.
