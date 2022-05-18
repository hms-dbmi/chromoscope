// This file is taken from https://github.com/gosling-lang/gosling-screenshot
import puppeteer from 'puppeteer';
import * as fs from 'node:fs/promises';

/**
 * @param {string} spec
 * @param {{ reactVersion: string, pixijsVersion: string, higlassVersion: string, goslingVersion: string }} pkgOptions
 * @returns {string}
 */
function html(
    spec,
    { reactVersion = '17', pixijsVersion = '6', higlassVersion = '1.11', goslingVersion = '0.9.17' } = {}
) {
    let baseUrl = 'https://unpkg.com';
    return `\
<!DOCTYPE html>
<html>
	<link rel="stylesheet" href="${baseUrl}/higlass@${higlassVersion}/dist/hglib.css">
	<script src="${baseUrl}/react@${reactVersion}/umd/react.production.min.js"></script>
	<script src="${baseUrl}/react-dom@${reactVersion}/umd/react-dom.production.min.js"></script>
	<script src="${baseUrl}/pixi.js@${pixijsVersion}/dist/browser/pixi.min.js"></script>
	<script src="${baseUrl}/higlass@${higlassVersion}/dist/hglib.js"></script>
	<script src="${baseUrl}/gosling.js@${goslingVersion}/dist/gosling.js"></script>
<body>
	<div id="vis"></div>
	<script>
		gosling.embed(document.getElementById("vis"), JSON.parse(\`${spec}\`))
	</script>
</body>
</html>`;
}

/**
 * @param {string} spec
 * @param {import("puppeteer").ScreenshotOptions} opts
 * @returns {Promise<Buffer>}
 */
async function screenshot(spec, opts) {
    let browser = await puppeteer.launch({
        headless: true,
        args: ['--use-gl=swiftshader'] // more consistent rendering of transparent elements
    });

    let page = await browser.newPage();
    await page.setContent(html(spec), { waitUntil: 'networkidle0' });
    let component = await page.waitForSelector('.gosling-component');
    let buffer = await component.screenshot(opts);

    await browser.close();
    return buffer;
}

let input = process.argv[2];
let output = process.argv[3];

if (!input || !output) {
    console.error('Usage: node gosling-screenshot.js <input.json> <output.{png,jpeg,webp}>');
    process.exit(1);
}

let spec = await fs.readFile(input, 'utf8');
// to use escape characters as pure text (e.g., separator: '\t') in `.setContent()`
spec = spec.replaceAll('\\', '\\\\');
await screenshot(spec, { path: output });
