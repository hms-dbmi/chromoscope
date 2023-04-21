# SPDX-FileCopyrightText: 2023-present Trevor Manz
#
# SPDX-License-Identifier: MIT
from __future__ import annotations

import json
import pathlib

import servir
import jinja2

_CHROMOSCOPE_URL = "https://hms-dbmi.github.io/chromoscope/"
_PROVIDER = servir.Provider()
_RESOURCES = set()

def resolve_file_or_url(x: str):
    if isinstance(x, str) and (x.startswith("http") or x.startswith("https")):
        return x
    path = pathlib.Path(x).resolve()
    assert path.is_file() and path.exists()
    resource = _PROVIDER.create(path)
    _RESOURCES.add(resource)
    return resource.url

def resolve_config_item(config: dict):
    reserved_names = ("id", "cancer", "assembly", "note")
    resolved = {}
    for k, v in config.items():
        if k in reserved_names:
            resolved[k] = v
        else:
            resolved[k] = resolve_file_or_url(v)
    return resolved

def resolve_config(config: dict) -> str:
    resolved = [resolve_config_item(x) for x in config]
    resource = _PROVIDER.create(json.dumps(resolved), extension=".json")
    _RESOURCES.add(resource)
    return resource.url


_TEMPLATE = jinja2.Template("""
<iframe src="{{ chromoscope_url }}" frameborder="0" allowfullscreen style="width:100%;height:700px;" />
""")

class Viewer:

    def __init__(self, config_url: str):
        self._config_url = config_url

    def _repr_mimebundle_(self, **kwargs):
        url = f"{_CHROMOSCOPE_URL}?external={self._config_url}"
        return {
            "text/html": _TEMPLATE.render(chromoscope_url=url)
        }

    @classmethod
    def from_config(cls, config: dict):
        return cls(resolve_config(config))
