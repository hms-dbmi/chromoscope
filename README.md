# gosling-app-sv



This web-based tool allows interactively exploring structural variants of cancer patients with macroscopic (genome-wide) and microscopic (alignment) views. The main visualization shows structural variants of a single patient with circular overview (top), linear detail view (middle), and two alignment views (bottom). Users can select a sample from a sample gallery that can be opened by clicking on a button on the left-top corner of the browser.

## Main Components
### Circular overview
This view displays the overview of structural variants (arcs), Loss-of-Heterozygosity, or LOH (red ring), CNV Gain (green ring), and putative drivers (text labels), along with chromosome ideograms.

### Linear Detail View
This view shows the same information as in Circular Overview but focuses on a smaller region to allow browsing information in a more detailed manner. This view is linked with a light blue brush on the circular overview, i.e., representing the same region.

### Alignment Views
These views show alignment around two breakpoints of a user-selected SV (i.e., thick arc on the circular overview and the linear detail view). The gray vertical lines represent breakpoints of the user-selected SV. 

* Color: The five colors (green, blue, red, orange, yellow) represent the types of SV events. If a read on the left view has a mate on the right view, these reads are encoded with one of the five colors depending on its SV type. If paired reads are not positioned within the two views, they are just represented with grey colors.

* Loading the alignment information may take up to few minutes.

### Sample Gallery

This gallery allows browsing samples in small multiples.

## How To Use

### Navigating Linear Detail View on Circular Overview
By clicking and dragging a mouse on a blue brush, users can navigate a linear view.

### Opening Alignment Views

Upon clicking on a SV on either an overview or a linear view, two alignment views are opened that show two regions around breakpoints. The selected SV is represented with thicker edges. Vertical gray lines on the alignment views represent the breakpoints of the selected SV.

### Selecting a Sample

From the sample gallery, a user can select a sample of interest by clicking.

### Navigating To Specific Chromosomes

Using the drop-down menus, a user can quickly navigate to a certain chromosome on an either overview or the linear detail view.

### Exporting PNG

### Interacting with Visualizations
By default, interactions are not activated in visualizations. You will first need to click on a visualization, following the instruction on the left-top corner (i.e., “Click inside to use interactions”). 

After clicking on it, you can now adjust brushes, use the mouse wheel to zoom in and out, and click on a SV. In this mode, you can scroll the entire website by putting your mouse around the main visualization (i.e., gray dotted region). 

When you click on the outside of the visualization, the interactions will be deactivated. In this mode, you can safely scroll the entire website by positioning your mouse anywhere, even on the visualization.

### Loading Your Own Datasets
...
