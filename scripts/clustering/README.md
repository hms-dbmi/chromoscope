# 📄 Hierarchical clustering of PCAWG samples 

In order to reproduce the results of hierarchical clustering on the PCAWG samples uploaded to Chromoscope, please run `clustering.py`.  The aim of the tool is to organize the PCAWG samples based on the patterns of rearrangement signatures to facilitate the process of structural variants interpretation. The samples are clustered using the Euclidean metric as a distance measure.

## Dependencies

**Python version**: 3+

**Packages**:
- [click](https://github.com/pallets/click) (version 8.1.3)
- [pandas](https://github.com/pandas-dev/pandas) (version 1.1.5)
- [matplotlib](https://github.com/matplotlib/matplotlib) (version 3.5.3)
- [seaborn](https://github.com/mwaskom/seaborn) (version 0.12.2)
- [openpyxl](https://openpyxl.readthedocs.io/en/stable/) (version 3.1.2)

## CLI 

The help command of the tool: 

```
python3 clustering.py  --help 
Usage: clustering.py [OPTIONS]

  Run hierarchical clustering to organize PCAWG samples on Chromoscope.

Options:
  --chromoscope_samples TEXT       Chromoscope samples in CSV.
  --patterns      TEXT       Patterns of structural variants XLSX.
  --help                     Show this message and exit.
``` 


## Input files

|       Parameter       |Description                                                                                                                                                                                                    |
|-----------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
|`chromoscope_samples`        | List of samples used as demo data for Chromoscope. Cancer type is defined in the `histology_abbreviation` column. Sample UUIDs are defined in the `UUID` column. This file is available in the `data` folder        |
|`patterns`             | Patters of somatic rearrangements.  [ref:https://pubmed.ncbi.nlm.nih.gov/32118208/. The source file is available under Supplementary Tables, Sheet 7]                                                         |


## How to reproduce the results?

Please run `run_clustering.sh`  in the `clustering` folder in order to download the file containing the information about somatic rearrangements and run the tool. This script implements the following commands:

```
PATTERNS_FILE="data/43018_2020_27_MOESM3_ESM.xlsx"
CHROMOSCOPE_SAMPLES="data/chromoscope_samples.csv"

wget -O $PATTERNS_FILE "https://static-content.springer.com/esm/art%3A10.1038%2Fs43018-020-0027-5/MediaObjects/43018_2020_27_MOESM3_ESM.xlsx"

python3 clustering.py  --chromoscope_samples $CHROMOSCOPE_SAMPLES --patterns  $PATTERNS_FILE
```

The results will be stored in a new folder `chromoscope_clustering`, see below the description of the output files.


## Output files

All the output results will be stored in the `chromoscope_clustering/` folder. 

|Output                                | Description                                                                                                                                                                                                      |
|--------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
|`clusters/`                           | directory containing lists of ordered samples. Each list represents one cancer type from the Chromoscope dataset                                                                                                       |
|`clusters/non_clustered_datasets.txt` | file containing cancer types for which Chromoscope has less than 3 samples. These cancer types were not subject to the clustering algorithm. They are displayed in a default order in the multi-sample overview        | 
|`dataframes/`                         | directory of TSV files representing matrices used for clustering                                                                                                                                                 |
|`heatmaps/`                           | directory of generated heat maps and dendrograms in the PDF format for visual inspection on how the algorithm grouped the samples                                                                                |
|`missing_samples/`                    | directory containing `missing_samples.tsv` that stores samples demonstrated on Chromoscope but not included in the clustering analysis due to missing rearrangement types for these samples                            |
|`missing_samples_in_patterns.txt`     | it’s a report containing a compacted list of sample UUIDs excluded from the analysis and their total number for each cancer type                                                                                 |


> **Note** Please find already generated output results in the `output_data` folder. These data were used in order to upload the reordered samples to Chromoscope.

## References

Degasperi, A., Amarante, T.D., Czarnecki, J. et al. A practical framework and online tool for mutational signature analyses show intertissue variation and driver dependencies. Nat Cancer 1, 249–263 (2020).