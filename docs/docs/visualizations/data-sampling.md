---
sidebar_position: 7
---

# Data Sampling

For the efficient rendering of visualizations, entire data is not shown in the whole genome scale for point mutations and indels.

Chromoscope selects **500** [point mutations](#vcf--tbi) in each visible tile. Given that showing dense point mutations are important the corresponding tracks, Chromoscope keeps point mutations with relatively small `DISTPREV` (i.e., distance to the previous mutation) and filters out a proportion mutations with relatively high `DISTPREV`.

Point mutations are selected dynamically based on the zoom level. When zooming in, more mutations will be displayed, until eventually, all point mutations become visible when zooming in close enough.
