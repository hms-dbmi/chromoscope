import argparse
import os
from datetime import datetime
from json import dump
from create_presigned_urls import *


"""
TODO: switch goscan to svelt
TODO: change this description
bucket name = "vstevens-somatic-browser-data-mpnst"

python3 generate_config_files.py --ids ID_list.tsv --bucket vstevens-somatic-browser-data-mpnst --cancer sarcoma --assembly hg38 --sv SV --cnv CNV --snv SNV --indel INDEL --drivers DRIVERS --expiration 604800

python3 generate_config_files_draft.py --ids ids.txt --bucket vstevens-somatic-browser-data-mpnst --cancer sarcoma --assembly hg38 --sv sv_test --cnv cnv_test --drivers drivers_test --snv snv_test --indel indel_test --reads read_test --expiration 604800

"""
#### Constants
REQUIRED_PROPERTIES = ["id", "cancer", "assembly", "sv", "cnv"]

def fill_property_values(config_object, sample_id, s3_bucket_name, s3_directory_name, properties, file_suffixes, expiration):
    """
    Given properties (and corresponding file suffixes) for a SVELT configuration file, a sample ID, 
    and an S3 bucket directory name, create presigned URLs for given properties 
    and add to configuration object (dictionary).

    Note: "properties" and "file_suffixes" lists must be index-matched
    e.g. properties = ["vcf", "vcfIndex"] --> file_suffixes = ["vcf", "tbi"]
    Refer to SVELT documentation for valid file formats.

    :param config_object: The sample-wise configuration JSON object to be populated.
    :type config_object: dict
    :param sample_id: A sample ID, used to identify that sample's subdirectory.
    :type sample_id: str
    :param s3_bucket_name: Name of S3 bucket containing private data.
    :type s3_bucket_name: str
    :param s3_directory_name: Folder within S3 bucket containing a sample's property file(s).
    :type s3_directory_name: str
    :param properties: property/properties being added to the given sample's configuration JSON object.
    :type properties: list[str]
    :param file_suffixes: accepted file suffix(es) for given properties. Index-matched with "properties" argument.
    :type file_suffixes: list[str]
    :param expiration: The number of seconds the presigned URL is valid for.
    :type expiration: int
    :return: The edited config_object for the sample with the added properties and corresponding presigned URLs.
    :rtype: dict
    TODO: have to list exceptions??
    """

    required = False
    if any(req_prop in REQUIRED_PROPERTIES for req_prop in properties):
        required = True
    sample_subdir_rel_path = s3_directory_name + "/" + sample_id
    items_in_sample_subdir, sample_subdir_full_path = list_items_in_bucket_dir(s3_bucket_name, sample_subdir_rel_path, required)

    completed_property_counter = 0
    for index, suffix in enumerate(file_suffixes):
        object_match_flag = False
        current_property = properties[index]
        for item in items_in_sample_subdir:
            item_name_split = item.split(".")
            if (suffix == item_name_split[-1]) or (suffix == item_name_split[-2] and "gz" == item_name_split[-1]):
                object_match_flag = True
                full_property_s3_obj_path = sample_subdir_rel_path + "/" + item
                config_object[current_property] = generate_presigned_URL(s3_bucket_name, full_property_s3_obj_path, expiration)
                completed_property_counter += 1
                break
        if not object_match_flag and required:
            raise Exception(f'S3 directory "{sample_subdir_full_path}" does not contain valid filetype for property "{current_property}"')
    if (completed_property_counter != len(properties)) and (completed_property_counter > 0):
        raise Exception(f'Failed to generate URL for one of the following properties incomplete for sample {sample_id}: {", ".join([prop for prop in properties])}')

    return config_object


