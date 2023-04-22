from __future__ import annotations

import json
import pathlib

import servir

_PROVIDER = servir.Provider()
_RESOURCES = set()

__all__ = ["Viewer"]


def resolve_file_or_url(path_or_url: str | pathlib.Path):
    """Resolve a file path or URL to a URL.

    Parameters
    ----------
    path_or_url : str | pathlib.Path
        A file path or URL.

    Returns
    -------
    str
        A URL. If `path_or_url` is a URL, it is returned as-is, otherwise
        a file resource is created and the URL is returned.
    """
    normalized = str(path_or_url)
    if normalized.startswith("http") or normalized.startswith("https"):
        return normalized
    path = pathlib.Path(normalized).resolve()
    assert path.is_file() and path.exists()
    resource = _PROVIDER.create(path)
    _RESOURCES.add(resource)
    return resource.url


def resolve_config_item(config: dict):
    """Resolve a configuration item to use all URLs.

    Parameters
    ----------
    config : dict
        A chromoscope configuration item.

    Returns
    -------
    dict
        A configuration item with all file paths and URLs resolved to URLs.
    """
    reserved_names = ("id", "cancer", "assembly", "note")
    resolved = {}
    for k, v in config.items():
        if k in reserved_names:
            resolved[k] = v
        else:
            resolved[k] = resolve_file_or_url(v)
    return resolved


def resolve_config(config: list[dict]) -> str:
    """Resolve a configuration dictionary to a URL.

    Parameters
    ----------
    config : dict
        A chromoscope configuration.

    Returns
    -------
    str
        A URL to a JSON configuration file.
    """
    resolved = [resolve_config_item(x) for x in config]
    resource = _PROVIDER.create(json.dumps(resolved), extension=".json")
    _RESOURCES.add(resource)
    return resource.url


def render_html(config_url: str, chromoscope_url: str = "https://chromoscope.bio"):
    """Render a Chromoscope viewer as HTML.

    Parameters
    ----------
    config_url : str
        A URL to a JSON configuration file.
    chromoscope_url : str, optional
        A URL to the Chromoscope website, by default "https://chromoscope.bio"

    Returns
    -------
    str
        An HTML string.
    """
    assert config_url.startswith("http") or config_url.startswith("https")
    assert chromoscope_url.startswith("http") or chromoscope_url.startswith("https")
    url = f"{chromoscope_url}?external={config_url}"
    return f"""
<iframe src="{url}" frameborder="0" allowfullscreen style="width:100%;height:700px;" />
"""


class Viewer:
    """A Jupyter notebook viewer for Chromoscope."""

    def __init__(
        self, config_url: str, chromoscope_url: str = "https://chromoscope.bio"
    ):
        """Create a new viewer.

        Parameters
        ----------
        config_url : str
            A URL to a JSON configuration file.
        """
        self._config_url = config_url
        self._chromoscope_url = chromoscope_url

    @classmethod
    def from_config(cls, config: list[dict]):
        """Create a new viewer from a configuration dictionary.

        Parameters
        ----------
        config : dict
            A chromoscope configuration.

        Returns
        -------
        Viewer
            A new viewer.
        """
        return cls(resolve_config(config))

    def _repr_mimebundle_(self, **kwargs):
        """Render the viewer as an HTML iframe."""
        return {"text/html": render_html(self._config_url, self._chromoscope_url)}
