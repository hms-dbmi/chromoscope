# Data Formats

This page describes file formats used in Chromoscope. To find a list of required and optional files, please refer to the [Data Configuration section](data-config.md#data-configuration).

## Structural Variants (BEDPE)
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
| `strand2` | `string` | Required. The strand for the second BP. Either `'+'` or `'-'`. |

Example file:

```
https://somatic-browser-test.s3.amazonaws.com/SVTYPE_SV_test_tumor_normal_with_panel.bedpe
```
## SV Type Mapping Table

|Inter-chromosomal SV types|`strand1`|`strand2`|
|---|---|---|
|Deletion|+|-|
|Inversion (head-to-head)|+|+|
|Inversion (tail-to-tail)|-|-|
|Duplication|-|+|

## CNV (TSV)
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

```
https://s3.amazonaws.com/gosling-lang.org/data/SV/7a921087-8e62-4a93-a757-fd8cdbe1eb8f.consensus.20170119.somatic.cna.annotated.txt
```

## Drivers (TSV or JSON)
<!-- https://bedtools.readthedocs.io/en/latest/content/general-usage.html#bedpe-format -->

The drivers are stored in a tab-delimited file. When this file is present, the browser will show drivers that are included in the file only.

The order of the columns does not need to be in the exact same order.

| Property | Type | Note |
|---|---|---|
| `chr` | `string` | Required. The name of the chromosome. _The names should contain `chr` prefix_, such as `chr2` and `chrX`. |
| `pos` | `number` | Required. The position of the driver. |
| `gene` | `string` | Required. The name of the driver. |
| `ref` | `string` | Optional. Information only shown on a tooltip. |
| `alt` | `string` | Optional. Information only shown on a tooltip. |
| `category` | `string` | Optional. Information only shown on a tooltip. |
| `top_category` | `string` | Optional. Information only shown on a tooltip. |
| `transcript_consequence` | `string` | Optional. Information only shown on a tooltip. |
| `protein_mutation` | `string` | Optional. Information only shown on a tooltip. |
| `allele_fraction` | `string` | Optional. Information only shown on a tooltip. |
| `mutation_type` | `string` | Optional. Information only shown on a tooltip. |
| `biallelic` | `string` | Required. Either `Yes` or `No`. Whether the mutation occurs on both alleles of a single gene. |

|![biallelic](../assets/biallelic.png ':class=image-small')|
|---|
|An annotation representing a biallelic mutation. |


Based on the `biallelic` value, the browser shows annotations near the gene name: 
- “⊙” for biallelic when the `biallelic` column is `"yes"`
- “.” for not biallelic (i.e., mono-allelic) when `"no"`
- no symbol when `undefined`

Example file:

```
https://gist.githubusercontent.com/sehilyi/350b9e633c52ad97df00a0fc13a8839a/raw/c47b9ba33f1c9e187c69d1dadd01838db44d3b29/driver.txt
```

## VCF & TBI

For point mutations and indels, we use standard VCF files along with tabix files. To generate the tabix file, you can run the following command:

```sh
tabix myfile.sorted.vcf.gz
```

Refer to the documentation of Samtools for details (https://www.htslib.org/doc/tabix.html).

!> The VCF files should be sorted and indexed to be able to make Chromoscope to properly show genomics features.

## BAM & BAI

For read alignments, we use standard BAM files along with BAI files. To generate the index file, you can run the following command:

```sh
samtools index myfile.sorted.bam.gz myfile.sorted.bam.bai
```

Refer to the documentation of Samtools for details (https://www.htslib.org/doc/samtools-index.html).

!> The BAM files should be sorted and indexed to be able to make Chromoscope to properly show genomics features.

## Data Sampling

For the efficient rendering of visualizations, entire data is not shown in the whole genome scale for point mutations and indels.

Chromoscope selects **500** [point mutations](#vcf-amp-tbi) in each visible tile. Given that showing dense point mutations are important the corresponding tracks, Chromoscope keeps point mutations with relatively small `DISTPREV` (i.e., distance to the previous mutation) and filter out mutations with relatively high `DISTPREV`.

Point mutations are selected dynamically based on the zoom level. Which means you can start to see more point mutations when you zoom in, allowing you to see all point mutations when you zoom in enough.