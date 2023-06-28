---
title: Cohort Config Creation
sidebar_position: 8
---

# Cohort Configuration File Creation Scripts Using Presigned URLs

## Overview

Two Python scripts are provided to automate the creation of configuration files using private data on an S3 bucket via presigned URLs, once the [setup prerequisites](./presigned_urls.md#prerequisites) have been met, since the AWS Python API `boto3` is used within these scripts. [create_presigned_urls.py](https://github.com/hms-dbmi/chromoscope/blob/master/scripts/presigned_url_scripts/create_presigned_urls.py) contains a function used to generate a presigned URL for a private object within an S3 object. [generate_config_files.py](https://github.com/hms-dbmi/chromoscope/blob/master/scripts/presigned_url_scripts/generate_config_files.py) accesses an S3 bucket containing private objects, generates a presigned URL for every object needed for the Chromoscope configuration file, creates the configuration file locally, then copies the newly created configuration file to the same S3 bucket and generates a presigned URL for it.

The latter script is designed to create Chromoscope configuration files for cohorts of samples, allowing a user to compare samples within the same cohort visually using Chromoscope. There are several requirements for successful execution of this script:
* Structure of a [TSV file containing sample IDs](#sample-id-list) is as expected
* [Directory structure](#subdirectory-structure) in the S3 bucket containing the private data is as expected
* [File formats](data-config.md#data-configuration) for different kinds of data are of correct type, i.e. correct file extensions are used
* All samples within the cohort have the same **cancer type** and same **assembly**



## Sample ID List

When creating a configuration file for a cohort using [generate_config_files.py](https://github.com/hms-dbmi/chromoscope/blob/master/scripts/presigned_url_scripts/generate_config_files.py), a tab-delimited file (TSV) is taken as input to define a list of sample IDs within the cohort. These sample IDs leverage the [expected structure of the subdirectories](#subdirectory-structure) within the S3 bucket to link appropriate files to their corresponding sample within the configuration file, as well as define the `id` property for each sample within the configuration file. **This file must include a column named `ID`, under which the sample IDs are defined,** and should be saved within the cohort's S3 directory.

?> Note: Samples are added to the configuration file in the order they are listed in the ID TSV file. To change the ordering of the samples within Chromoscope, the order can be manually altered within the ID file. 

## Subdirectory Structure

The configuration file creation script relies on an expected subdirectory structure within the S3 bucket, which is then accessed, sample-wise, according to the list of sample IDs from the submitted sample ID TSV file.

A cohort should have its own subdirectory within the S3 bucket containing the private data. For example, if there are `N` cohorts, the folder structure would be as follows within the bucket:
```bash
EXAMPLE_S3_BUCKET/
├── COHORT_1/
├── COHORT_2/
├── ...
└── COHORT_N/
```

Within the cohort's directory, the data should be subdivided into subdirectories corresponding to the following categories, with certain filetypes grouped together by sample (according to the [data formats](data-formats.md) documentation):

| Subdirectory | Number of files (per sample) | Filetypes | Required |
|---|---|---|---|
| Structural variants (SV) | 1 | `bedpe` | Yes |
| Copy number variants (CNV) | 1 | `tsv` | Yes |
| Driver mutations | 1 | `tsv` or `json` | No |
| Point mutations (SNV) | 2 | `vcf` and `tbi` | No |
| Insertion/deletion mutations (Indel) | 2 | `vcf` and `tbi` | No |
| Read alignments | 2 | `bam` and `bai` | No |
| Configuration files | - | `json` | No |

Each of these categories should contain sample-wise subdirectories, whose names match to their corresponding sample ID. For example, for the following ID list (provided via TSV file):
```tsv
ID
SAMPLE_1_ID
SAMPLE_2_ID
...
SAMPLE_N_ID
```
the S3 bucket subdirectory should be as follows:
```bash
EXAMPLE_S3_BUCKET/EXAMPLE_COHORT_NAME/   
├── EXAMPLE_ID_LIST.tsv                     # File containing sample IDs of this cohort (tsv)
├── SV_SUBDIR/                               # Contains SV files (bedpe)
│   ├── SAMPLE_1_ID/
│   │   └── example_sv_sample_1.bedpe
│   ├── ···
│   └── SAMPLE_N_ID/
│       └── example_sv_sample_n.bedpe
├── CNV_SUBDIR/                              # Contains CNV files (tsv)
│   ├── SAMPLE_1_ID/
│   │   └── example_cnv_sample_1.tsv
│   ├── ···
│   └── SAMPLE_N_ID/
│       └── example_cnv_sample_n.tsv
├── DRIVERS_SUBDIR/                          # Contains driver mutation files (tsv or json)
│   ├── SAMPLE_1_ID/
│   │   └── example_drivers_sample_1.tsv
│   ├── ···
│   └── SAMPLE_N_ID/
│       └── example_drivers_sample_n.tsv
├── SNV_SUBDIR/                              # Contains SNV files (vcf + tbi)
│   ├── SAMPLE_1_ID/
│   │   ├── example_snv_sample_1.vcf.gz
│   │   └── example_snv_sample_1.tbi
│   ├── ···
│   └── SAMPLE_N_ID/
│   │   ├── example_snv_sample_n.vcf.gz
│   │   └── example_snv_sample_n.tbi
├── INDEL_SUBDIR/                            # Contains indel files (vcf + tbi)
│   ├── SAMPLE_1_ID/
│   │   ├── example_indel_sample_1.vcf.gz
│   │   └── example_indel_sample_1.tbi
│   ├── ···
│   └── SAMPLE_N_ID/
│   │   ├── example_indel_sample_n.vcf.gz
│   │   └── example_indel_sample_n.tbi
├── READ_ALIGNMENTS_SUBDIR/                  # Contains read alignment files (bam + bai)
│   ├── SAMPLE_1_ID/
│   │   ├── example_reads_sample_1.bam
│   │   └── example_reads_sample_1.bai
│   ├── ···
│   └── SAMPLE_N_ID/
│   │    ├── example_reads_sample_n.bam
│   │    └── example_reads_sample_n.bai
└── CONFIGS_SUBDIR/                          # Contains timestamped configuration files (json)
    ├── example_config_a.json
    ├── example_config_b.json
    ├── ···
    └── example_config_z.json
```

?> The only categories that require subdirectories for *all* samples within the sample ID list are those for `SNV`s and `CNV`s. All other categories may contain some, all, or no sample subdirectories. If there is no sample data for a non-required category, that subdirectory need not be created.

?> The `configuration files` subdirectory, if not provided, is by default identified by the name **"CONFIGS"**. If it does not exist within the bucket, a new directory with this name will be created, and generated configuration files added to it. The configuration files are named by the time of their creation.

?> Note: If pairwise files don't pair correctly due to user error (e.g. a pair not of the same sample, not of correct file format), that category/parameter for that sample will not render within Chromoscope. This can be checked by manually inspecting samples within [cohort view](how-to-use.md#cohort-view).


## Creation Scripts Usage

### Dependencies

**Python version**: 3.8 and newer

[**Packages**](https://github.com/hms-dbmi/chromoscope/blob/master/scripts/presigned_url_scripts/requirements.txt):
- [boto3](https://boto3.amazonaws.com/v1/documentation/api/latest/index.html) (version 1.26.131)
- [pandas](https://pandas.pydata.org/) (version 2.0.1)

The usage of the configuration file creation script via command line is as follows:

```
python3 generate_config_files.py --ids IDS --bucket BUCKET --cohort COHORT --cancer CANCER --assembly ASSEMBLY --sv SV --cnv CNV [--drivers DRIVERS] [--snv SNV] [--indel INDEL] [--reads READS] [--configs CONFIGS] [--expiration EXPIR]
```
Required parameters provide information needed to access the cohort folder within an S3 bucket (`cohort`, `bucket`), identify the samples that will be added to the configuration file (`ids`), and define the required properties within the configuration file (`cancer`, `assembly`, `sv`, and `cnv`). The optional parameters provide additional information for optional properties within a configuration file (`drivers`, `snv`, `indel`, and `reads`), and details for the generated presigned URLs (`configs` and `expiration`). A summary of these parameters can be found in the table below:

| Parameter | Default | Description | Corresponding Configuration File Property |
|---|---|---|---|
| `ids` | - | Required. The name of the sample ID TSV file within S3 bucket's cohort subdirectory. | `id` |
| `bucket` | - | Required. The name of the S3 bucket containing the private data objects. | - |
| `cohort` | - | Required. The name of the cohort subdirectory within the S3 bucket. | - |
| `cancer` | - | Required. The type of cancer of the samples. | `cancer` |
| `assembly` | `'hg38'` or `'hg19'` | Required. The reference genome assembly for the samples. | `assembly` |
| `sv` | - | Required. The name of the subdirectory within the S3 bucket containing structural variant (SV) `bedpe` files. | `sv` |
| `cnv` | - | Required. The name of the subdirectory within the S3 bucket containing copy number variant (CNV) `tsv` files. | `cnv` |
| `drivers` | `None` | Optional. The name of the subdirectory within the S3 bucket containing driver mutation `tsv` or `json` files. | `drivers` |
| `snv` | `None` | Optional. The name of the subdirectory within the S3 bucket containing point mutation (SNV) `vcf` files and their corresponding index `tbi` files. | `vcf`, `vcfIndex` |
| `indel` | `None` | Optional. The name of the subdirectory within the S3 bucket containing indel `vcf` files and their corresponding index `tbi` files.  | `vcf2`, `vcf2Index` |
| `reads` | `None` | Optional. The name of the subdirectory within the S3 bucket containing read alignment `bam` files and their corresponding index `bai` files. | `bam`, `bamIndex` |
| `configs` | `'CONFIGS'` | Optional. The name of the subdirectory, both locally and within the S3 bucket, that will contain the generated Chromoscope configuration `json` file. | - |
| `expiration` | `3600` | Optional. The duration of the presigned URLs within and for the generated Chromoscope configuration file, in seconds. | - |

?> The `note` property of the configuration file is not handled here, since it is a direct textual annotation. Only properties that require a URL value (in addition to required properties) are defined using this script.

The remainder of the parameters, save `bucket` and `expiration`, again leverage the expected S3 subdirectory structure to access all relevant data, sample-wise, and generate presigned URLs for all of the private files needed. Based on the type of file and location within the bucket, the presigned URLs are used as input for their corresponding parameters within their sample-specific configuration object, and a configuration file is completed locally. Lastly, the newly created configuration file is uploaded to the S3 folder specified by `configs`, then a presigned URL is generated for that timestamped configuration file and outputted.


## Example

For an S3 bucket with the subdirectory structure [specified above in this documentation](#subdirectory-structure), which contains a cohort of sarcoma samples with an hg38 assembly, the call to the configuration file creation script via command line would be as follows, to generate presigned URLs that last 7 days:

```
python3 generate_config_files.py --ids EXAMPLE_ID_LIST.tsv --bucket EXAMPLE_S3_BUCKET --cohort EXAMPLE_COHORT_NAME --cancer sarcoma --assembly hg38 --sv SV_SUBDIR --cnv CNV_SUBDIR --drivers DRIVERS_SUBDIR --snv SNV_SUBDIR --indel INDEL_SUBDIR --reads READ_ALIGNMENTS_SUBDIR --configs CONFIGS_SUBDIR --expiration 604800
```

Example output:

```
upload: CONFIGS_SUBDIR/timestamp_at_creation.json to s3://EXAMPLE_S3_BUCKET/EXAMPLE_COHORT_NAME/CONFIGS_SUBDIR/timestamp_at_creation.json

Presigned URL for generated configuration file: https://EXAMPLE_S3_BUCKET.s3.amazonaws.com/EXAMPLE_COHORT_NAME/CONFIGS_SUBDIR/timestamp_at_creation.json?AWSAccessKeyId=AKIA5XXXXXXXXXX&Signature=xxxxxxxxxxxxxxxxxxx&Expires=1682969989

Complete Chromoscope URL for generated configuration file: https://chromoscope.bio/?external=https://EXAMPLE_S3_BUCKET.s3.amazonaws.com/EXAMPLE_COHORT_NAME/CONFIGS_SUBDIR/timestamp_at_creation.json?AWSAccessKeyId=AKIA5XXXXXXXXXX&Signature=xxxxxxxxxxxxxxxxxxx&Expires=1682969989
```