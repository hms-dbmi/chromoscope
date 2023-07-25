// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

/** @type {import('@docusaurus/types').Config} */
const config = {
    title: 'Chromoscope',
    tagline: 'Interactive multiscale visualization for structural variation in human genomes',
    // favicon: 'img/favicon.ico',

    // Set the production url of your site here
    url: 'https://chromoscope.bio',
    // Set the /<baseUrl>/ pathname under which your site is served
    // For GitHub pages deployment, it is often '/<projectName>/'
    baseUrl: '/docs/',

    // GitHub pages deployment config.
    // If you aren't using GitHub pages, you don't need these.
    organizationName: 'hms-dbmi', // Usually your GitHub org/user name.
    projectName: 'Chromoscope', // Usually your repo name.

    onBrokenLinks: 'throw',
    onBrokenMarkdownLinks: 'warn',

    // Even if you don't use internalization, you can use this field to set useful
    // metadata like html lang. For example, if your site is Chinese, you may want
    // to replace "en" with "zh-Hans".
    i18n: {
        defaultLocale: 'en',
        locales: ['en']
    },

    presets: [
        [
            'classic',
            /** @type {import('@docusaurus/preset-classic').Options} */
            ({
                docs: {
                    routeBasePath: '/',
                    sidebarPath: require.resolve('./sidebars.js'),
                    // Please change this to your repo.
                    // Remove this to remove the "edit this page" links.
                    editUrl: 'https://github.com/hms-dbmi/chromoscope/tree/master/docs'
                },
                // blog: {
                //   showReadingTime: true,
                //   // Please change this to your repo.
                //   // Remove this to remove the "edit this page" links.
                //   editUrl:
                //     'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
                // },
                theme: {
                    customCss: require.resolve('./src/css/custom.css')
                }
            })
        ]
    ],
    themeConfig:
        /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
        ({
            // Replace with your project's social card
            // image: 'img/docusaurus-social-card.jpg',
            navbar: {
                title: 'Chromoscope',
                // logo: {
                //   alt: 'My Site Logo',
                //   src: 'img/logo.svg',
                // },
                items: [
                    {
                        type: 'docSidebar',
                        sidebarId: 'docsSidebar',
                        position: 'left',
                        label: 'Documentation'
                    },
                    {
                        label: 'Use Cases',
                        position: 'left',
                        to: '/docs/category/use-cases'
                    },
                    {
                        label: 'Workflows',
                        position: 'left',
                        to: '/docs/workflows'
                    },
                    { to: 'about', label: 'About', position: 'left' },
                    {
                        href: 'https://chromoscope.bio',
                        label: 'Demo',
                        position: 'right'
                    },
                    {
                        href: 'https://github.com/hms-dbmi/chromoscope',
                        position: 'right',
                        className: 'header-github-link',
                        'aria-label': 'GitHub repository'
                    }
                ]
            },
            footer: {
                style: 'dark',
                links: [
                    {
                        title: 'Learn',
                        items: [
                            {
                                label: 'Documentation',
                                to: '/docs/intro'
                            },
                            {
                                label: 'About',
                                to: '/about'
                            }
                        ]
                    },
                    {
                        title: 'Community',
                        items: [
                            {
                                label: 'Questions',
                                href: 'https://github.com/hms-dbmi/chromoscope/discussions/new?category=q-a'
                            },
                            {
                                label: 'Twitter',
                                href: 'https://twitter.com/chromoscope_bio'
                            }
                        ]
                    },
                    {
                        title: 'More',
                        items: [
                            {
                                label: 'GitHub',
                                href: 'https://github.com/hms-dbmi/chromoscope'
                            }
                        ]
                    }
                ],
                copyright: `Copyright © ${new Date().getFullYear()} Harvard Medical School.`
            },
            prism: {
                theme: lightCodeTheme,
                darkTheme: darkCodeTheme
            },
            algolia: {
                // The application ID provided by Algolia
                appId: 'T6K4NO6G0Z',

                // Public API key: it is safe to commit it
                apiKey: '2750461a166086d885fe5bbab18ffbbc',

                indexName: 'chromoscopedocs',

                // Optional: see doc section below
                contextualSearch: true

                // Optional: Specify domains where the navigation should occur through window.location instead on history.push. Useful when our Algolia config crawls multiple documentation sites and we want to navigate with window.location.href to them.
                // externalUrlRegex: 'external\\.com|domain\\.com',

                // Optional: Replace parts of the item URLs from Algolia. Useful when using the same search index for multiple deployments using a different baseUrl. You can use regexp or string in the `from` param. For example: localhost:3000 vs myCompany.com/docs
                // replaceSearchResultPathname: {
                //   from: '/docs/', // or as RegExp: /\/docs\//
                //   to: '/',
                // },

                // Optional: Algolia search parameters
                // searchParameters: {},

                // Optional: path for search page that enabled by default (`false` to disable it)
                // searchPagePath: 'search',

                //... other Algolia params
            }
        })
};

module.exports = config;
