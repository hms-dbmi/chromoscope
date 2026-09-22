/**
 * Generate thumbnail JPEG images for any Chromoscope cohort config.
 *
 * Usage:
 *   node generate-thumbnails.js --config <url-or-path> [--output <dir>] [--width <px>] [--concurrency <n>] [--sv-stroke-width <n>] [--sv-opacity <n>] [--sv-only]
 *
 * Examples:
 *   node generate-thumbnails.js --config https://example.com/cohort.json --output ./thumbnails
 *   node generate-thumbnails.js --config ./my-cohort.json --output ./out --concurrency 4
 *
 * Config JSON format (array or object with .samples array):
 *   [{ "id": "...", "cancer": "...", "assembly": "hg38", "sv": "<url>", "cnv": "<url>", "cnFields": [...] }]
 *
 * The script generates one JPEG per sample named <id>.jpeg in the output directory.
 */

import puppeteer from 'puppeteer';
import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import { existsSync, mkdirSync } from 'node:fs';

// ── CLI args ─────────────────────────────────────────────────────────────────

const args = process.argv.slice(2);
const get = (flag) => {
    const i = args.indexOf(flag);
    return i !== -1 ? args[i + 1] : undefined;
};

const configArg = get('--config');
const outputDir = get('--output') ?? './thumbnails';
const width = Number(get('--width') ?? 500);
const concurrency = Number(get('--concurrency') ?? 3);
const svStrokeWidth = Number(get('--sv-stroke-width') ?? 2);
const svOpacity = Number(get('--sv-opacity') ?? 1.0);
const svOnly = args.includes('--sv-only');
const cnvHeight = Number(get('--cnv-height') ?? 20);
const trackSpacing = Number(get('--track-spacing') ?? 5);

if (!configArg) {
    console.error('Usage: node generate-thumbnails.js --config <url-or-path> [--output <dir>] [--width <px>] [--concurrency <n>] [--sv-stroke-width <n>] [--sv-opacity <n>] [--sv-only] [--cnv-height <px>] [--track-spacing <px>]');
    process.exit(1);
}

// ── Load config ───────────────────────────────────────────────────────────────

async function loadConfig(source) {
    let text;
    if (source.startsWith('http://') || source.startsWith('https://')) {
        const res = await fetch(source);
        if (!res.ok) throw new Error(`Failed to fetch config: ${res.status} ${res.statusText}`);
        text = await res.text();
    } else {
        text = await fs.readFile(source, 'utf8');
    }
    const parsed = JSON.parse(text);
    // Support both array and { samples: [...] } formats
    return Array.isArray(parsed) ? parsed : (parsed.samples ?? parsed);
}

// ── Gosling spec builders ─────────────────────────────────────────────────────

const CYTOBAND_URL = {
    hg38: 'https://raw.githubusercontent.com/sehilyi/gemini-datasets/master/data/UCSC.HG38.Human.CytoBandIdeogram.csv',
    hg19: 'https://raw.githubusercontent.com/sehilyi/gemini-datasets/master/data/UCSC.HG19.Human.CytoBandIdeogram.csv',
};

const CHR_DOMAIN = ['chr1','chr2','chr3','chr4','chr5','chr6','chr7','chr8','chr9','chr10','chr11','chr12','chr13','chr14','chr15','chr16','chr17','chr18','chr19','chr20','chr21','chr22','chrX','chrY'];

const SV_TYPES = ['Translocation', 'Duplication', 'Deletion', 'Inversion (TtT)', 'Inversion (HtH)'];
const SV_COLORS = ['lightgrey', '#409F7A', '#3275B4', '#CC7DAA', '#E6A01B'];

const SV_INFER_TRANSFORMS = [
    {
        type: 'svType',
        firstBp: { chrField: 'chrom1', posField: 'start1', strandField: 'strand1' },
        secondBp: { chrField: 'chrom2', posField: 'start2', strandField: 'strand2' },
        newField: 'svclass'
    },
    {
        type: 'replace',
        field: 'svclass',
        replace: [
            { from: 'DUP', to: 'Duplication' },
            { from: 'DEL', to: 'Deletion' },
            { from: 'TRA', to: 'Translocation' },
            { from: 't2tINV', to: 'Inversion (TtT)' },
            { from: 'h2hINV', to: 'Inversion (HtH)' }
        ],
        newField: 'svclass'
    }
];

