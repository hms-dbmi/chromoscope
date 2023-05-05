# Loading Private Data

This article details how to set up security credentials for an Amazon Web Services (AWS) account and temporarily visualize data stored in private S3 buckets (all public access blocked) via [presigned URLs](https://docs.aws.amazon.com/AmazonS3/latest/userguide/ShareObjectPreSignedURL.html).

## Prerequisites

### AWS Security Credentials Setup

In order to sign programmatic requests to an AWS account through the AWS Command Line Interface (CLI) or AWS APIs, the convention is to create a `.aws` directory in the computer's home folder, containing `config` and `credentials` files. The location of this directory is described in further detail in the AWS documentation [here](https://docs.aws.amazon.com/sdkref/latest/guide/file-location.html). 

These shared files should contain AWS access keys required for creation of presigned URLs (and overall AWS account access), consisting of an `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY`. For security reasons, these keys should be [rotated regularly](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_access-keys.html#Using_RotateAccessKey).

Only [users with appropriate security credentials](https://docs.aws.amazon.com/AmazonS3/latest/userguide/using-presigned-url.html#who-presigned-url) can create presigned URLs: [Identity and Access Management (IAM) users](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_users.html), [IAM instance profiles](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_use_switch-role-ec2_instance-profiles.html) (an IAM role for EC2 instances), and users with credentials generated via the [AWS Security Token Service](https://docs.aws.amazon.com/STS/latest/APIReference/welcome.html). The main difference between these options is the maximum duration of generated presigned URLs: (1) up to 6 hours for an IAM instance profile, (2) up to 36 hours using the AWS Security Token Service, and (3) up to 7 days for IAM users.

After generating the appropriate AWS Access ID-key pair [for the chosen type of user](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-quickstart.html#getting-started-prereqs-keys), refer to the following [AWS CLI documentation](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-files.html#cli-configure-files-format) to format the `config` and `credentials` files appropriately.

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


### AWS CLI Setup and Smoke Testing

Once credentials for an AWS account are set up, one can install the AWS CLI package and create presigned URLs. Follow the latest [AWS CLI documentation](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html) to install the latest release of AWS CLI version 2 (or a past release of your choice).

Check that the local AWS environment setup is functional using the following AWS CLI command in the terminal:

```
aws s3 ls <bucket_name>
```
which should list the files and subdirectories within the bucket `bucket_name`. 

One can also use [*boto3*](https://aws.amazon.com/sdk-for-python/), the AWS SDK for Python, using the following script after [installing this SDK](https://boto3.amazonaws.com/v1/documentation/api/latest/guide/quickstart.html):
```python
import boto3
bucket = s3.Bucket('<bucket_name>')
for bucket_obj in bucket.objects.all():
    print(bucket_obj.key)
```
The latter will list *all* items within the given bucket recursively. *boto3* is also utilized within [example scripts within this repository for creating presigned URLs for cohorts of samples](./cohort_configs.md).

## AWS Presigned URLs

By default, at creation, an S3 bucket and the objects it contains are private, and only object owners are able to access or visualize them. In order to share these objects temporarily with other users, the owner can create a [presigned URL](https://docs.aws.amazon.com/AmazonS3/latest/userguide/ShareObjectPreSignedURL.html), which provides a time-limited permission to view and/or download these private objects to non-owners.

Programmatically, a presigned URL can be created using the AWS CLI using the [`presign`](https://awscli.amazonaws.com/v2/documentation/api/latest/reference/s3/presign.html) function. One can also use AWS SDKs to generate presigned URLs, with functions such as [`generate_presigned_url`](https://boto3.amazonaws.com/v1/documentation/api/latest/guide/s3-presigned-urls.html) for the Python SDK *boto3*.

### Presigned URLs within Chromoscope

The ability to create presigned URLs not only allows for controlled, temporary visualization/sharing of private data, but also provides mode of sharing large amounts of data stored on the AWS cloud. Presigned URLs can be (1) used directly within a [Chromoscope configuration file](https://chromoscope.bio/docs/#/data-config?id=data-configuration), linking to data for individual samples (simple single-sample example below): 
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

