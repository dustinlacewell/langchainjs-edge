/* eslint-disable global-require,import/no-extraneous-dependencies */

// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion
// eslint-disable-next-line import/no-extraneous-dependencies
const { ProvidePlugin } = require("webpack");
const path = require("path");

const examplesPath = path.resolve(__dirname, "..", "examples", "src");

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: "🦜️🔗 Langchain",
  tagline: "LangChain JS Docs",
  favicon: "img/favicon.ico",
  customFields: {
    mendableAnonKey: process.env.MENDABLE_ANON_KEY,
  },
  // Set the production url of your site here
  url: "https://js.langchain.com",
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: "/",

  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "throw",

  plugins: [
    [
      "docusaurus-plugin-typedoc",
      {
        tsconfig: "../langchain/tsconfig.json",
        sidebar: {
          fullNames: true,
        },
      },
    ],
    () => ({
      name: "custom-webpack-config",
      configureWebpack: () => ({
        plugins: [
          new ProvidePlugin({
            process: require.resolve("process/browser"),
          }),
        ],
        resolve: {
          fallback: {
            path: false,
            url: false,
          },
          alias: {
            "@examples": examplesPath,
          },
        },
        module: {
          rules: [
            {
              test: examplesPath,
              use: "raw-loader",
            },
            {
              test: /\.m?js/,
              resolve: {
                fullySpecified: false,
              },
            },
          ],
        },
      }),
    }),
  ],

  presets: [
    [
      "classic",
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve("./sidebars.js"),
          editUrl: "https://github.com/hwchase17/langchainjs/",
          async sidebarItemsGenerator({
            defaultSidebarItemsGenerator,
            ...args
          }) {
            const allInternal = [];
            const filterInternal = (items) =>
              items
                .filter((item) => {
                  const isInternal = item.label?.includes("internal");
                  if (isInternal) {
                    allInternal.push(item);
                  }
                  return !isInternal;
                })
                .map((item) => {
                  if (item.items && Array.isArray(item.items)) {
                    return { ...item, items: filterInternal(item.items) };
                  }
                  return item;
                });
            const sidebarItems = await defaultSidebarItemsGenerator(args);
            const filtered = filterInternal(sidebarItems);
            if (allInternal.length > 0) {
              return [
                ...filtered,
                {
                  type: "category",
                  label: "Internal",
                  collapsible: true,
                  collapsed: true,
                  items: allInternal,
                },
              ];
            }
            return filtered;
          },
          remarkPlugins: [
            [require("@docusaurus/remark-plugin-npm2yarn"), { sync: true }],
          ],
        },
        pages: {
          remarkPlugins: [require("@docusaurus/remark-plugin-npm2yarn")],
        },
        theme: {
          customCss: require.resolve("./src/css/custom.css"),
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      prism: {
        theme: require("prism-react-renderer/themes/vsLight"),
        darkTheme: require("prism-react-renderer/themes/vsDark"),
      },
      image: "img/parrot-chainlink-icon.png",
      navbar: {
        title: "🦜️🔗 LangChain",
        items: [
          {
            href: "https://docs.langchain.com/docs/",
            label: "Concepts",
            position: "left",
          },
          {
            href: "https://python.langchain.com/en/latest/",
            label: "Python Docs",
            position: "left",
          },
          {
            to: "/docs/",
            label: "JS/TS Docs",
            position: "left",
          },
          // Please keep GitHub link to the right for consistency.
          {
            href: "https://github.com/hwchase17/langchainjs",
            label: "GitHub",
            position: "right",
          },
        ],
      },
      footer: {
        style: "light",
        links: [
          {
            title: "Community",
            items: [
              {
                label: "Discord",
                href: "https://discord.gg/cU2adEyC7w",
              },
              {
                label: "Twitter",
                href: "https://twitter.com/LangChainAI",
              },
            ],
          },
          {
            title: "GitHub",
            items: [
              {
                label: "Python",
                href: "https://github.com/hwchase17/langchain",
              },
              {
                label: "JS/TS",
                href: "https://github.com/hwchase17/langchainjs",
              },
            ],
          },
          {
            title: "More",
            items: [
              {
                label: "Homepage",
                href: "https://langchain.com",
              },
              {
                label: "Blog",
                href: "https://blog.langchain.dev",
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} LangChain, Inc.`,
      },
    }),
};

module.exports = config;