function cytobandTrack(assembly, w) {
    return {
        data: {
            url: CYTOBAND_URL[assembly] ?? CYTOBAND_URL['hg38'],
            type: 'csv',
            chromosomeField: 'Chromosome',
            genomicFields: ['chromStart', 'chromEnd']
        },
        mark: 'rect',
        color: {
            field: 'Chromosome',
            type: 'nominal',
            domain: CHR_DOMAIN,
            range: ['#F6F6F6', 'lightgray']
        },
        x: { field: 'chromStart', type: 'genomic', aggregate: 'min', axis: 'none' },
        xe: { field: 'chromEnd', aggregate: 'max', type: 'genomic' },
        stroke: { value: 'gray' },
        strokeWidth: { value: 0.5 },
        style: { outline: 'black' },
        width: w,
        height: 30
    };
}

function gainTrack(sampleId, cnvUrl, w, cnFields, cnvHeight) {
    const [total_cn] = cnFields;
    return {
        id: `${sampleId}-small-gain`,
        title: '',
        style: { background: '#F6F6F6' },
        data: {
            separator: '\t',
            url: cnvUrl,
            type: 'csv',
            chromosomeField: 'chromosome',
            sampleLength: 99999,
            genomicFields: ['start', 'end']
        },
        dataTransform: [{ type: 'filter', field: total_cn, inRange: [5, 999] }],
        mark: 'rect',
        x: { field: 'start', type: 'genomic' },
        xe: { field: 'end', type: 'genomic' },
        color: { value: '#5CB6EA' },
        width: w,
        height: cnvHeight
    };
}

function lohTrack(sampleId, cnvUrl, w, cnFields, cnvHeight) {
    const [, , minor_cn] = cnFields;
    return {
        id: `${sampleId}-small-loh`,
        title: '',
        style: { background: '#F6F6F6' },
        data: {
            separator: '\t',
            url: cnvUrl,
            type: 'csv',
            chromosomeField: 'chromosome',
            sampleLength: 99999,
            genomicFields: ['start', 'end']
        },
        dataTransform: [{ type: 'filter', field: minor_cn, inRange: [0, 0] }],
        mark: 'rect',
        x: { field: 'start', type: 'genomic' },
        xe: { field: 'end', type: 'genomic' },
        color: { value: '#D6641E' },
        width: w,
        height: cnvHeight
    };
}

function svTrack(sampleId, svUrl, w, h, strokeWidth, opacity) {
    const heightMap = {
        Translocation:      { y: (h / 5) * 4, ye: h },
        Deletion:           { y: h / 5,        ye: 1 },
        Duplication:        { y: h / 5,        ye: (h / 5) * 2 },
        'Inversion (TtT)':  { y: (h / 5) * 3, ye: (h / 5) * 2 },
        'Inversion (HtH)':  { y: (h / 5) * 3, ye: (h / 5) * 4 }
    };

    const arcTracks = SV_TYPES.map(sv => ({
        dataTransform: [
            ...SV_INFER_TRANSFORMS,
            { type: 'filter', field: 'svclass', oneOf: [sv] }
        ],
        x: { field: 'start1', type: 'genomic' },
        xe: { field: 'end2', type: 'genomic' },
        y: { value: heightMap[sv].y },
        ye: { value: heightMap[sv].ye },
        flipY: true
    }));

    return {
        id: `${sampleId}-small-sv`,
        alignment: 'overlay',
        experimental: { performanceMode: true },
        data: {
            url: svUrl,
            type: 'csv',
            separator: '\t',
            genomicFieldsToConvert: [
                { chromosomeField: 'chrom1', genomicFields: ['start1', 'end1'] },
                { chromosomeField: 'chrom2', genomicFields: ['start2', 'end2'] }
            ]
        },
        mark: 'withinLink',
        tracks: arcTracks,
        y: { value: h / 5 },
        color: {
            field: 'svclass',
            type: 'nominal',
            domain: SV_TYPES,
            range: SV_COLORS
        },
        stroke: {
            field: 'svclass',
            type: 'nominal',
            domain: SV_TYPES,
            range: SV_COLORS
        },
        strokeWidth: { value: strokeWidth },
        opacity: { value: opacity },
        style: {
            linkStyle: 'elliptical',
            linkMinHeight: 0.7,
            withinLinkVerticalLines: true
        },
        width: w,
        height: h
    };
}

function emptyTrack(w, h) {
    return {
        data: { type: 'json', values: [] },
        mark: 'rect',
        width: w,
        height: h
    };
}

