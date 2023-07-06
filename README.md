# Chromoscope [![Demo](https://img.shields.io/badge/demo-🧬-5CB6EA.svg)](https://chromoscope.bio/) [![Documentation Status](https://img.shields.io/badge/documentation-📖-5CB6EA.svg)](https://chromoscope.bio/docs/) [![License: MIT](https://img.shields.io/badge/License-MIT-5CB6EA.svg)](https://opensource.org/licenses/MIT)

Interactive multiscale visualization for structural variation in human genomes.

- Demo: https://chromoscope.bio/
- Documentation: https://chromoscope.bio/docs/

![teaser](https://chromoscope.bio/docs/assets/images/teaser-35e018558eb73828a391cc03d8157521.png)

> The Chromoscope interface consists of four views for analyzing structural variation in cancer genomes at multiple scales (a–d). Chromoscope uses a "data config" to load datasets via HTTP requests and does not require setting up a server (e). The data can be either stored privately or publicly (e.g., cloud buckets or local servers). Chromoscope captures distinct patterns of structural variations and their copy number footprint in samples with different types of chromosomal instability, such as chromothripsis, or associated with loss of BRCA1 -/-, BRCA2 -/-, or CCNE1 amplification (f-g).

## Development

Clone this repo on your local machine first.

Move to the project folder and then install all dependencies using [Yarn](https://yarnpkg.com/). You need to install Yarn first if you do not have it installed.

```sh
cd chromoscope
yarn install
```

Run the local instance.

```sh
yarn start
```

Open the browser to see the local Chromoscope.

```sh
http://localhost:3000
```

### Documentation

Install dependencies for the documentation website.

```sh
yarn --cwd docs install
```

Start the local server for the documentation.

```sh
yarn start-docs
```

Open the browser to see the local documentation.

```sh
http://localhost:3000/docs
```

## Citation

Please cite the [preprint](10.31219/osf.io/pyqrx) below:
> L'Yi et al. Chromoscope: Interactive Multiscale Visualization for Structural Variation in Human Genomes. OSF Preprints, 10 May 2023. 10.31219/osf.io/pyqrx
