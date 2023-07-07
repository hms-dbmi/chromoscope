"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([[465],{3905:(e,t,a)=>{a.d(t,{Zo:()=>p,kt:()=>h});var n=a(7294);function r(e,t,a){return t in e?Object.defineProperty(e,t,{value:a,enumerable:!0,configurable:!0,writable:!0}):e[t]=a,e}function o(e,t){var a=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),a.push.apply(a,n)}return a}function i(e){for(var t=1;t<arguments.length;t++){var a=null!=arguments[t]?arguments[t]:{};t%2?o(Object(a),!0).forEach((function(t){r(e,t,a[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(a)):o(Object(a)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(a,t))}))}return e}function s(e,t){if(null==e)return{};var a,n,r=function(e,t){if(null==e)return{};var a,n,r={},o=Object.keys(e);for(n=0;n<o.length;n++)a=o[n],t.indexOf(a)>=0||(r[a]=e[a]);return r}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(n=0;n<o.length;n++)a=o[n],t.indexOf(a)>=0||Object.prototype.propertyIsEnumerable.call(e,a)&&(r[a]=e[a])}return r}var l=n.createContext({}),c=function(e){var t=n.useContext(l),a=t;return e&&(a="function"==typeof e?e(t):i(i({},t),e)),a},p=function(e){var t=c(e.components);return n.createElement(l.Provider,{value:t},e.children)},d="mdxType",u={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},m=n.forwardRef((function(e,t){var a=e.components,r=e.mdxType,o=e.originalType,l=e.parentName,p=s(e,["components","mdxType","originalType","parentName"]),d=c(a),m=r,h=d["".concat(l,".").concat(m)]||d[m]||u[m]||o;return a?n.createElement(h,i(i({ref:t},p),{},{components:a})):n.createElement(h,i({ref:t},p))}));function h(e,t){var a=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var o=a.length,i=new Array(o);i[0]=m;var s={};for(var l in t)hasOwnProperty.call(t,l)&&(s[l]=t[l]);s.originalType=e,s[d]="string"==typeof e?e:r,i[1]=s;for(var c=2;c<o;c++)i[c]=a[c];return n.createElement.apply(null,i)}return n.createElement.apply(null,a)}m.displayName="MDXCreateElement"},4871:(e,t,a)=>{a.r(t),a.d(t,{assets:()=>l,contentTitle:()=>i,default:()=>u,frontMatter:()=>o,metadata:()=>s,toc:()=>c});var n=a(7462),r=(a(7294),a(3905));const o={sidebar_position:7},i="Loading Private Data",s={unversionedId:"loading-data/loading-private-data",id:"loading-data/loading-private-data",title:"Loading Private Data",description:"This article details how to set up security credentials for an Amazon Web Services (AWS) account and temporarily visualize data stored in private S3 buckets (all public access blocked) via presigned URLs. Presigned URLs are used in provided scripts described in the following section, to create configuration files for large cohorts of sample data saved on private S3 buckets.",source:"@site/docs/loading-data/loading-private-data.md",sourceDirName:"loading-data",slug:"/loading-data/loading-private-data",permalink:"/docs/loading-data/loading-private-data",draft:!1,editUrl:"https://github.com/hms-dbmi/chromoscope/tree/master/docs/docs/loading-data/loading-private-data.md",tags:[],version:"current",sidebarPosition:7,frontMatter:{sidebar_position:7},sidebar:"docsSidebar",previous:{title:"Loading Local Data",permalink:"/docs/loading-data/local-data"},next:{title:"Cohort Config Creation",permalink:"/docs/loading-data/cohort-config-creation"}},l={},c=[{value:"Prerequisites",id:"prerequisites",level:2},{value:"AWS Security Credentials Setup",id:"aws-security-credentials-setup",level:3},{value:"CORS Configuration File",id:"cors-configuration-file",level:3},{value:"AWS CLI Setup and Smoke Testing",id:"aws-cli-setup-and-smoke-testing",level:3},{value:"AWS Presigned URLs",id:"aws-presigned-urls",level:2},{value:"Presigned URLs within Chromoscope",id:"presigned-urls-within-chromoscope",level:3}],p={toc:c},d="wrapper";function u(e){let{components:t,...a}=e;return(0,r.kt)(d,(0,n.Z)({},p,a,{components:t,mdxType:"MDXLayout"}),(0,r.kt)("h1",{id:"loading-private-data"},"Loading Private Data"),(0,r.kt)("p",null,"This article details how to set up security credentials for an Amazon Web Services (AWS) account and temporarily visualize data stored in private S3 buckets (all public access blocked) via ",(0,r.kt)("a",{parentName:"p",href:"https://docs.aws.amazon.com/AmazonS3/latest/userguide/ShareObjectPreSignedURL.html"},"presigned URLs"),". Presigned URLs are used in provided scripts described in the ",(0,r.kt)("a",{parentName:"p",href:"./cohort-config-creation"},"following section"),", to create configuration files for large cohorts of sample data saved on private S3 buckets."),(0,r.kt)("h2",{id:"prerequisites"},"Prerequisites"),(0,r.kt)("h3",{id:"aws-security-credentials-setup"},"AWS Security Credentials Setup"),(0,r.kt)("p",null,"In order to sign programmatic requests to an AWS account through the AWS Command Line Interface (CLI) or AWS APIs, the convention is to create a ",(0,r.kt)("inlineCode",{parentName:"p"},".aws")," directory in the computer's home folder, containing ",(0,r.kt)("inlineCode",{parentName:"p"},"config")," and ",(0,r.kt)("inlineCode",{parentName:"p"},"credentials")," files. The location of this directory is described in further detail in the AWS documentation ",(0,r.kt)("a",{parentName:"p",href:"https://docs.aws.amazon.com/sdkref/latest/guide/file-location.html"},"here"),". "),(0,r.kt)("p",null,"These shared files should contain AWS access keys required for creation of presigned URLs (and overall AWS account access), consisting of an ",(0,r.kt)("inlineCode",{parentName:"p"},"AWS_ACCESS_KEY_ID")," and ",(0,r.kt)("inlineCode",{parentName:"p"},"AWS_SECRET_ACCESS_KEY"),". For security reasons, these keys should be ",(0,r.kt)("a",{parentName:"p",href:"https://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_access-keys.html#Using_RotateAccessKey"},"rotated regularly"),"."),(0,r.kt)("p",null,"Only ",(0,r.kt)("a",{parentName:"p",href:"https://docs.aws.amazon.com/AmazonS3/latest/userguide/using-presigned-url.html#who-presigned-url"},"users with appropriate security credentials")," can create presigned URLs: ",(0,r.kt)("a",{parentName:"p",href:"https://docs.aws.amazon.com/IAM/latest/UserGuide/id_users.html"},"Identity and Access Management (IAM) users"),", ",(0,r.kt)("a",{parentName:"p",href:"https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_use_switch-role-ec2_instance-profiles.html"},"IAM instance profiles")," (an IAM role for EC2 instances), and users with credentials generated via the ",(0,r.kt)("a",{parentName:"p",href:"https://docs.aws.amazon.com/STS/latest/APIReference/welcome.html"},"AWS Security Token Service"),". The main difference between these options is the maximum duration of generated presigned URLs: (1) up to 6 hours for an IAM instance profile, (2) up to 36 hours using the AWS Security Token Service, and (3) up to 7 days for IAM users."),(0,r.kt)("p",null,"After generating the appropriate AWS Access ID-key pair ",(0,r.kt)("a",{parentName:"p",href:"https://docs.aws.amazon.com/cli/latest/userguide/getting-started-quickstart.html#getting-started-prereqs-keys"},"for the chosen type of user"),", refer to the following ",(0,r.kt)("a",{parentName:"p",href:"https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-files.html#cli-configure-files-format"},"AWS CLI documentation")," to format the ",(0,r.kt)("inlineCode",{parentName:"p"},"config")," and ",(0,r.kt)("inlineCode",{parentName:"p"},"credentials")," files appropriately."),(0,r.kt)("h3",{id:"cors-configuration-file"},"CORS Configuration File"),(0,r.kt)("p",null,"AWS presigned URLs grant access to S3 bucket data to whoever has the URL, so it is recommended to protect URL access and ",(0,r.kt)("a",{parentName:"p",href:"https://docs.aws.amazon.com/AmazonS3/latest/userguide/using-presigned-url.html#PresignedUrlUploadObject-LimitCapabilities"},"limit URL capabilities")," appropriately. To allow visualization of data via presigned URLs for the Chromoscope browser, set the ",(0,r.kt)("a",{parentName:"p",href:"https://docs.aws.amazon.com/AmazonS3/latest/userguide/ManageCorsUsing.html"},"cross-origin resource sharing (CORS) configuration file")," for the S3 bucket containing the private data to the following, ",(0,r.kt)("a",{parentName:"p",href:"https://docs.aws.amazon.com/AmazonS3/latest/userguide/enabling-cors-examples.html"},"using the S3 console"),":"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-json"},'[\n    {\n        "AllowedHeaders": [\n            "*"\n        ],\n        "AllowedMethods": [\n            "GET"\n        ],\n        "AllowedOrigins": [\n            "*"\n        ],\n        "ExposeHeaders": []\n    }\n]\n')),(0,r.kt)("h3",{id:"aws-cli-setup-and-smoke-testing"},"AWS CLI Setup and Smoke Testing"),(0,r.kt)("p",null,"Once credentials for an AWS account are set up, one can install the AWS CLI package and create presigned URLs. Follow the latest ",(0,r.kt)("a",{parentName:"p",href:"https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html"},"AWS CLI documentation")," to install the latest release of AWS CLI version 2 (or a past release of your choice)."),(0,r.kt)("p",null,"Check that the local AWS environment setup is functional using the following AWS CLI command in the terminal:"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre"},"aws s3 ls <bucket_name>\n")),(0,r.kt)("p",null,"which should list the files and subdirectories within the bucket ",(0,r.kt)("inlineCode",{parentName:"p"},"bucket_name"),". "),(0,r.kt)("p",null,"One can also use ",(0,r.kt)("a",{parentName:"p",href:"https://aws.amazon.com/sdk-for-python/"},(0,r.kt)("em",{parentName:"a"},"boto3")),", the AWS SDK for Python, using the following script after ",(0,r.kt)("a",{parentName:"p",href:"https://boto3.amazonaws.com/v1/documentation/api/latest/guide/quickstart.html"},"installing this SDK"),":"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-python"},"import boto3\nbucket = s3.Bucket('<bucket_name>')\nfor bucket_obj in bucket.objects.all():\n    print(bucket_obj.key)\n")),(0,r.kt)("p",null,"The latter will list ",(0,r.kt)("em",{parentName:"p"},"all")," items within the given bucket recursively. ",(0,r.kt)("em",{parentName:"p"},"boto3")," is also utilized within ",(0,r.kt)("a",{parentName:"p",href:"./cohort-config-creation"},"example scripts within this repository for creating presigned URLs for cohorts of samples"),"."),(0,r.kt)("h2",{id:"aws-presigned-urls"},"AWS Presigned URLs"),(0,r.kt)("p",null,"By default, at creation, an S3 bucket and the objects it contains are private, and only object owners are able to access or visualize them. In order to share these objects temporarily with other users, the owner can create a ",(0,r.kt)("a",{parentName:"p",href:"https://docs.aws.amazon.com/AmazonS3/latest/userguide/ShareObjectPreSignedURL.html"},"presigned URL"),", which provides a time-limited permission to view and/or download these private objects to non-owners."),(0,r.kt)("p",null,"Programmatically, a presigned URL can be created using the AWS CLI using the ",(0,r.kt)("a",{parentName:"p",href:"https://awscli.amazonaws.com/v2/documentation/api/latest/reference/s3/presign.html"},(0,r.kt)("inlineCode",{parentName:"a"},"presign"))," function. One can also use AWS SDKs to generate presigned URLs, with functions such as ",(0,r.kt)("a",{parentName:"p",href:"https://boto3.amazonaws.com/v1/documentation/api/latest/guide/s3-presigned-urls.html"},(0,r.kt)("inlineCode",{parentName:"a"},"generate_presigned_url"))," for the Python SDK ",(0,r.kt)("em",{parentName:"p"},"boto3"),"."),(0,r.kt)("h3",{id:"presigned-urls-within-chromoscope"},"Presigned URLs within Chromoscope"),(0,r.kt)("p",null,"The ability to create presigned URLs not only allows for controlled, temporary visualization/sharing of private data, but also provides mode of sharing large amounts of data stored on the AWS cloud. Presigned URLs can be (1) used directly within a ",(0,r.kt)("a",{parentName:"p",href:"./through-data-config"},"Chromoscope configuration file"),", linking to data for individual samples (simple single-sample example below): "),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-json"},'[\n    {\n        "id": "EXAMPLE_ID",\n        "cancer": "breast",\n        "assembly": "hg19",\n        "sv": "https://EXAMPLE_BUCKET.s3.us-east-1.amazonaws.com/myobject.somatic.sv.bedpe?AWSAccessKeyId=AKIAEXAMPLEXXX&Expires=604800&Signature=alA%WOIDHCSha",\n        "cnv": "https://EXAMPLE_BUCKET.s3.us-east-1.amazonaws.com/myobject.somatic.cna.annotated.tsv?AWSAccessKeyId=AKIAEXAMPLEXXX&Expires=604800&Signature=jj321dtg2s%3ibOGf"\n    }\n]\n')),(0,r.kt)("p",null,"and/or (2) as a temporary URL for the configuration file itself (if it is saved as a private object within an S3 bucket), used as the argument for ",(0,r.kt)("a",{parentName:"p",href:"./url-parameters"},"the ",(0,r.kt)("inlineCode",{parentName:"a"},"external")," parameter of a Chromoscope URL"),":"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre"},"// format\nhttps://chromoscope.bio/?external=[PRESIGNED_URL_FOR_YOUR_CONFIG_FILE]\n\n// example\nhttps://chromoscope.bio/?external=https://EXAMPLE_BUCKET.s3.us-east-1.amazonaws.com/myobject.configfile?AWSAccessKeyId=AKIAEXAMPLEXXX&Expires=604800&Signature=ibOGfAovnhASUASsdasjj321\n")))}u.isMDXComponent=!0}}]);