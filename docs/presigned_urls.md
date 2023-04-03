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

AWS presigned URLs grant access to S3 bucket data to whoever has the URL, so it is recommended to protect URL access and [limit URL capabilities](https://docs.aws.amazon.com/AmazonS3/latest/userguide/using-presigned-url.html#PresignedUrlUploadObject-LimitCapabilities) appropriately. To allow visualization of data via presigned URLs for the SVELT browser, set the [cross-origin resource sharing (CORS) configuration file](https://docs.aws.amazon.com/AmazonS3/latest/userguide/ManageCorsUsing.html) for the S3 bucket containing the private data to the following, [using the S3 console](https://docs.aws.amazon.com/AmazonS3/latest/userguide/enabling-cors-examples.html):

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

Once the IAM credentials within an AWS account are set up, you will now be able to install the AWS CLI package and create presigned URLs. Follow the latest [AWS CLI documentation](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html) to install the latest release of AWS CLI version 2 (or a past release of your choice).

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