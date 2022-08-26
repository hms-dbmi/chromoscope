# GosCan

## Loading Your Data

To load your data, you need to (1) make a config file (`.json`) that contains the information for each sample, (2) store the config file in a HTTPS file server (e.g., AWS S3 or [GitHub Gist](https://gist.github.com/)), and (3) use it with the `external` parameter of the GosCan URL.

```
// format
https://sehilyi.github.io/goscan/?external=[URL_TO_YOUR_CONFIG_FILE]

// example
https://sehilyi.github.io/goscan/?external=https://gist.githubusercontent.com/sehilyi/a9bbbc3e63806d2282e1959e27a65a53/raw/b6c0ab07a220027196746f46607e916bd9751c70/goscan-multiple-samples.json
```

### Configuration

For each sample, you need to prepare the following information in a JSON object.

| Property | Type | Note |
|---|---|---|
| `id` | `string` | Required. Unique ID. |
| `cancer` | `string` | Required. Type of a cancer. |
| `assembly` | `'hg38'` or `'hg19'` | Required. Assembly. |
| `sv` | `string` | Required. An URL of the SV bedpe file (`.bedpe`). |
| `cnv` | `string` | Required. An URL of the CNV text file (`.txt`). |
| `vcf` | `string` | Optional. An URL of the point mutation file (`.vcf`). |
| `vcfIndex` | `string` | Optional. An URL of the point mutation index file (`.tbi`). |
| `vcf2` | `string` | Optional. An URL of the the indel file (`.vcf`). |
| `vcf2Index` | `string` | Optional. An URL of the indel index file (`.tbi`). |
| `bam` | `string` | Optional. An URL of the BAM file (`.bam`). |
| `bamIndex` | `string` | Optional. An URL of the BAM index file (`.bai`). |
| `note` | `string` | Optional. A textual annotation. |

A single-sample example:
```js
{
    "id": "7a921087-8e62-4a93-a757-fd8cdbe1eb8f",
    "cancer": "ovarian",
    "assembly": "hg19",
    "sv": "https://s3.amazonaws.com/gosling-lang.org/data/SV/7a921087-8e62-4a93-a757-fd8cdbe1eb8f.pcawg_consensus_1.6.161022.somatic.sv.bedpe",
    "cnv": "https://s3.amazonaws.com/gosling-lang.org/data/SV/7a921087-8e62-4a93-a757-fd8cdbe1eb8f.consensus.20170119.somatic.cna.annotated.txt"
}
```

A multi-sample example:
```js
[
    {
        "id": "SRR7890905",
        "cancer": "breast",
        "assembly": "hg38",
        "sv": "https://somatic-browser-test.s3.amazonaws.com/SVTYPE_SV_test_tumor_normal_with_panel.bedpe",
        "cnv": "https://gist.githubusercontent.com/sehilyi/6fbceae35756b13472332d6b81b10803/raw/596428a8b0ebc00e7f8cbc52b050db0fbd6e19a5/SRR7890943.ascat.v3.cnv.tsv",
        "bam": "https://somatic-browser-test.s3.amazonaws.com/SRR7890905_GAPFI2USVS21.bam",
        "bai": "https://somatic-browser-test.s3.amazonaws.com/SRR7890905_GAPFI2USVS21.bam.bai",
        "note": "This is a test note"
    },
    {
        "id": "bc0dee07-de20-44d6-be65-05af7e63ac96",
        "cancer": "gastric",
        "assembly": "hg19",
        "sv": "https://somatic-browser-test.s3.amazonaws.com/cdk12cancers/bc0dee07-de20-44d6-be65-05af7e63ac96.pcawg_consensus_1.6.161116.somatic.sv.bedpe",
        "cnv": "https://somatic-browser-test.s3.amazonaws.com/cdk12cancers/bc0dee07-de20-44d6-be65-05af7e63ac96.consensus.20170119.somatic.cna.txt",
        "vcf": "https://somatic-browser-test.s3.amazonaws.com/cdk12cancers/bc0dee07-de20-44d6-be65-05af7e63ac96.consensus.20160830.somatic.snv_mnv.sorted.vcf.gz",
        "vcfIndex": "https://somatic-browser-test.s3.amazonaws.com/cdk12cancers/bc0dee07-de20-44d6-be65-05af7e63ac96.consensus.20160830.somatic.snv_mnv.sorted.vcf.gz.tbi",
        "vcf2": "https://somatic-browser-test.s3.amazonaws.com/cdk12cancers/bc0dee07-de20-44d6-be65-05af7e63ac96.consensus.20161006.somatic.indel.sorted.vcf.gz",
        "vcf2Index": "https://somatic-browser-test.s3.amazonaws.com/cdk12cancers/bc0dee07-de20-44d6-be65-05af7e63ac96.consensus.20161006.somatic.indel.sorted.vcf.gz.tbi",
        "note": "This is a test note"
    }
]
```

## Contact

- Please send an email to Sehi L'Yi (sehi_lyi@hms.harvard.edu)

<!-- This web-based tool allows interactively exploring structural variants of cancer patients with macroscopic (genome-wide) and microscopic (alignment) views. The main visualization shows structural variants of a single patient with circular overview (top), linear detail view (middle), and two alignment views (bottom). Users can select a sample from a sample gallery that can be opened by clicking on a button on the left-top corner of the browser.

## Main Components
### Circular overview
This view displays the overview of structural variants (arcs), Loss-of-Heterozygosity, or LOH (red ring), CNV Gain (green ring), and putative drivers (text labels), along with chromosome ideograms.

### Linear Detail View
This view shows the same information as in Circular Overview but focuses on a smaller region to allow browsing information in a more detailed manner. This view is linked with a light blue brush on the circular overview, i.e., representing the same region.

### Alignment Views
These views show alignment around two breakpoints of a user-selected SV (i.e., thick arc on the circular overview and the linear detail view). The gray vertical lines represent breakpoints of the user-selected SV. 

* Color: The five colors (green, blue, red, orange, yellow) represent the types of SV events. If a read on the left view has a mate on the right view, these reads are encoded with one of the five colors depending on its SV type. If paired reads are not positioned within the two views, they are just represented with grey colors.

* Loading the alignment information may take up to few minutes.

### Sample Gallery

This gallery allows browsing samples in small multiples.

## How To Use

### Navigating Linear Detail View on Circular Overview
By clicking and dragging a mouse on a blue brush, users can navigate a linear view.

### Opening Alignment Views

Upon clicking on a SV on either an overview or a linear view, two alignment views are opened that show two regions around breakpoints. The selected SV is represented with thicker edges. Vertical gray lines on the alignment views represent the breakpoints of the selected SV.

### Selecting a Sample

From the sample gallery, a user can select a sample of interest by clicking.

### Navigating To Specific Chromosomes

Using the drop-down menus, a user can quickly navigate to a certain chromosome on an either overview or the linear detail view.

### Exporting PNG

### Interacting with Visualizations
By default, interactions are not activated in visualizations. You will first need to click on a visualization, following the instruction on the left-top corner (i.e., “Click inside to use interactions”). 

After clicking on it, you can now adjust brushes, use the mouse wheel to zoom in and out, and click on a SV. In this mode, you can scroll the entire website by putting your mouse around the main visualization (i.e., gray dotted region). 

When you click on the outside of the visualization, the interactions will be deactivated. In this mode, you can safely scroll the entire website by positioning your mouse anywhere, even on the visualization.

### Loading Your Own Datasets
... -->
