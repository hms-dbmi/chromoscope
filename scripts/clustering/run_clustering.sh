#!/bin/bash

PATTERNS_FILE="data/43018_2020_27_MOESM3_ESM.xlsx"
SVELT_SAMPLES="data/svelt_samples.csv"

wget -O $PATTERNS_FILE "https://static-content.springer.com/esm/art%3A10.1038%2Fs43018-020-0027-5/MediaObjects/43018_2020_27_MOESM3_ESM.xlsx"

python3 clustering.py  --svelt_samples $SVELT_SAMPLES --patterns  $PATTERNS_FILE