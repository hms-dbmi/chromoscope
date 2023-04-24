# CONTRIBUTING

## Updating Documentation

We are using [docsify](https://docsify.js.org/) for our documentation.

To test the documentation in your local browser, you need to first install its cli, [docsify-cli](https://github.com/docsifyjs/docsify-cli).

```
yarn global add docsify-cli
```

You can run the following commands to open the documentation.

```
yarn && yarn doc-serve
```

To add a new page, create a new `.md` file under `\docs` and update `_sidebar.md` to make the file appear on the sidebar.