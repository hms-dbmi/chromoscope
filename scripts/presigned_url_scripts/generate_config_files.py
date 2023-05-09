#!/usr/bin/env python3

################################################
#   Libraries
################################################
import argparse
import os
import pandas
import pathlib
from datetime import datetime
from json import dump
from create_presigned_urls import *

################################################
#   Constants
################################################
REQUIRED_PROPERTIES = ["id", "cancer", "assembly", "sv", "cnv"]
VALID_FILETYPES = {
    "sv": [".bedpe"],
    "cnv": [".tsv", ".txt"],
    "drivers": [".tsv", ".json", ".txt"],
    "vcf": [".vcf"],
    "vcfIndex": [".tbi"],
    "vcf2": [".vcf"],
    "vcf2Index": [".tbi"],
    "bam": [".bam"],
    "bamIndex": [".bai"]
}

################################################
#   Helper functions
################################################
def create_id_list(tsv_file):
    """
    Given a TSV file, isolates the "ID" column and returns column
    contents as a list.
    
    :param tsv_file: name of TSV file
    :type tsv_file: str
    :return: contents of "ID" column
    :rtype: list
    """
    try:
        id_df = pandas.read_csv(
            tsv_file,
            sep="\t"
        )
    
        return id_df["ID"]
    except KeyError as err:
        raise KeyError("Missing required column header: %s" % err)
        
def link_names(*folder_names):
    """
    Given a series of names, join with "/" between names.
    
    :param folder_names: variable number of folder names to be joined
    :type folder_names: str(s)
    :return: joined folder names
    :rtype: str
    """
    return "/".join(list(folder_names))

def fill_property_values(config_object, sample_id, s3_bucket_name, s3_directory_name, properties, expiration):
    """
    Given properties for a Chromoscope configuration file, a sample ID, 
    and an S3 bucket directory name, create presigned URLs for given properties 
    and add to configuration object (dictionary).

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
    :param expiration: The number of seconds the presigned URL is valid for.
    :type expiration: int
    :return: The edited config_object for the sample with the added properties and corresponding presigned URLs.
    :rtype: dict
    """

    # Flag is set to signify whether given properties are required for Chromoscope config file
    required = False
    if any(req_prop in REQUIRED_PROPERTIES for req_prop in properties):
        required = True

    # Generate list of items within sample's subdirectory for the properties in question
    # as well as full S3 path to this subdirectory
    # ValueError is raised if properties are required but subdirectory is empty
    sample_subdir_rel_path = link_names(s3_directory_name, sample_id) + "/"
    items_in_sample_subdir, sample_subdir_full_path = list_items_in_bucket_dir(s3_bucket_name, sample_subdir_rel_path, required)

    # Counter to ensure all properties have been added to config file
    completed_property_counter = 0

    # For each filetype
    for current_property in properties:

        # Flag to ensure that sample subdirectory contains singular file of valid type
        object_match_flag = False

        # Search through items in sample subdirectory
        for item in items_in_sample_subdir:

            # Isolate file suffix and check that it matches current filetype
            item_suffixes = pathlib.Path(item).suffixes
            if any(suffix in VALID_FILETYPES[current_property] for suffix in item_suffixes):

                # If matched, toggle flag to True, generate presigned URL for current property,
                # add to configuration JSON object, and add to completed property counter
                object_match_flag = True
                full_property_s3_obj_path = link_names(sample_subdir_rel_path, item)
                config_object[current_property] = generate_presigned_URL(s3_bucket_name, full_property_s3_obj_path, expiration)
                completed_property_counter += 1
                break

        # If none of the objects within subdirectory are of valid filetype for given (required) property, raise ValueError
        if not object_match_flag and required:
            raise ValueError('S3 directory "%s" does not contain valid filetype "%s" for property "%s"' % (sample_subdir_full_path, suffix, current_property))
    
    # If required properties have not been added to configuration object, raise Exception
    if (completed_property_counter != len(properties)) and (completed_property_counter > 0):
        raise Exception('Failed to generate URL for a required property for sample %s' % sample_id)

    return config_object

