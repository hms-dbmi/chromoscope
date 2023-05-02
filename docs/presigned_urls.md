# Loading Private Data

This article details how to set up security credentials for an Amazon Web Services (AWS) account and temporarily visualize data stored in private S3 buckets (all public access blocked) via [presigned URLs](https://docs.aws.amazon.com/AmazonS3/latest/userguide/ShareObjectPreSignedURL.html).

## Prerequisites

### AWS Security Credentials Setup

In order to sign programmatic requests to an AWS account through the AWS Command Line Interface (CLI) or AWS APIs, the convention is to create a `.aws` directory in the computer's home folder, containing `config` and `credentials` files. The location of this directory is described in further detail in the AWS documentation [here](https://docs.aws.amazon.com/sdkref/latest/guide/file-location.html). 

These shared files should contain AWS access keys required for creation of presigned URLs (and overall AWS account access); these keys consist of an `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY`. The Access Key ID should not be shared casually, but the Secret Access Key should never be shared and is considered highly confidential. For security reasons, these keys should be [rotated regularly](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_access-keys.html#Using_RotateAccessKey).

Only [users with appropriate security credentials](https://docs.aws.amazon.com/AmazonS3/latest/userguide/using-presigned-url.html#who-presigned-url) can create presigned URLs: [Identity and Access Management (IAM) users](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_users.html), [IAM instance profiles](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_use_switch-role-ec2_instance-profiles.html) (an IAM role for EC2 instances), and users with credentials generated via the [AWS Security Token Service](https://docs.aws.amazon.com/STS/latest/APIReference/welcome.html). The main difference between these options is the maximum duration of generated presigned URLs: (1) up to 6 hours for an IAM instance profile, (2) up to 36 hours using the AWS Security Token Service, and (3) up to 7 days for IAM users.

?> [IAM best practices](https://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html) recommends accessing AWS using temporary credentials whenever possible, or rotating access keys regularly for use cases requiring long-term credentials. For more information on security considerations, refer to the AWS documentation [here](https://docs.aws.amazon.com/IAM/latest/UserGuide/security-creds.html).

For whichever set of credentials chosen, generate the appropriate AWS Access ID-key pair. A user-friendly way to generate access keys is using the [AWS console](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_access-keys.html#Using_CreateAccessKey). Save these values in the `~/.aws/credentials` file. It will look similar to the following:

```
[default]
aws_access_key_id=EXAMPLE
aws_secret_access_key=EXAMPLEKEY
```
where `[default]` defines these settings into the default *profile*, and the `aws_access_key_id` and `aws_secret_access_key` are where the access ID-key pair are saved. One must *not* use the word `profile` within the credentials file.

The corresponding `~/.aws/config` file will be similar to the following:

```
[default]
region=us-east-1
output=json
```
where `region` corresponds to the region of your IAM user (since AWS IAM is a region-based service) and `output` defines the AWS CLI output format (here it is `json`, the default output format of the AWS CLI).

?> For more information on the format of the configuration and credential files, follow the AWS documentation [here](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-files.html#cli-configure-files-format) or [here](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-quickstart.html#getting-started-quickstart-new). This documentation follows the format for the **"IAM Role"**.

?> More comprehensive documentation on the creation and configuration of basic settings with an IAM user can be found [here](https://docs.aws.amazon.com/cli/latest/userguide/cli-authentication-user.html).


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
The latter will list *all* items within the given bucket recursively. *boto3* is also utilized within example scripts for creating presigned URLs within this repository, so it is recommended to install this SDK if employing these scripts as templates.


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

