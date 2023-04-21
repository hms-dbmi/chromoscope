from datetime import datetime
import pandas
import matplotlib.pyplot as plt
import seaborn as sns
import os
import click

dateTimeObj = datetime.now()
timestampStr = dateTimeObj.strftime("%d_%b_%Y_%H_%M_%S_%f")

# make output folders accessible across the script
output_folder = f"Chromoscope_clustering/{timestampStr}"
heatmap_folder = f"{output_folder}/heatmaps"
clusters_folder = f"{output_folder}/clusters"
dataframes_folder = f"{output_folder}/dataframes"
missing_samples_folder = f"{output_folder}/missing_samples"


def create_folder(folder_name):
    """
    Create a directory if it doesn't exist.

    :param folder_name: path of the new folder
    :return:
    """
    if os.path.exists(folder_name) != True:
        os.makedirs(folder_name)


def create_reports(missing_samples_df, histology):
    """
    Create a report of Chromoscope sample UUIDs that were not available in the variant patterns.
    Save the dataframe of the missing samples.


    :param missing_samples_df: Chromoscope dataframe containing only samples that are to be reported
    :param histology: cancer type
    :return:
    """
    report_file = open(f"{output_folder}/missing_samples_in_patterns.txt", "a")
    missing_samples = open(f"{missing_samples_folder}/missing_samples.tsv", "a")
    missing_samples_uuids = missing_samples_df["UUID"].tolist()

    # number of missing samples
    number_of_samples_missing = len(missing_samples_uuids)

    # list of missing samples UUIDs
    list_of_missing_samples = ",".join(missing_samples_uuids)

    # save it in the report file
    if number_of_samples_missing > 0:
        report_file.write(f"Histology: {histology}\n")
        report_file.write(
            f"Number of samples available on Chromoscope but not available in the provided patterns: {number_of_samples_missing}\n"
        )
        report_file.write(f"UUIDs of the missing samples: {list_of_missing_samples} \n")
        report_file.write(f"{'#' * 50}\n")

    for missing_uuid in missing_samples_df["UUID"].tolist():
        missing_samples.write(f"{histology}\t{missing_uuid}\n")

    report_file.close()
    missing_samples.close()


@click.command()
@click.option("--chromoscope_samples", help="Chromoscope samples in CSV.")
@click.option(
    "--patterns",
    help="Patterns of somatic rearrangements across cancers in XLSX.",
)
def run_clustering(chromoscope_samples, patterns):
    """Run hierarchical clustering to organize PCAWG samples on Chromoscope."""

    # output folders
    create_folder(output_folder)
    create_folder(heatmap_folder)
    create_folder(clusters_folder)
    create_folder(dataframes_folder)
    create_folder(missing_samples_folder)

    # load Chromoscope samples
    chromoscope_samples = pandas.read_csv(
        chromoscope_samples,
        sep=",",
        index_col=False,
    )

    # load publication samples
    patterns = pandas.read_excel(
        patterns,
        sheet_name="S7",
        index_col=False,
        engine="openpyxl",
    )

    patterns.columns = ["UUID"] + list(patterns.columns[1:])
    # get cancer types
    histology_abb = chromoscope_samples.histology_abbreviation.unique().tolist()

    # iterate over cancer types
    for his in histology_abb:
        print(f"Annalyzing samples of {his}")

        # select Chromoscope samples with the given cancer type
        Chromoscope_cancer_subset = chromoscope_samples[
            chromoscope_samples["histology_abbreviation"] == his
        ]

        # get samples that are missing in the publication
        Chromoscope_publication_missing = Chromoscope_cancer_subset[
            ~Chromoscope_cancer_subset["UUID"].isin(patterns.UUID.tolist())
        ]

        create_reports(Chromoscope_publication_missing, his)

        # UUIDs of Chromoscope samples
        Chromoscope_uuids = Chromoscope_cancer_subset.UUID.tolist()

        # narrow down pattern data into Chromoscope samples
        pub_Chromoscope_common_samples = patterns[patterns["UUID"].isin(Chromoscope_uuids)]

        # drop UUIDs as we want to run clustering on a matrix of numbers
        cluster_data = pub_Chromoscope_common_samples.drop("UUID", axis=1)

        # run clustering only on a dataset with more than 2 samples
        if len(cluster_data) > 2:
            cluster_map = sns.clustermap(
                cluster_data,
                cmap=sns.color_palette("crest", as_cmap=True),  # green colors
                yticklabels=patterns.loc[cluster_data.index][
                    "UUID"
                ].tolist(),  # uuids labels instead of indexes
            )

            lower_font = 0
            # samller labels font for big clusters
            if len(cluster_data) > 50:
                # minimize based the size of the dataset
                lower_font = 0.03 * len(cluster_data)

            cluster_map.ax_heatmap.set_yticklabels(
                cluster_map.ax_heatmap.get_yticklabels(),
                fontdict={"fontsize": 8 - lower_font},
            )
            cluster_map.ax_heatmap.set_xticklabels(
                cluster_map.ax_heatmap.get_xticklabels(), fontdict={"fontsize": 8}
            )
            cluster_map.ax_heatmap.set_ylabel("Sample UUID")
            cluster_map.ax_heatmap.set_xlabel("Rearrangement type")
            cluster_map.ax_heatmap.tick_params(axis="y", width=0.5)
            cluster_map.figure.suptitle(
                f"Clustering of structural variant patterns of {his} samples.",
                size="xx-large",
                x=0.55,
                y=1,
            )
            cluster_map.ax_col_dendrogram.set_visible(False)

            # save the dataframe on which we run the algorithm
            patterns[patterns["UUID"].isin(Chromoscope_uuids)].to_csv(
                f"{dataframes_folder}/{his}.csv", index=False
            )

            # to avoid cbar overlapping with the dendrogram
            cluster_map.ax_cbar.set_axis_off()
            cluster_map.figure.tight_layout(h_pad=1, w_pad=0.02, rect=[0, 0, 1, 1])
            cluster_map.ax_cbar.set_axis_on()
            cluster_map.ax_cbar.set_position((0.02, 0.8, 0.05, 0.18))

            cluster_map.savefig(f"{heatmap_folder}/{his}.pdf")

            plt.close()

            f = open(f"{clusters_folder}/{his}.txt", "a")
            for index in cluster_map.dendrogram_row.reordered_ind:
                # write the reordered UUIDs
                f.write(f"{pub_Chromoscope_common_samples.iloc[index]['UUID']}\n")
            f.close()
        else:
            f = open(f"{clusters_folder}/not_clustered_datasets.txt", "a")
            f.write(f"{his}\n")
            f.close()


if __name__ == "__main__":
    run_clustering()
