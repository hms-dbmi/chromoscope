# Loading Private Data

This article details how to set up security credentials for an Amazon Web Services (AWS) account and temporarily visualize data stored in private S3 buckets (all public access blocked) via [presigned URLs](https://docs.aws.amazon.com/AmazonS3/latest/userguide/ShareObjectPreSignedURL.html).

## Prerequisites

### AWS Security Credentials Setup

In order to sign programmatic requests to an AWS account through the AWS Command Line Interface (CLI) or AWS APIs, the convention is to create a `.aws` directory in the computer's home folder, containing `config` and `credentials` files. The location of this directory is described in further detail in the AWS documentation [here](https://docs.aws.amazon.com/sdkref/latest/guide/file-location.html). 

These shared files should contain AWS access keys required for creation of presigned URLs (and overall AWS account access); these keys consist of an `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY`. The Access Key ID should not be shared casually, but the Secret Access Key should never be shared and is considered highly confidential. For security reasons, these keys should be [rotated regularly](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_access-keys.html#Using_RotateAccessKey).

Only [users with appropriate security credentials](https://docs.aws.amazon.com/AmazonS3/latest/userguide/using-presigned-url.html#who-presigned-url) can create presigned URLs: [Identity and Access Management (IAM) users](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_users.html), [IAM instance profiles](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_use_switch-role-ec2_instance-profiles.html) (an IAM role for EC2 instances), and credentials generated via the AWS Security Token Service. The difference between these credentials presigned URLs generated with credentials for an (1) IAM instance profile is valid for up to 6 hours, (2) AWS Security Token Service is valid up to 36 hours when signed with permanent credentials, and (3) IAM user is valid up to 7 days. 

For whichever set of credentials chosen, generate the appropriate AWS access ID-key pair. For the purposes of this documentation, generation of presigned URLs for an IAM user will be described, but follow AWS documentation to generate these keys for [EC2 instances](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-key-pairs.html) and through the [AWS Security Token Service](https://docs.aws.amazon.com/STS/latest/APIReference/welcome.html). For IAM user profiles, a user-friendly way to generate access keys is using the [AWS console](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_access-keys.html#Using_CreateAccessKey), by navigating to the **Security credentials** tab under the appropriate user within the **IAM** (Identity and Access Management) area in the console and generating secret access keys. Save these values in the `~/.aws/credentials` file (`C:\Users\%USERPROFILE%\.aws\credentials` for Windows users). It will look similar to the following:

```
[default]
aws_access_key_id=EXAMPLE
aws_secret_access_key=EXAMPLEKEY
```
where `[default]` defines these settings into the default *profile*, and the `aws_access_key_id` and `aws_secret_access_key` are where the access ID-key pair are saved. One must *not* use the word `profile` within the credentials file.

The corresponding `~/.aws/config` file (`C:\Users\%USERPROFILE%\.aws\config` for Windows) will be similar to the following:

```
[default]
region=us-east-1
output=json
```
where `region` corresponds to the region of your IAM user (since AWS IAM is a region-based service) and `output` defines the AWS CLI output format (here it is `json`, the default output format of the AWS CLI).

?> For more information on the format of the configuration and credential files, follow the AWS documentation [here](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-files.html#cli-configure-files-format) or [here](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-quickstart.html#getting-started-quickstart-new). This documentation follows the format for the **"IAM Role"**.

?> More comprehensive documentation on the creation and configuration of basic settings with an IAM user can be found [here](https://docs.aws.amazon.com/cli/latest/userguide/cli-authentication-user.html).

?> [IAM best practices](https://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html) recommends accessing AWS using temporary credentials whenever possible, or rotating access keys regularly for use cases requiring long-term credentials. For more information on security considerations, refer to the AWS documentation [here](https://docs.aws.amazon.com/IAM/latest/UserGuide/security-creds.html).

&nbsp;
### CORS Configuration File

AWS presigned URLs grant access to S3 bucket data to whoever has the URL, so it is recommended to protect URL access and [limit URL capabilities](https://docs.aws.amazon.com/AmazonS3/latest/userguide/using-presigned-url.html#PresignedUrlUploadObject-LimitCapabilities) appropriately. To allow visualization of data via presigned URLs for the Chromoscope browser, set the [cross-origin resource sharing (CORS) configuration file](https://docs.aws.amazon.com/AmazonS3/latest/userguide/ManageCorsUsing.html) for the S3 bucket containing the private data to the following, [using the S3 console](https://docs.aws.amazon.com/AmazonS3/latest/userguide/enabling-cors-examples.html):

```json
[
    {
        "AllowedHeaders": [
            "*"
        ],
        "AllowedMethods": [
            "GET"
        ],
        "AllowedOrigins": [
            "*"
        ],
        "ExposeHeaders": []
    }
]
```

&nbsp;
### AWS CLI Setup and Smoke Testing

Once the IAM credentials within an AWS account are set up, you can install the AWS CLI package and create presigned URLs. Follow the latest [AWS CLI documentation](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html) to install the latest release of AWS CLI version 2 (or a past release of your choice).

Once installation is complete, you can check that the local AWS environment setup is functional using:

```
aws s3 ls <bucket_name>
```
which should list the files and subdirectories within the bucket `bucket_name` containing the data you would like to share via presigned URL. You can also use [*boto3*](https://aws.amazon.com/sdk-for-python/), the AWS SDK for Python, using the following script after [installing this SDK](https://boto3.amazonaws.com/v1/documentation/api/latest/guide/quickstart.html):
```python
import boto3
bucket = s3.Bucket('<bucket_name>')
for bucket_obj in bucket.objects.all():
    print(bucket_obj.key)
```
The latter will list *all* items within the given bucket recursively. *boto3* is also utilized within example scripts for creating presigned URLs within this repository, so it is recommended to install this SDK if employing these scripts are templates.

&nbsp;
## AWS Presigned URLs

By default, at creation, an S3 bucket and the objects it contains are private, and only object owners are able to access or visualize them. In order to share these objects temporarily with other users, the owner can create a presigned URL, which provides a time-limited permission to view and/or download these private objects to non-owners. Presigned URLs can also be created for [uploading objects](https://docs.aws.amazon.com/AmazonS3/latest/userguide/PresignedUrlUploadObject.html) to an S3 bucket, but for use within a Chromoscope configuration file, presigned URLs will be created in order to [share private objects](https://docs.aws.amazon.com/AmazonS3/latest/userguide/ShareObjectPreSignedURL.html) temporarily.

When creating a presigned URL for a specified object, the following must be provided:

* Security credentials (set up in prior documentation)
* S3 bucket name
* Object key (i.e. relative path name of object within the bucket)
* HTTP method (e.g. GET request for downloading)
* URL duration (expiration time)

Programmatically, a presigned URL can be created using the AWS CLI or AWS SDKs such as *boto3*. The following code snippet shows the use of the AWS CLI function `presign` to generate a presigned URL through the command line terminal, which allows for retrieval of an S3 object with an HTTP GET request:

```
aws s3 presign s3://EXAMPLE_BUCKET/EXAMPLE_OBJECT
```
This generates a URL for the `EXAMPLE_OBJECT`, which lives within the `EXAMPLE_BUCKET`, and expires in 3600 seconds (default). If you want to change the time duration of the URL, provide an integer value using the `--expires-in` option; the maximum length possible is 604800 seconds (7 days), as specified in the following example:
```
aws s3 presign s3://EXAMPLE_BUCKET/EXAMPLE_OBJECT --expires-in 604800
```
Example output:
```
https://EXAMPLE_BUCKET.s3.us-east-1.amazonaws.com/myobject?AWSAccessKeyId=AKIAEXAMPLEXXX&Expires=604800&Signature=ibOGfAovnhASUASsdasjj321dtg2s%3D
```
?> Note: When presigned URLs are created using the security credentials of an IAM user, the URL can last up to 7 days. When using a temporary token, the URL expires when the token expires, even if the specified time duration is longer.

For further optional arguments of this AWS CLI function, see the detailed documentation [here](https://awscli.amazonaws.com/v2/documentation/api/latest/reference/s3/presign.html).

One can also use AWS SDKs like *boto3* for Python to generate presigned URLs, using the `generate_presigned_url` function, using the [following script](../scripts/presigned_url_scripts/create_presigned_urls.py):
```python
import boto3
from botocore.exceptions import ClientError

def generate_presigned_URL(bucket_name, object_path, expiration=3600):
    """
    Generates a presigned URL that can be used to share a private S3 object.

    :param bucket_name: The name of S3 bucket containing private objects.
    :type bucket_name: string
    :param object_path: The relative path of S3 object to be shared via presigned URL.
    :type object_path: string
    :param expiration: The number of seconds the presigned URL is valid for.
    :type expiration: int
    :return: The presigned URL.
    :rtype: string or None
    """

    # Create low-level S3 service client
    s3_client = boto3.client("s3")

    try:
        # URL generated by AWS user with access to private object (i.e. the owner)
        url = s3_client.generate_presigned_url(
            ClientMethod="get_object", # HTTP Method
            Params={
                "Bucket": bucket_name, # S3 bucket
                "Key": object_path # relative object path
            },
            ExpiresIn=expiration # URL duration in seconds
        )
    except ClientError as err:
        print(err)
        logging.error(err)
        return None

    # Return the presigned URL as a string
    return url
```
Further information on this *boto3* function can be found [here](https://boto3.amazonaws.com/v1/documentation/api/latest/guide/s3-presigned-urls.html).

Non-programmatically, a presigned URL can be generated using the S3 console or AWS Explorer for Visual Studio – [comprehensive documentation on presigned URLs can be found here](https://docs.aws.amazon.com/AmazonS3/latest/userguide/using-presigned-url.html). Once a presigned URL is created for a private object, it can be used within Chromoscope configuration files to temporarily visualize these private files.

&nbsp;
## Configuration File Creation Using Presigned URLs

### Presigned URLs within Chromoscope

The ability to create presigned URLs not only allows for controlled, temporary visualization/sharing of private data, but also provides mode of sharing large amounts of data stored on the AWS cloud. Presigned URLs can be (1) used directly within a Chromoscope configuration file, linking to data for individual samples (simple single-sample example below): 
```json
[
    {
        "id": "EXAMPLE_ID",
        "cancer": "breast",
        "assembly": "hg19",
        "sv": "https://EXAMPLE_BUCKET.s3.us-east-1.amazonaws.com/myobject.somatic.sv.bedpe?AWSAccessKeyId=AKIAEXAMPLEXXX&Expires=604800&Signature=alA%WOIDHCSha",
        "cnv": "https://EXAMPLE_BUCKET.s3.us-east-1.amazonaws.com/myobject.somatic.cna.annotated.tsv?AWSAccessKeyId=AKIAEXAMPLEXXX&Expires=604800&Signature=jj321dtg2s%3ibOGf"
    }
]
```

and/or (2) as a temporary URL for the configuration file itself (if it is saved as a private object within an S3 bucket), used as the argument for [the `external` parameter of a Chromoscope URL](url-parameters.md):
```
// format
https://chromoscope.bio/?external=[PRESIGNED_URL_FOR_YOUR_CONFIG_FILE]

// example
https://chromoscope.bio/?external=https://EXAMPLE_BUCKET.s3.us-east-1.amazonaws.com/myobject.configfile?AWSAccessKeyId=AKIAEXAMPLEXXX&Expires=604800&Signature=ibOGfAovnhASUASsdasjj321
```

&nbsp;
### Configuration File Creation Scripts: Overview

Two Python scripts are provided to automate the creation of configuration files using private data on an S3 bucket via presigned URLs, once the prerequisites described above have been met, since the AWS CLI and Python API are used within these scripts. [create_presigned_urls.py](../scripts/presigned_url_scripts/create_presigned_urls.py) contains a function used to generate a presigned URL of a private object within an S3 object. [generate_config_files.py](../scripts/presigned_url_scripts/generate_config_files.py) accesses a (provided) S3 bucket containing private objects, generates a presigned URL for every object needed in the Chromoscope configuration file (calling the function defined in the prior script), creates the configuration file locally, then copies the newly created configuration file to the same S3 bucket and generates a presigned URL for it.

The latter script is designed to create Chromoscope configuration files for cohorts of samples, allowing for a user to compare samples within the same cohort visually using Chromoscope. There are several assumptions made for successful execution of this script, and will be expanded on below:
* Structure of the input TSV file containing sample IDs is as expected
* Directory structure in the S3 bucket containing the private data is as expected
* File formats for different kinds of data are of correct type, i.e. correct file extensions are used
* All samples are of the same **cancer type** and have the same **assembly**
* TODO: same directory as the other script

The following dependencies must also be met:
* Python version: 3+
* Packages:
  * TODO: requirements and versions
  * list requirements.txt (i used a conda environment)

&nbsp;
### Configuration File Creation Scripts: Sample ID List

The first step completed when [generate_config_files.py](../scripts/presigned_url_scripts/generate_config_files.py) is executed is the definition of the list the sample IDs, from the TSV file passed into the parameter `ids`. These sample IDs leverage the expected structure of the subdirectories within the S3 bucket (see the following section) to link appropriate files to their corresponding sample within the configuration file, as well as define the `id` property for each sample within the configuration file.

The file used for this must be a tab-delimited file (TSV) that includes (but not limited to) a column named `ID`. The following example list, containing `n` samples:

```tsv
ID
SAMPLE_1_ID
SAMPLE_2_ID
...
SAMPLE_N_ID
```
will be converted to the following ID list:
```
[SAMPLE_1_ID, SAMPLE_2_ID,..., SAMPLE_N_ID]
```
Using this list, sample-wise configuration JSON objects are created iteratively, until all the objects are generated for all samples within the cohort. These IDs also correspond to subdirectories within the S3 bucket that contain that sample's files.

?> Note: Samples are added to the configuration file in the order they are listed in the ID TSV file. To change the ordering of the samples within Chromoscope, the order can be manually altered within the ID file. Refer to the [following documentation](../scripts/clustering/README.md) for an explanation of hierarchical clustering using the Euclidean metric as a distance measure.

&nbsp;
### Configuration File Creation Scripts: S3 Bucket Subirectory Structure

The configuration file creation script relies on an expected subdirectory structure within the S3 bucket, which is then accessed, sample-wise, according to the list of sample IDs from the submitted sample ID tsv file.

If there are several cohorts within the S3 bucket containing the private data, each should have their own subdirectory:
```bash
EXAMPLE_S3_BUCKET/
├── COHORT_1/
├── COHORT_2/
├── ...
└── COHORT_N/
```
Otherwise, if there is only one cohort within the bucket, ignore the above.

For the following level, the data should be subdivided into subdirectories corresponding to the following categories, with certain filetypes grouped together by sample (according the [data formats](data-formats.md) documentation):
| Subdirectory | Number of files (per sample) | Filetypes | Required |
|---|---|---|---|
| Structural variants (SV) | 1 | `bedpe` | Yes |
| Copy number variants (CNV) | 1 | `tsv` | Yes |
| Driver mutations | 1 | `tsv`, `json` | No |
| Point mutations (SNV) | 2 | `vcf` + `tbi` | No |
| Insertion/deletion mutations (Indel) | 2 | `vcf` + `tbi` | No |
| Read alignments | 2 | `bam` + `bai` | No |
| Configuration files | - | `json` | No |

Within each of these categories, there will be sample-wise subdirectories, whose names should match their sample ID. For example, for the following ID list (provided via TSV file):
```tsv
ID
SAMPLE_1_ID
SAMPLE_2_ID
...
SAMPLE_N_ID
```
the S3 bucket subdirectory should be as follows:
```bash
EXAMPLE_S3_BUCKET/{EXAMPLE_COHORT_NAME/}    # Cohort value only necessary when 2+ cohorts in same bucket
├── EXAMPLE_ID_LIST.tsv                     # File containing sample IDs of this cohort (tsv)
├── SV_SUBDIR                               # Contains SV files (bedpe)
│   ├── SAMPLE_1_ID
│   │   └── example_sv_sample_1.bedpe
│   ├── ···
│   └── SAMPLE_N_ID
│       └── example_sv_sample_n.bedpe
├── CNV_SUBDIR                              # Contains CNV files (tsv)
│   ├── SAMPLE_1_ID
│   │   └── example_cnv_sample_1.tsv
│   ├── ···
│   └── SAMPLE_N_ID
│       └── example_cnv_sample_n.tsv
├── DRIVERS_SUBDIR                          # Contains driver mutation files (tsv or json)
│   ├── SAMPLE_1_ID
│   │   └── example_drivers_sample_1.tsv
│   ├── ···
│   └── SAMPLE_N_ID
│       └── example_drivers_sample_n.tsv
├── SNV_SUBDIR                              # Contains SNV files (vcf + tbi)
│   ├── SAMPLE_1_ID
│   │   ├── example_snv_sample_1.vcf.gz
│   │   └── example_snv_sample_1.tbi
│   ├── ···
│   └── SAMPLE_N_ID
│   │   ├── example_snv_sample_n.vcf.gz
│   │   └── example_snv_sample_n.tbi
├── INDEL_SUBDIR                            # Contains indel files (vcf + tbi)
│   ├── SAMPLE_1_ID
│   │   ├── example_indel_sample_1.vcf.gz
│   │   └── example_indel_sample_1.tbi
│   ├── ···
│   └── SAMPLE_N_ID
│   │   ├── example_indel_sample_n.vcf.gz
│   │   └── example_indel_sample_n.tbi
├── READ_ALIGNMENTS_SUBDIR                  # Contains read alignment files (bam + bai)
│   ├── SAMPLE_1_ID
│   │   ├── example_reads_sample_1.bam
│   │   └── example_reads_sample_1.bai
│   ├── ···
│   └── SAMPLE_N_ID
│   │    ├── example_reads_sample_n.bam
│   │    └── example_reads_sample_n.bai
└── CONFIGS_SUBDIR                          # Contains timestamped configuration files (json)
    ├── example_config_a.json
    ├── example_config_b.json
    ├── ···
    └── example_config_z.json
```

?> The only categories that require subdirectories for *all* samples within the sample ID list are those for `SNV`s and `CNV`s. All other categories may contain some, all, or no sample subdirectories. If there is no sample data for a non-required category, that subdirectory need not be created.

?> The `configuration files` subdirectory, if not provided, is by default identified by the name **"CONFIGS"**. If it does not exist within the bucket, a new directory with this name will be created, and generated configuration files added to it. The configuration files are named by the time of their creation.

?> Note: If pairwise files don't pair correctly due to user error (e.g. a pair not of the same sample, not of correct file format), that category/parameter for that sample will not render within Chromoscope. This can be checked by manually inspecting samples within [cohort view](how-to-use.md#cohort-view).

&nbsp;
### Configuration File Creation Scripts: Usage

The usage of the configuration file creation script via command line is as follows:

```
python3 generate_config_files.py --ids IDS --bucket BUCKET [--cohort COHORT] --cancer CANCER --assembly ASSEMBLY --sv SV --cnv CNV [--drivers DRIVERS] [--snv SNV] [--indel INDEL] [--reads READS] [--configs CONFIGS] [--expiration EXPIR]
```
Required parameters provide information needed to access the S3 bucket (`bucket`), identify the samples that will be added to the configuration file (`ids`), and define the required properties within the configuration file (`cancer`, `assembly`, `sv`, and `cnv`). The optional parameters provide additional information for optional properties within a configuration file (`drivers`, `snv`, `indel`, and `reads`), and details for the generated presigned URLs (`configs` and `expiration`). Additional details can be found in the table below:

| Parameter | Default | Description | Corresponding Configuration File Property |
|---|---|---|---|
| `ids` | - | Required. The name of the sample ID TSV file within S3 bucket. | `id` |
| `bucket` | - | Required. The name of the S3 bucket containing the private data objects. | - |
| `cohort` | `None` | Optional. The name of the cohort subdirectory within the S3 bucket. | - |
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



The remainder of the parameters, save `bucket` and `expiration`, again leverage the expected S3 subdirectory structure


 [create_presigned_urls.py](../scripts/presigned_url_scripts/create_presigned_urls.py) contains a function used to generate a presigned URL of a private object within an S3 object. [generate_config_files.py](../scripts/presigned_url_scripts/generate_config_files.py) accesses a (provided) S3 bucket containing private objects, generates a presigned URL for every object needed in the Chromoscope configuration file (calling the function defined in the prior script), creates the configuration file locally, then copies the newly created configuration file to the same S3 bucket and generates a presigned URL for it.

- what the overall function does: generates a presigned url for every object needed in the config file. makes the config file locally, uploads to config folder within S3, then generates a presigned URL for that new timestamped config file


- TODO: put an example output here
- give example python command with this dummy directory structure



TODO:
- tell to check properties manually in cohort view -- create note?
- unclear if adding sample manually via browser will modify the existing configuration file (it wont...right?)
- pattern xlsx missing in the clustering code
- note that configs folder must not already be existing, that's optional
- change create id list to just read tsv
- check of whether a sample doesn't exist -- happens in list items in bucket dir, add note to docs that this happens
- this is assuming there is only one cohort per s3 bucket at any given time....add cohort subfolder??
- change description of arguments within script
- docs say drivers are tab delimited but json is technically not tab delimited
- error check of tsv file not including id header, and change helper function to read_tsv
- change location of helper functions
- output should include when created, and how long it will last