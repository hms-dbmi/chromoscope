## SVELT - PCAWG samples 

In order to reproduce the results of the hierarchical clustering on the PCAWG samples uploaded to SVELT, please run `clustering.py`.  The aim of the tool is to organize the PCAWG samples based on the patterns of rearrangement signatures to facilitate the process of structural variants interpretation. The samples are clustered using the Euclidean metric as a distance measure.


## Dependencies

**Python version**: 3.7.0 
**Packages**: click, pandas, matplotlib, seaborn

## CLI 

The help command of the tool: 

```
python3 clustering.py  --help 
Usage: clustering.py [OPTIONS]

  Run hierarchical clustering to organize PCAWG samples on SVELT.

Options:
  --svelt_samples TEXT       SVELT samples in CSV.
  --patterns      TEXT       Patterns of structural variants TSV.
  --help                     Show this message and exit.
``` 


## Input files

|       Parameter       |Description                                                                                                                                                                                                    |
|-----------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
|`svelt_samples`        | List of samples used as demo data for SVELT. Cancer type is defined in the `histology_abbreviation` column. Sample UUIDs are defined in the `UUID` column. This file is available in the `data` folder        |
|`patterns`             |  Patters of somatic rearrangements.  [ref:https://pubmed.ncbi.nlm.nih.gov/32118208/. The source file is available under Supplementary Tables, Sheet 7]                                         |


## Output files

All the output results will be stored in the `SVELT_clustering/` folder. 

|Output                                | Description                                                                                                                                                                                                      |
|--------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
|`clusters/`                           | directory containing lists of ordered samples. Each list represents one cancer type from the SVELT dataset                                                                                                       |
|`clusters/non_clustered_datasets.txt` | file containing cancer types for which SVELT has less than 3 samples. These cancer types were not subject to the clustering algorithm. They are displayed in a default order in the multi-sample view            | 
|`dataframes/`                         | directory of TSV files representing matrices used for clustering                                                                                                                                                 |
|`heatmaps/`                           | directory of generated heat maps and dendrograms in the PDF format for visual inspection on how the algorithm grouped the samples                                                                                |
|`missing_samples/`                    | directory containing `missing_samples.tsv` that stores samples demonstrated on SVELT but not included in the clustering analysis due to missing rearrangement types for these samples                            |
|`missing_samples_in_patterns.txt`     | it’s a report containing a compacted list of sample UUIDs excluded from the analysis and their total number for each cancer type                                                                                 |