def generate_configs(args):
    
    # create list of IDs from text file
    ids = create_id_list(args["ids"])

    # check for the arguments passed that are relevant for config files
    s3_bucket_name = args["bucket"]
    cancer_type = args["cancer"]
    assembly = args["assembly"]
    if (assembly != "hg38") and (assembly != "hg19"):
        raise ValueError('Assembly type not valid. Only "hg38" or "hg19" accepted.')
    sv_folder_name = args["sv"]
    cnv_folder_name = args["cnv"]
    drivers_folder_name = args["drivers"]
    snv_folder_name = args["snv"]
    indel_folder_name = args["indel"]
    read_alignments_folder_name = args["reads"]
    configs_folder_name = args["configs"]
    expiration = args["expiration"]

    # fill out JSON objects (dicts)
    config_list = [] # will eventually be list of JSON objects
    for id in ids:
        config = {} # sample-wise config JSON object

        ## Required attributes: id, cancer, assembly, sv, & cnv
        config["id"] = id
        config["cancer"] = cancer_type
        config["assembly"] = assembly

        # SV
        config = fill_property_values(config, id, s3_bucket_name, sv_folder_name, ["sv"], ["bedpe"], expiration)

        # CNV
        config = fill_property_values(config, id, s3_bucket_name, cnv_folder_name, ["cnv"], ["txt"], expiration)

        ## Optional attributes: drivers, point mutations (vcf & vcfIndex), indels (vcf2 & vcf2Index),
        ## read alignments (bam & bamIndex)

        # Drivers
        if drivers_folder_name:
            config = fill_property_values(config, id, s3_bucket_name, drivers_folder_name, ["drivers"], ["txt"], expiration)

        # SNV
        if snv_folder_name:
            config = fill_property_values(config, id, s3_bucket_name, snv_folder_name, ["vcf", "vcfIndex"], ["vcf", "tbi"], expiration)
        
        # INDELs
        if indel_folder_name:
            config = fill_property_values(config, id, s3_bucket_name, indel_folder_name, ["vcf2", "vcf2Index"], ["vcf", "tbi"], expiration)

        # Read Alignments
        if read_alignments_folder_name:
            config = fill_property_values(config, id, s3_bucket_name, read_alignments_folder_name, ["bam", "bamIndex"], ["bam", "bai"], expiration)

        config_list.append(config)

    # create local folder that will contain JSON configs
    if not os.path.exists(configs_folder_name):
        try:
            os.makedirs(configs_folder_name)
        except OSError:
            print(f'Directory "{configs_folder_name}" can not be created')

    # add completed JSON config to new file
    dateTimeObj = datetime.now()
    timestampStr = dateTimeObj.strftime("%d_%b_%Y_%H_%M_%S_%f")
    config_file = f"{timestampStr}.json"

    path_to_config_file = os.path.join(configs_folder_name, config_file)
    with open(path_to_config_file, 'w') as file_to_write:
        dump(config_list, file_to_write) # JSON method that writes JSON config object to file

    file_to_write.close()

    # upload the new config file from local CONFIGS_SVELT dir to the given S3 bucket "config" folder
    target = "s3://" + s3_bucket_name + "/" + configs_folder_name + "/"
    os.system(f"aws s3 cp {path_to_config_file} {target}")
    
    config_file_presigned_url = generate_presigned_URL(s3_bucket_name, path_to_config_file, expiration)
    
    print(f"\nPresigned URL for generated configuration file: {config_file_presigned_url}")
    print(f"\nComplete SVELT URL for generated configuration file: https://sehilyi.github.io/goscan/?external={config_file_presigned_url}\n")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(
        description="Create presigned URLs of private S3 objects and add to SVELT configuration file."
    )
    parser.add_argument("--ids", type=str, help="Relative bucket path to ID list text file", required=True)
    parser.add_argument("--bucket", type=str, help="S3 bucket name", required=True)
    parser.add_argument("--cancer", type=str, help="Cancer type", required=True)
    parser.add_argument("--assembly", type=str, help="Assembly", required=True)
    parser.add_argument("--sv", type=str, help="SV folder name (in S3 bucket)", required=True)
    parser.add_argument("--cnv", type=str, help="CNV folder name (in S3 bucket)", required=True)
    parser.add_argument("--drivers", type=str, help="DRIVERS folder name (in S3 bucket)", required=False, default=None)
    parser.add_argument("--snv", type=str, help="SNV folder name (in S3 bucket)", required=False, default=None)
    parser.add_argument("--indel", type=str, help="INDEL folder name (in S3 bucket)", required=False, default=None)
    parser.add_argument("--reads", type=str, help="Read Alignments folder name (in S3 bucket)", required=False, default=None)
    parser.add_argument("--configs", type=str, help="configs folder name (local and in S3 bucket)", required=False, default="CONFIGS")
    parser.add_argument("--expiration", type=int, help="duration length of config file (sec)", required=False, default=3600)

    args = vars(parser.parse_args())

    generate_configs(args)