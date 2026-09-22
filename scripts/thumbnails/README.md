# generate-thumbnails.js

Generates circular genome-view thumbnail JPEG images for any Chromoscope cohort config, using headless Puppeteer + Gosling.js.

Each sample produces one file named `<id>.jpeg`. Samples with only SV data get a large SV arc area; samples that also have a `cnv` field get Gain and LOH tracks rendered above the SV arcs.

## Requirements

Node.js 18+ (uses native `fetch` and ESM). Install dependencies once:

```bash
cd src/script
npm install        # or: pnpm install / yarn install
```

## Usage

```
node generate-thumbnails.js --config <url-or-path> [options]
```

### Options

| Flag | Default | Description |
|------|---------|-------------|
| `--config` | *(required)* | URL or local path to the cohort config JSON |
| `--output` | `./thumbnails` | Directory to write JPEG files into (created if absent) |
| `--width` | `500` | Thumbnail width in pixels |
| `--concurrency` | `3` | Number of samples rendered in parallel |
| `--sv-stroke-width` | `2` | Stroke width of SV arcs (higher = thicker, more visible) |
| `--sv-opacity` | `1.0` | Opacity of SV arcs (0–1) |

### Examples

MSK SPECTRUM cohort from S3:
```bash
node generate-thumbnails.js \
  --config https://somatic-browser-test.s3.us-east-1.amazonaws.com/SPECTRUM/SPECTRUM_config_with_clinicalInfo_sorted_aws.json \
  --sv-stroke-width 3 \
  --cnv-height 15 \
  --track-spacing 7 \
  --output ./msk-spectrum-v3
```

Pediatric cohort from S3:
```bash
node generate-thumbnails.js \
  --config https://somatic-browser-test.s3.us-east-1.amazonaws.com/pediatric_data/pediatric_cancer_config_aws.json \
  --output ./pediatric-thumbnails
```

Local config file, higher concurrency:
```bash
node generate-thumbnails.js \
  --config ./my-cohort.json \
  --output ./out \
  --concurrency 6
```

Thinner, semi-transparent SV arcs (PCAWG-style):
```bash
node generate-thumbnails.js \
  --config ./my-cohort.json \
  --sv-stroke-width 1 \
  --sv-opacity 0.7
```

## Config format

The script accepts two JSON shapes:

**Array of samples:**
```json
[
  {
    "id": "SAMPLE001",
    "cancer": "Wilms Tumor",
    "assembly": "hg38",
    "sv": "https://example.com/data/SAMPLE001.bedpe"
  }
]
```

**Object with a `samples` array** (e.g. MSK SPECTRUM format):
```json
{
  "name": "My Cohort",
  "samples": [ ... ]
}
```

### Sample fields

| Field | Required | Description |
|-------|----------|-------------|
| `id` | Yes | Sample identifier — used as the output filename |
| `sv` | Yes | URL to a BEDPE file of structural variants |
| `assembly` | No | `hg38` (default) or `hg19` |
| `cnv` | No | URL to a tab-separated CNV file. When present, Gain and LOH tracks are added above the SV arcs |
| `cnFields` | No | Column names for CNV data: `[total_cn, major_cn, minor_cn]`. Defaults to `["total_cn", "major_cn", "minor_cn"]` |

The BEDPE file must have columns: `chrom1`, `start1`, `end1`, `chrom2`, `start2`, `end2`, `strand1`, `strand2`.

## Output

One JPEG per sample at 90% quality. Failed samples are logged with `✗` and skipped; successful ones with `✓`. The process exits 0 even if individual samples fail.

## Wiring thumbnails into the app

After generating, copy the images into `public/pediatric-thumbnails/` (or a similar subdirectory of `public/`) so Vite serves them as static assets. Then ensure each sample object has a `thumbnail` field pointing to the image URL, e.g.:

```js
thumbnail: `${import.meta.env.BASE_URL}pediatric-thumbnails/${sample.id}.jpeg`
```

The `getThumbnail()` function in `SmallOverviewWrapper.tsx` will pick this up as its first-priority source, bypassing on-the-fly rendering entirely.
