---
title: Workflows
sidebar_position: 4
---

# Using Chromoscope in Different Workflows

There are several ways to use Chromoscope visualizations in different analysis workflows other than directly using the online instance, https://chromoscope.bio/app/. One way is to use the [exported Gosling specification](./visualizations/export) and the other is to use [Chromoscope Python Package](./loading-data/python-package).

:::tip
To test the following examples of using a customized spec, you can use the spec below.

https://gist.githubusercontent.com/sehilyi/3fa443a629ea924c8b03e58d102c2860/raw/66f8f2a50de44cdb11f433fed0b022a2392f3d19/chromoscope-spec.json
:::

## Using Gosling Spec in Online Editor

Gosling supports an online editor (https://gosling.js.org) where you can copy and paste your exported JSON specification directly on the webpage without any installation.

|![image](./assets/editor.png)|
|---|
|**Figure.** An example of using Chromoscope's circular visualization in Gosling Online Editor (https://gosling.js.org). |

## Using Gosling Spec in JavaScript

You can build a web application using JavaScript (or TypeScript) with React. There is an example GitHub repository (https://github.com/gosling-lang/gosling-react-example) where you can clone the source code and adopt it for your use case.

```ts
import { GoslingComponent } from "gosling.js";
import spec from './your-gosling-spec.json'; // customized spec in another file

function App() {
  return (
    <GoslingComponent
      // Gosling specification
      spec={spec}
      // ...
    />
  );
}
```

## Using Gosling Spec in Python Notebooks

You can use the [Gos Python package](https://github.com/gosling-lang/gos) to use Chromoscope visualization in the computational notebooks, such as Jupyter Notebooks/Labs or Google Colab.

This can be helpful if you understand the grammar of [Gosling](https://github.com/gosling-lang/gosling.js) and want to customize the Chromoscope visualization by editing the exported Gosling spec.

```py
# Install gosling in your python environment
!pip install gosling

# Import gos
import gosling as gos

spec = # Get your spec

# Visualize it using gos
gos.View.from_dict(spec)
```

|![image](./assets/gos.png)|
|---|
|**Figure.** An example of using Chromoscope's circular visualization in Google Colab. |


## Using Chromoscope Python Package
We also offer a Chromoscope Python Pakcage where you can load Chromoscope directly in the Python notebooks. The main advantage is that you can use local files in your computer without setting up a file server. Please refer to the [corresponding documentation](./loading-data/python-package).
