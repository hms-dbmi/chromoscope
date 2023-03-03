# Data Config

To load your data, you need to (1) make a data config file (`.json`) that contains the information for individual samples, (2) store the config file in a HTTPS file server (e.g., AWS S3 or [GitHub Gist](https://gist.github.com/)), and (3) use it with the `external` parameter of the GosCan URL.

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
| `drivers` | `string` | Optional. An URL of a file that contains drivers (`.txt`). |
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

### Data Formats

#### Structural Variants (BEDPE)
<!-- https://bedtools.readthedocs.io/en/latest/content/general-usage.html#bedpe-format -->

The structural variants are stored in a BEDPE file. The following columns are used in the browser:

| Property | Type | Note |
|---|---|---|
| `chrom1` | `string` | Required. The name of the chromosome of the first break point (BP). |
| `start1` | `number` | Required. The starting position of the first BP. |
| `end1` | `number` | Required. The end position of the first BP. |
| `chrom2` | `string` | Required. The name of the chromosome of the second BP. |
| `start2` | `number` | Required. The starting position of the second BP. |
| `end2` | `number` | Required. The end position of the second BP. |
| `sv_id` | `string` | Required. The name of the SV. |
| `pe_support` | `string` | Optional. The number of events that support SV shown in tooltips. |
| `strand1` | `string` | Required. The strand for the first BP. Either `'+'` or `'-'`. |
| `strand2` | `string` | Required. The strand for the first BP. Either `'+'` or `'-'`. |

Example file:

?> https://somatic-browser-test.s3.amazonaws.com/SVTYPE_SV_test_tumor_normal_with_panel.bedpe

#### CNV (TSV)
<!-- https://bedtools.readthedocs.io/en/latest/content/general-usage.html#bedpe-format -->

The CNV is stored in a tab-delimited file that is visualized as three tracks: CNV, Gain, and LOH.

| Property | Type | Note |
|---|---|---|
| `chromosome` | `string` | Required. The name of the chromosome. |
| `start` | `number` | Required. The starting position. |
| `end` | `number` | Required. The end position. |
| `total_cn` | `string` | Required. The total number of copies. |
| `major_cn` | `number` | Required. The major allele counts. |
| `minor_cn` | `number` | Required. The minor allele counts. |

Example file:

?> https://s3.amazonaws.com/gosling-lang.org/data/SV/7a921087-8e62-4a93-a757-fd8cdbe1eb8f.consensus.20170119.somatic.cna.annotated.txt

#### Drivers (TSV)
<!-- https://bedtools.readthedocs.io/en/latest/content/general-usage.html#bedpe-format -->

The drivers are stored in a tab-delimited file. When this file is present, the browser will show drivers that are included in the file only.

The order of the columns does not need to be in the exact same order.

| Property | Type | Note |
|---|---|---|
| `chr` | `string` | Required. The name of the chromosome, such as `chr2` and `chrX`. |
| `pos` | `number` | Required. The position of the driver. |
| `gene` | `number` | Required. The name of the driver. |
| `ref` | `string` | Optional. Information only shown on a tooltip. |
| `alt` | `string` | Optional. Information only shown on a tooltip. |
| `category` | `string` | Optional. Information only shown on a tooltip. |
| `top_category` | `string` | Optional. Information only shown on a tooltip. |
| `transcript_consequence` | `string` | Optional. Information only shown on a tooltip. |
| `protein_mutation` | `string` | Optional. Information only shown on a tooltip. |
| `allele_fraction` | `string` | Optional. Information only shown on a tooltip. |
| `mutation_type` | `string` | Optional. Information only shown on a tooltip. |
| `biallelic` | `string` | Optional. Either `yes` or `no`. Whether the mutation occurs on both alleles of a single gene. |

Example file:

?> https://gist.githubusercontent.com/sehilyi/350b9e633c52ad97df00a0fc13a8839a/raw/c47b9ba33f1c9e187c69d1dadd01838db44d3b29/driver.txt