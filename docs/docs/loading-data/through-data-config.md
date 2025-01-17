---
title: Through Data Config
sidebar_position: 2
---

# Data Configuration

You can load a large number of samples through data configurations. You need to (1) make a data config file (`.json`) that contains the information for individual samples, (2) store the config file in a HTTPS file server (e.g., AWS S3 or [GitHub Gist](https://gist.github.com/)), and (3) use it with [the `external` parameter of the Chromoscope URL](./url-parameters):

```
// format
https://chromoscope.bio/app/?external=[URL_TO_YOUR_CONFIG_FILE]

// example
https://chromoscope.bio/app/?external=https://gist.githubusercontent.com/sehilyi/a9bbbc3e63806d2282e1959e27a65a53/raw/b6c0ab07a220027196746f46607e916bd9751c70/goscan-multiple-samples.json
```

For each sample, you need to prepare the following information in a JSON object.

| Property | Type | Note |
|---|---|---|
| `id` | `string` | Required. Unique ID. |
| `cancer` | `string` | Required. Type of a cancer. |
| `assembly` | `'hg38'` or `'hg19'` | Required. Assembly. |
| `sv` | `string` | Required. An URL of the SV bedpe file (`.bedpe`). |
| `cnv` | `string` | Optional. An URL of the CNV text file (`.tsv`). |
| `drivers` | `string` | Optional. An URL of a file that contains drivers (`.tsv` or `.json`). |
| `vcf` | `string` | Optional. An URL of the point mutation file (`.vcf`). |
| `vcfIndex` | `string` | Optional. An URL of the point mutation index file (`.tbi`). |
| `vcf2` | `string` | Optional. An URL of the the indel file (`.vcf`). |
| `vcf2Index` | `string` | Optional. An URL of the indel index file (`.tbi`). |
| `bam` | `string` | Optional. An URL of the BAM file (`.bam`). |
| `bai` | `string` | Optional. An URL of the BAM index file (`.bai`). |
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
        "drivers": "https://gist.githubusercontent.com/sehilyi/350b9e633c52ad97df00a0fc13a8839a/raw/c47b9ba33f1c9e187c69d1dadd01838db44d3b29/driver.txt",
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

# Genome Interpretation Panel

The data for the genome interpretation panel can be recorded as additional features of the configuration file.
![Screenshot 2025-01-15 at 10 46 28 AM](https://github.com/user-attachments/assets/02d15e04-0986-4e8e-8da8-2a07eb1119a4)
For each sample, there is an optional property (`clinicalInfo`) to provide clinical information. If present, this information will be displayed in Chromoscope (the panel on the right-most side).

You can provide three fields under the `clinicalInfo` property: `summary`, `variants`, `signatures`

The `summary` field is a list of elements with two fields: `label` and `value`. Label can be any string, and will be displayed next to `value` which can also be any string.

The `variants` field is a list of variants, each with the following fields:

| Property | Type | Note |
|---|---|---|
| `gene` | `string` | Required. Gene name |
| `chr` | `string` | Required. Chromosome with the variant, including the chr prefix|
| `position` | `number` | Required. Chromosomal coordinate of the mutation|
| `type` | `string` | Optional. Type of variant, e.g., `"bi-allelic"`, `"germline"`, `"deletion"` |
| `cDNA` | `string` | Optional. cDNA coordinate of the mutation, e.g., `"c.524G>A"` |
| `protein change` | `string` | Optional. protein consequence of the mutation, e.g., `"p.Arg175His"` |
| `VAF` | `number` | Optional. Variant allele fraction of a mutation in the sample, e.g., `0.45` |
| `mutation` | `string` | Optional. Reference and alternative allele in genomic DNA, e.g., `"G>T"` |

Refer to an example configuration file that contains the clinical information necessary for displaying the genome interpretation panel:

```js
{
    id: "SRR7890905_Hartwig",
    cancer: "breast",
    assembly: "hg38",
    vcf: "https://somatic-browser-test.s3.amazonaws.com/SNV_test_tumor_normal_with_panel.vcf.gz",
    vcfIndex: "https://somatic-browser-test.s3.amazonaws.com/SNV_test_tumor_normal_with_panel.vcf.gz.tbi",
    vcf2: "https://somatic-browser-test.s3.amazonaws.com/INDEL_test_tumor_normal_with_panel.vcf.gz",
    vcf2Index: "https://somatic-browser-test.s3.amazonaws.com/INDEL_test_tumor_normal_with_panel.vcf.gz.tbi",
    sv: "https://somatic-browser-test.s3.amazonaws.com/SRR7890905/SRR7890905.gripss.filtered.bedpe",
    cnv: "https://somatic-browser-test.s3.amazonaws.com/SRR7890905/SRR7890905.purple.cnv.somatic.reformatted.tsv",
    bam: "https://somatic-browser-test.s3.amazonaws.com/SRR7890905_GAPFI2USVS21.bam",
    bai: "https://somatic-browser-test.s3.amazonaws.com/SRR7890905_GAPFI2USVS21.bam.bai",
    note: "CNV profile - Purple. SVs - Gridss. Mutations and indels - Sentieon",
    clinicalInfo: {
        summary: [
            {
                label: "grade",
                value: "2"
            },
            {
                label: "age",
                value: "32"
            },
            {
                label: "AIMS Subtype",
                value: "Basal"
            },
            {
                label: "Treatment",
                value: "None"
            },
            {
                label: "Lymph node status",
                value: "Negative"
            }
        ],
        variants: [
            {
                gene: "TP53",
                type: "biallelic",
                cDNA: "c.524G>A",
                protein change: "p.Arg175His",
                VAF: "0.97",
                chr: "chr17",
                position: "7677976",
                mutation: "C>T"
            },
            {
                gene: "BRCA2",
                cDNA: "c.4777G>T",
                protein change: "p.Glu1593Ter",
                VAF: "0.45",
                chr: "chr13",
                position: "32357888",
                mutation: "G>T"
            },
            {
                gene: "PTEN",
                type: "deletion",
                chr: "chr10",
                position: "87917777"
            },
            {
                gene: "CDKN2A",
                type: "deletion",
                chr: "chr9",
                position: "21981538"
            },
            {
                gene: "MET",
                type: "amplification",
                chr: "chr7",
                position: "116735286"
            }
        ],
        signatures: [
            {
                type: "point_mutations",
                count: "5100",
                label: "HRD-attributed point mutations",
                hrDetect: true
            },
            {
                type: "indels",
                count: "500",
                label: "HRD-attributed small deletions with micro-homology",
                hrDetect: true
            },
            {
                type: "svs_duplications",
                count: "120",
                label: "HRD-attributed small tandem duplications",
                hrDetect: true
            },
            {
                type: "svs_deletions",
                count: "50",
                label: "HRD-attributed small deletions",
                hrDetect: true
            },
            {
                type: "point_mutations",
                count: "1000",
                label: "APOBEC-attributed small substitutions",
                hrDetect: false
            }
        ]
    }
}
```



