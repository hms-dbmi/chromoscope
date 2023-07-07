---
sidebar_position: 6
---

# Export

### PNG
Chromoscope enables the export of a PNG image file of the entire visualization.

### HTML
Chromoscope also allows you to export an interactive webpage that contains the entire Chromoscope visualization as a single HTML file.

### JSON (Gosling Spec)
To enable further fine-grained customization (e.g., changing colors or sizes), the entire interactive visualization can be exported as a Gosling JSON specification. This JSON values can be used directly on the Gosling Online Editor (https://gosling.js.org).

:::info
For more details about using the Gosling specification, please refer to the [workflow page](../workflows).
:::

|![HTML exported](../assets/html-export.png)|![Gosling Editor](../assets/gosling-editor.png)|
|---|---|
|__Figure.__ The exported HTML file on a browser.|__Figure.__ The exported JSON value added to an public Gosling editor.|

### Session 🔗
For the effective and efficient communication of findings made with Chromoscope, the tool generates a shareable URL that encodes the current visualization state, including the loaded datahub, selected sample, and genomic locations most recently viewed.

:::info
To understand the individual parameters of the exported URL, please refer to the [corresponding section](../loading-data/url-parameters).
:::