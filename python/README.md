# chromoscope

[![PyPI - Version](https://img.shields.io/pypi/v/chromoscope.svg)](https://pypi.org/project/chromoscope)
[![PyPI - Python Version](https://img.shields.io/pypi/pyversions/chromoscope.svg)](https://pypi.org/project/chromoscope)

-----

**Table of Contents**

- [Installation](#installation)
- [Development](#development)
- [License](#license)

## Installation

```console
pip install chromoscope
```

## Development

This project uses [`hatch`](https://github.com/pypa/hatch) for development, which can be installed via `pipx`.

To get started, `cd` into this directory and run:

```sh
hatch shell
```

This command will source a python virtual environment with all the necessary development dependencies,
as well as `chromoscope` installed in development mode. You can read more about environments
in the `hatch` [documentation](https://hatch.pypa.io/latest/environment/).

You can then launch Jupyter:

```sh
juptyer lab
```

and navigate to the `notebooks/playground.ipynb` to use the `Viewer`.

All development commands are run from the project root, from a terminal:

| Command                | Action                                                              |
| :--------------------- | :------------------------------------------------------------------ |
| `hatch run test`       | Run unit tests with `pytest` in latest Python version.              |
| `hatch run test:test`  | Run unit tests with `pytest` in all target Python versions.         |
| `hatch version`        | Version the python package. Read more in the [docs](https://hatch.pypa.io/latest/version)|
| `hatch build`          | Build the sdist and wheels for PyPI. Generates `dist/`              |
| `hatch publish`        | Publish the package to PyPI. Requires API keys.                     |

## License

`chromoscope` is distributed under the terms of the [MIT](https://spdx.org/licenses/MIT.html) license.
