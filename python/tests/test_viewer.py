from __future__ import annotations

import pathlib

import pytest
from chromoscope._viewer import (
    _PROVIDER,
    _RESOURCES,
    Viewer,
    resolve_config,
    resolve_config_item,
    resolve_file_or_url,
)


@pytest.fixture
def provider():
    yield _PROVIDER
    _RESOURCES.clear()
    _PROVIDER.stop()

@pytest.fixture
def config(tmp_path: pathlib.Path):
    local_file = tmp_path / "blah.bedpe"
    local_file.write_text("test")
    config_item = {
        "id": "foo",
        "cancer": "breast",
        "assembly": "hg38",
        "note": "testing 1, 2, 3",
        "sv": local_file,
        "cnv" : "https://example.com/cnv.bedpe",
    }
    yield [config_item]


@pytest.mark.parametrize(
    "url,expected",
    [
        ("https://example.com", "https://example.com"),
        ("http://example.com", "http://example.com"),
    ]
)
def test_resolves_url_as_is(url: str, expected: str):
    assert resolve_file_or_url(url) == expected


def test_resolves_file_path_to_url(tmp_path: pathlib.Path):
    file = tmp_path / "test.txt"
    file.write_text("test")
    resolved = resolve_file_or_url(file)
    assert resolved.startswith("http://localhost")
    assert len(_RESOURCES) == 1


def test_resolve_config_item(config: list[dict]):
    resolved = resolve_config_item(config[0])
    assert resolved["sv"].startswith("http://localhost")
    assert resolved.keys() == config[0].keys()

def test_resolve_config(config: list[dict]):
    config_url = resolve_config(config)
    assert config_url.startswith("http://localhost")
    assert config_url.endswith(".json")


def test_viewer(config: list[dict]):
    viewer = Viewer.from_config(config)
    viewer = Viewer.from_config([{"id": "foo", "sv": "https://example.com"}])
    assert viewer._config_url.startswith("http://localhost")
    bundle = viewer._repr_mimebundle_()
    assert bundle["text/html"]

