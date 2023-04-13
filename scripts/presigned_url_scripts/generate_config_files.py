#!/usr/bin/env python3

################################################
#   Libraries
################################################
import argparse
import os
from datetime import datetime
from json import dump
from create_presigned_urls import *

################################################
#   Constants
################################################
REQUIRED_PROPERTIES = ["id", "cancer", "assembly", "sv", "cnv"]

################################################
#   fill_property_values
################################################
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
    :param properties: Property/properties being added to the given sample's configuration JSON object.
    :type properties: list[str]
    :param file_suffixes: Accepted file suffix(es) for given properties. Index-matched with "properties" argument.
    :type file_suffixes: list[str]
    :param expiration: The number of seconds the presigned URL is valid for.
    :type expiration: int
    :return: The edited config_object for the sample with the added properties and corresponding presigned URLs.
    :rtype: dict
    """

    # Flag is set to signify whether given properties are required for SVELT config file
    required = False
    if any(req_prop in REQUIRED_PROPERTIES for req_prop in properties):
        required = True

    # Generate list of items within sample's subdirectory for the properties in question
    # as well as full S3 path to this subdirectory
    # ValueError is raised if properties are required but subdirectory is empty
    sample_subdir_rel_path = s3_directory_name + "/" + sample_id
    items_in_sample_subdir, sample_subdir_full_path = list_items_in_bucket_dir(s3_bucket_name, sample_subdir_rel_path, required)

    # Counter to ensure all properties have been added to config file
    completed_property_counter = 0

    # For each filetype
    for index, suffix in enumerate(file_suffixes):

        # Flag to ensure that sample subdirectory contains files of valid type for given properties
        object_match_flag = False

        # Corresponding property for current filetype
        current_property = properties[index]

        # Search through items in sample subdirectory
        for item in items_in_sample_subdir:

            # Isolate file suffix and check that it matches current filetype
            item_name_split = item.split(".")
            if (suffix == item_name_split[-1]) or (suffix == item_name_split[-2] and "gz" == item_name_split[-1]):

                # If matched, toggle flag to True, generate presigned URL for current property,
                # add to configuration JSON object, and add to completed property counter
                object_match_flag = True
                full_property_s3_obj_path = sample_subdir_rel_path + "/" + item
                config_object[current_property] = generate_presigned_URL(s3_bucket_name, full_property_s3_obj_path, expiration)
                completed_property_counter += 1
                break

        # If none of the objects within subdirectory are of valid filetype for given (required) property, raise ValueError
        if not object_match_flag and required:
            raise ValueError(f'S3 directory "{sample_subdir_full_path}" does not contain valid filetype for property "{current_property}"')
    
    # If required properties have not been added to configuration object, raise Exception
    if (completed_property_counter != len(properties)) and (completed_property_counter > 0):
        raise Exception(f'Failed to generate URL for one of the following properties incomplete for sample {sample_id}: {", ".join([prop for prop in properties])}')

    return config_object

################################################
#   generate_configs
################################################
def generate_configs(args):
    """
    Creates presigned URLs of private S3 objects for a given cohort and adds to SVELT configuration file.
    Saves configuration JSON object to a file, adds to given S3 bucket, and prints a presigned URL 
    for newly created configuration file, as well as complete SVELT URL with this presigned
    URL in the "external" parameter.

    The generated configuration file for the cohort is saved within local directory named
    according to "configs" argument (default = "CONFIGS") and uploaded to subdirectory of the
    same name, within the given S3 bucket. The name of the configuration file itself
    contains the timestamp of when it was created.

    Arguments:
    - ids (required): filepath to TSV file containing sample IDs for current cohort.
    - bucket (required): name of private S3 bucket containing data for given cohort.
    - cancer (required): type of cancer for this cohort.
    - assembly (required): Genome assembly. Only accepts "hg38" or "hg19".
    - sv (required): Subdirectory containing SV bedpe files.
    - cnv (required): Subdirectory containing CNV text files.
    - drivers: Subdirectory containing driver mutation text files. Default = None.
    - snv: Subdirectory containing point mutation vcf and index (tbi) files. Default = None.
    - indel: Subdirectory containing indel vcf and index (tbi) files. Default = None.
    - reads: Subdirectory containing read alignment bam and index (bai) files. Default = None.
    - configs: Name of subdirectory containing generated configuration file(s). Default = "CONFIGS".
    - expiration: Duration length of presigned URLs within and for generated configuration file (sec). Default = 3600 sec.
    """
    
    # Create list of IDs from TSV file
    ids = create_id_list(args["ids"])

    # Check for the arguments passed that are relevant for config files
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

    # Fill out JSON objects (dicts)
    config_list = [] # will eventually be list of JSON objects

    # For each sample
    for id in ids:

        # Create sample-wise config JSON object
        config = {}

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

        # Append this sample's configuration object to cohort list
        config_list.append(config)

    # Create local folder that will contain JSON configs
    if not os.path.exists(configs_folder_name):
        try:
            os.makedirs(configs_folder_name)
        except OSError:
            print(f'Directory "{configs_folder_name}" can not be created')

    # Add completed JSON config list to timestamped json file
    dateTimeObj = datetime.now()
    timestampStr = dateTimeObj.strftime("%d_%b_%Y_%H_%M_%S_%f")
    config_file = f"{timestampStr}.json"
    path_to_config_file = os.path.join(configs_folder_name, config_file)
    with open(path_to_config_file, 'w') as file_to_write:
        dump(config_list, file_to_write) # JSON method that writes JSON config object to file
    file_to_write.close()

    # Upload the new config file from local CONFIG directory to the given S3 bucket CONFIG directory
    target = "s3://" + s3_bucket_name + "/" + configs_folder_name + "/"
    os.system(f"aws s3 cp {path_to_config_file} {target}")
    
    # Generate presigned URL for the newly created configuration file
    config_file_presigned_url = generate_presigned_URL(s3_bucket_name, path_to_config_file, expiration)
    
    # Print presigned URL and SVELT URL
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