# Loading Local Data

!> You may also want to see the [Chromoscope Python package](#python), which allows you to load local files on computational notebooks.

You can run a local file server to display local files on Chromoscope. This enables you to safely visualize your private files. There are multiple light and easy-to-install file servers. In this page, we will use [http-server](https://www.npmjs.com/package/http-server) for the demonstration.

## Run Local File Server

You first need to install the file server called [http-server](https://www.npmjs.com/package/http-server). To install it, you need to first install a package manager, [npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm#using-a-node-installer-to-install-node-js-and-npm).

After installing the [npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm#using-a-node-installer-to-install-node-js-and-npm), you can use it to install [http-server](https://www.npmjs.com/package/http-server). For example, run the following command on your terminal.

```sh
npm install http-server -g
```

Now you can run the server on the designated folder.

```sh
http-server ./path-to-your-folder --cors
```

Note that the `--cors` option allows the browser to access your files.

Now, you can browse files that are located under the selected folder using your browser. For example, open [http://127.0.0.1:8080/](http://127.0.0.1:8080/) on the browser.

![server](assets/private-data-local-server.png ':class=image-small')

?> Also see https://stackoverflow.com/a/16350826

## Make Data Config

Using the URL of the local files, you can make a [data config](data-config.md). For example, the following example uses two files (i.e., SV and CNV) based on the local files.

```json
{
	"id": "SRR7890905",
    "cancer": "breast",
    "assembly": "hg38",
    "sv":  "http://127.0.0.1:8080/SVTYPE_SV_test_tumor_normal_with_panel.bedpe",
	"cnv": "http://127.0.0.1:8080/SRR7890943.ascat.v3.cnv.tsv"
}
```

Optionally, put this data config file (say, `first-config.json`) under the folder hosted by your [http-server](https://www.npmjs.com/package/http-server). You should be able to open the data config file on the browser using [http://127.0.0.1:8080/first-config.json](http://127.0.0.1:8080/first-config.json).

## Open Browser

As a last step, use the data config to browse your local files.

```
https://sehilyi.github.io/gosling-app-sv/?external=http://127.0.0.1:8080/first-config.json
```

![browser](assets/private-data-browser.png ':class=image-medium')