function buildSpec(sample, w, strokeWidth, opacity, svOnly = false, cnvHeight = 20, trackSpacing = 5) {
    const { id, assembly = 'hg38', sv, cnv, cnFields = ['total_cn', 'major_cn', 'minor_cn'] } = sample;
    const svHeight = 80;

    const tracks = [cytobandTrack(assembly, w)];
    if (cnv && !svOnly) {
        tracks.push(gainTrack(id, cnv, w, cnFields, cnvHeight));
        tracks.push(lohTrack(id, cnv, w, cnFields, cnvHeight));
    } else {
        tracks.push(emptyTrack(w, cnvHeight));
        tracks.push(emptyTrack(w, cnvHeight));
    }
    tracks.push(svTrack(id, sv, w, svHeight, strokeWidth, opacity));

    return {
        description: id,
        views: [{
            static: true,
            layout: 'circular',
            spacing: trackSpacing,
            style: { outline: 'lightgray' },
            tracks
        }]
    };
}

// ── Puppeteer rendering ────────────────────────────────────────────────────────

function buildHtml(spec) {
    // Use JSON.parse to load the spec, matching the approach of gosling-screenshot.js.
    // replaceAll('\\', '\\\\') escapes backslashes so they survive the template literal.
    const specJson = JSON.stringify(spec).replaceAll('\\', '\\\\');
    return `<!DOCTYPE html>
<html>
<link rel="stylesheet" href="https://unpkg.com/higlass@1.11/dist/hglib.css">
<script src="https://unpkg.com/react@16/umd/react.production.min.js"></script>
<script src="https://unpkg.com/react-dom@16/umd/react-dom.production.min.js"></script>
<script src="https://unpkg.com/pixi.js@6/dist/browser/pixi.min.js"></script>
<script src="https://unpkg.com/higlass@1.11/dist/hglib.js"></script>
<script src="https://unpkg.com/gosling.js@0.9.18/dist/gosling.js"></script>
<body style="margin:0;padding:0;background:white">
<div id="vis"></div>
<script>gosling.embed(document.getElementById("vis"), JSON.parse(\`${specJson}\`))</script>
</body></html>`;
}

async function renderSample(browser, sample, outDir, w, strokeWidth, opacity, svOnly, cnvHeight, trackSpacing) {
    const spec = buildSpec(sample, w, strokeWidth, opacity, svOnly, cnvHeight, trackSpacing);
    const outPath = path.join(outDir, `${sample.id}.jpeg`);

    const page = await browser.newPage();
    try {
        await page.setContent(buildHtml(spec), { waitUntil: 'networkidle0', timeout: 120000 });
        const component = await page.waitForSelector('.gosling-component', { timeout: 60000 });
        const box = await component.boundingBox();
        const crop = Math.round(box.width * 0.08);
        await page.screenshot({
            path: outPath,
            type: 'jpeg',
            quality: 90,
            clip: {
                x: box.x + crop,
                y: box.y + crop,
                width: box.width - crop * 2,
                height: box.height - crop * 2
            }
        });
        console.log(`  ✓ ${sample.id}`);
    } catch (err) {
        console.error(`  ✗ ${sample.id}: ${err.message}`);
    } finally {
        await page.close();
    }
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
    console.log(`Loading config from: ${configArg}`);
    const samples = await loadConfig(configArg);
    console.log(`Found ${samples.length} samples`);
    console.log(`Output: ${outputDir}  width: ${width}  concurrency: ${concurrency}`);
    console.log(`SV stroke width: ${svStrokeWidth}  opacity: ${svOpacity}  sv-only: ${svOnly}  cnv-height: ${cnvHeight}  track-spacing: ${trackSpacing}`);

    if (!existsSync(outputDir)) mkdirSync(outputDir, { recursive: true });

    const browser = await puppeteer.launch({
        headless: true,
        args: ['--use-gl=swiftshader', '--no-sandbox']
    });

    const total = samples.length;
    for (let i = 0; i < total; i += concurrency) {
        const batch = samples.slice(i, i + concurrency);
        const batchNum = Math.floor(i / concurrency) + 1;
        const totalBatches = Math.ceil(total / concurrency);
        console.log(`Batch ${batchNum}/${totalBatches} (${i + 1}–${Math.min(i + concurrency, total)} of ${total})`);
        await Promise.all(batch.map(s => renderSample(browser, s, outputDir, width, svStrokeWidth, svOpacity, svOnly, cnvHeight, trackSpacing)));
    }

    await browser.close();
    console.log(`\nDone! ${total} images saved to ${outputDir}`);
}

main().catch(err => {
    console.error(err);
    process.exit(1);
});
