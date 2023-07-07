---
sidebar_position: 7
---

# Data Sampling

For the efficient rendering of visualizations, entire data is not shown in the whole genome scale for point mutations, indels, and gene annotations.

- **Point mutations**: Chromoscope selects **500** [point mutations](#vcf--tbi) in each visible tile. Given that showing dense point mutations are important to the corresponding tracks, Chromoscope keeps point mutations with relatively small `DISTPREV` (i.e., distance to the previous mutation) and filters out proportion mutations with relatively high `DISTPREV`.

- **Indels**: Chromoscope selects **500** [indels](#vcf--tbi) in each visible tile.

- **Genes**: When there are too many genes overlapping each other, Chromoscope only shows genes that have the highest scores internally calculated (e.g., citation counts), which are computed during the processing of the data. Reference: https://docs.higlass.io/data_preparation.html#gene-annotation-tracks

All aforementioned tracks select visible elements dynamically based on the zoom level. When zooming in, more mutations will be displayed until, eventually, all point mutations become visible when zooming in close enough.
