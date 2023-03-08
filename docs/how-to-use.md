# Visualizations

<!-- ?> 🚧 This page is work in progress 🚧 -->
<!-- ![interface](assets/interface.png ':class=image') -->

SVELT offers four main visualizations that enable to explore structural variation at four levels of scale.

## Multi-Sample Overview

This cohort-level view displays structural variants and their types as arches connecting chromosomal breakpoints using distinct colors to indicate duplications, deletions, inversions, and inter-chromosomal translocations. This view also displays copy number variants and loss of heterozygosity (LOH). With this cohort overview, users can quickly inspect the patterns of many structural variation datasets and efficiently find samples of interest.

## Genome View
The genome view shows the selected sample in a circular visualization, similar to the multi-sample overview but with additional details, such as chromosome ideograms, highlighting putative driver mutations.

## Variant View
The variant view, focusing on a shorter genomic region, shows additional details, including point mutations, indels, copy number variation, and genes.

## Breakpoint View
The breakpoint view shows raw reads around breakpoints and highlights pairs of reads with long distances, showing evidence for structural variant calls.

<!-- * Color: The five colors (green, blue, red, orange, yellow) represent the types of SV events. If a read on the left view has a mate on the right view, these reads are encoded with one of the five colors depending on its SV type. If paired reads are not positioned within the two views, they are just represented with grey colors. -->

<!-- * Loading the alignment information may take up to few minutes. -->

## User Interactions

### Navigation
All visualizations in SVELT are interactive which is designed to support efficient navigation between genomic regions of interest across scales. Users can smoothly zoom and pan, use an interactive brush, search for a gene of interest, and interactively select a structural variation to instantly display read-level views around breakpoints for an in-depth examination. 

### Export

#### Session
For the effective and efficient communication of findings made with SVELT, the tool generates a shareable URL that encodes the current visualization state, including the loaded datahub, selected sample, and genomic locations most recently viewed. 

#### PNG
SVELT enables the export of a publication-ready image (PNG).

#### HTML
SVELT enables the export of an interactive webpage that contains the entire SVELT visualization (single HTML file).

#### JSON (Gosling Spec)
To enable further fine-grained customization (e.g., changing colors or sizes), the entire interactive visualization can be exported as a Gosling JSON specification. This JSON values can be used directly on the Gosling Online Editor (https://gosling.js.org).


<!-- #### Navigating Linear Detail View on Circular Overview
By clicking and dragging a mouse on a blue brush, users can navigate a linear view.

#### Opening Alignment Views

Upon clicking on a SV on either an overview or a linear view, two alignment views are opened that show two regions around breakpoints. The selected SV is represented with thicker edges. Vertical gray lines on the alignment views represent the breakpoints of the selected SV.

#### Selecting a Sample

From the sample gallery, a user can select a sample of interest by clicking.

#### Navigating To Specific Chromosomes

Using the drop-down menus, a user can quickly navigate to a certain chromosome on an either overview or the linear detail view.

#### Exporting PNG

#### Interacting with Visualizations
By default, interactions are not activated in visualizations. You will first need to click on a visualization, following the instruction on the left-top corner (i.e., “Click inside to use interactions”). 

After clicking on it, you can now adjust brushes, use the mouse wheel to zoom in and out, and click on a SV. In this mode, you can scroll the entire website by putting your mouse around the main visualization (i.e., gray dotted region). 

When you click on the outside of the visualization, the interactions will be deactivated. In this mode, you can safely scroll the entire website by positioning your mouse anywhere, even on the visualization. -->