################################################
#   Configuration file generation
################################################
def generate_configs(args):
    """
    Creates presigned URLs of private S3 objects for a given cohort and adds to Chromoscope configuration file.
    Saves configuration JSON object to a file, copies it to the given S3 bucket, and prints a presigned URL 
    for newly created configuration file, as well as complete Chromoscope URL with this presigned
    URL in the "external" parameter.

    The generated configuration file for the cohort is saved within local directory named
    according to "configs" argument (default = "CONFIGS") and uploaded to subdirectory of the
    same name, within the given S3 bucket. The name of the configuration file itself
    contains the timestamp of when it was created.

    Arguments:
    - ids (required): filepath to TSV file containing sample IDs for current cohort.
    - bucket (required): name of private S3 bucket containing data for current cohort.
    - cohort (required): name of subdirectory of current cohort.
    - cancer (required): type of cancer for this cohort.
    - assembly (required): Genome assembly. Only accepts "hg38" or "hg19".
    - sv (required): Subdirectory containing SV bedpe files.
    - cnv (required): Subdirectory containing CNV text files.
    - drivers: Subdirectory containing driver mutation text files. 
    - snv: Subdirectory containing point mutation vcf and index (tbi) files. 
    - indel: Subdirectory containing indel vcf and index (tbi) files.
    - reads: Subdirectory containing read alignment bam and index (bai) files. 
    - configs: Name of subdirectory containing generated configuration file(s). 
    - expiration: Duration length of presigned URLs (sec).
    """
    
    # Create list of IDs from TSV file
    ids = create_id_list(args["ids"])

    # Check for the arguments passed that are relevant for config files
    s3_bucket_name = args["bucket"]
    cohort_folder_name = args["cohort"]
    cancer_type = args["cancer"]
    assembly = args["assembly"]
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
        config = fill_property_values(config, id, s3_bucket_name, link_names(cohort_folder_name, sv_folder_name), ["sv"], expiration)

        # CNV
        config = fill_property_values(config, id, s3_bucket_name, link_names(cohort_folder_name, cnv_folder_name), ["cnv"], expiration)

        ## Optional attributes: drivers, point mutations (vcf & vcfIndex), indels (vcf2 & vcf2Index),
        ## read alignments (bam & bamIndex)

        # Drivers
        if drivers_folder_name:
            config = fill_property_values(config, id, s3_bucket_name, link_names(cohort_folder_name, drivers_folder_name), ["drivers"], expiration)

        # SNV
        if snv_folder_name:
            config = fill_property_values(config, id, s3_bucket_name, link_names(cohort_folder_name, snv_folder_name), ["vcf", "vcfIndex"], expiration)
        
        # INDELs
        if indel_folder_name:
            config = fill_property_values(config, id, s3_bucket_name, link_names(cohort_folder_name, indel_folder_name), ["vcf2", "vcf2Index"], expiration)

        # Read Alignments
        if read_alignments_folder_name:
            config = fill_property_values(config, id, s3_bucket_name, link_names(cohort_folder_name, read_alignments_folder_name), ["bam", "bamIndex"], expiration)

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
    upload_file(path_to_config_file, s3_bucket_name, link_names(cohort_folder_name, path_to_config_file))
    
    # Generate presigned URL for the newly created configuration file
    config_file_presigned_url = generate_presigned_URL(s3_bucket_name, link_names(cohort_folder_name, path_to_config_file), expiration)
    
    # Print presigned URL and Chromoscope URL
    print("\nPresigned URL for generated configuration file: %s" % config_file_presigned_url)
    print("\nComplete Chromoscope URL for generated configuration file: https://chromoscope.bio/?external=%s\n" % config_file_presigned_url)


if __name__ == "__main__":
    parser = argparse.ArgumentParser(
        description="Create presigned URLs of private S3 objects and generate a Chromoscope configuration file using these URLs."
    )
    parser.add_argument("--ids", type=str, help="Relative bucket path to ID list TSV file", required=True)
    parser.add_argument("--bucket", type=str, help="S3 bucket name", required=True)
    parser.add_argument("--cohort", type=str, help="Cohort subdirectory name", required=True)
    parser.add_argument("--cancer", type=str, help="Cancer type", required=True)
    parser.add_argument("--assembly", type=str, help="Assembly", choices=['hg19', 'hg38'], required=True)
    parser.add_argument("--sv", type=str, help="SV subdirectory name", required=True)
    parser.add_argument("--cnv", type=str, help="CNV subdirectory name", required=True)
    parser.add_argument("--drivers", type=str, help="DRIVERS subdirectory name", required=False, default=None)
    parser.add_argument("--snv", type=str, help="SNV subdirectory name", required=False, default=None)
    parser.add_argument("--indel", type=str, help="INDEL subdirectory name", required=False, default=None)
    parser.add_argument("--reads", type=str, help="Read Alignments subdirectory name", required=False, default=None)
    parser.add_argument("--configs", type=str, help="Subdirectory name containing generated configuration files (local and in S3 bucket)", required=False, default='CONFIGS')
    parser.add_argument("--expiration", metavar='EXPIR', type=int, help="Duration length of presigned URL of configuration file, in seconds", required=False, default=3600)

    args = vars(parser.parse_args())

    generate_configs(args)