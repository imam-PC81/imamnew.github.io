'use strict';
// --------------------------------------
// DEV - webpack
// --------------------------------------

const webpack = require('webpack');
const autoprefixer = require('autoprefixer');
// @see https://github.com/webpack-contrib/mini-css-extract-plugin
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const RemoveEmptyScriptsPlugin = require('webpack-remove-empty-scripts');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const Fiber = require('fibers');
// ---
const pkg = require('../package');
const settings = require('./settings');
const server = require('./webpack.server.config');

// --------------------------------------
const HtmlWebpackSSIPlugin = require('./plugins/html-webpack-ssi-plugin');
// --------------------------------------
const mode = 'development';

const config = {
  // @see https://webpack.js.org/configuration/other-options/#cache
  cache: {
    type: 'filesystem',
    buildDependencies: {
      config: [__filename],
    },
  },
  mode,
  target: 'web',
  // watch: true,
  // watchOptions: {
  //   ignored: /node_modules/
  // },
  entry: settings.entries,
  output: {
    path: settings.directory.app,
    publicPath: '/',
  },
  module: {
    rules: [
      // eslint
      {
        test: /\.(js|jsx|mjs)$/,
        enforce: 'pre',
        use: [
          {
            options: {
              // formatter: eslintFormatter,
              eslintPath: require.resolve('eslint'),
            },
            loader: require.resolve('eslint-loader'),
          },
        ],
        include: settings.directory.src,
        exclude: [/node_modules/],
      },
      {
        oneOf: [
          // ------------------------------------
          // babel
          {
            test: /\.(js|jsx|mjs)$/,
            exclude: [/node_modules/],
            use: [
              {
                // Babel を利用する
                loader: 'babel-loader',
                // Babel のオプションを指定する
                options: {
                  cacheDirectory: true,
                  presets: [
                    [
                      // プリセットを指定することで、ES2018 を ES5 に変換
                      '@babel/preset-env',
                      {
                        targets: {
                          node: 'current',
                          browsers: settings.babel.browsers,
                        },
                        useBuiltIns: 'usage',
                        // @see https://babeljs.io/blog/2019/03/19/7.4.0
                        // need core-js version
                        corejs: 3,
                      },
                      // modules: false - IE Symbol polyfill not found error になる
                      // 回避策 - babel-polyfill import + useBuiltIns: entry -> dev-client.bundle.js とコンフリクトの危険性
                      // babelrc - "useBuiltIns": "usage" とし `{ modules: false }` 使用しない
                      // { modules: false },
                    ],
                  ],
                  ignore: ['node_modules'],
                  plugins: ['@babel/plugin-proposal-class-properties'],
                }, // options
              },
            ], // use
          },
          // ------------------------------------
          // sass / scss
          {
            test: /\.(sa|sc|c)ss$/,
            use: [
              // linkタグに出力する機能
              // require.resolve('style-loader'),
              {
                loader: MiniCssExtractPlugin.loader,
                options: {
                  publicPath: '/',
                },
              },
              // CSSをバンドルするための機能
              {
                loader: require.resolve('css-loader'),
                options: {
                  // オプションでCSS内のurl()メソッドの取り込みを禁止する
                  url: true,
                  // ソースマップの利用有無
                  sourceMap: true,
                  // 0 => no loaders (default);
                  // 1 => postcss-loader;
                  // 2 => postcss-loader, sass-loader
                  importLoaders: 2,
                },
              },
              // postCss - autoprefixer
              {
                loader: require.resolve('postcss-loader'),
                options: {
                  // ソースマップの利用有無
                  sourceMap: true,
                  postcssOptions: {
                    // Necessary for external CSS imports to work
                    // https://github.com/facebookincubator/create-react-app/issues/2677
                    ident: 'postcss',
                    plugins: () => [
                      require('postcss-import'),
                      require('postcss-flexbugs-fixes'),
                      autoprefixer(settings.autoprefixer),
                    ],
                  },
                },
              },
              // https://webpack.js.org/loaders/sass-loader/
              {
                loader: require.resolve('sass-loader'),
                options: {
                  sassOptions: {
                    fiber: Fiber,
                  },
                  implementation: require('sass'),
                  // ソースマップの利用有無
                  sourceMap: true,
                },
              },
            ],
          },
          // ------------------------------------
          // img
          {
            test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/, /\.svg$/],
            loader: require.resolve('url-loader'),
            options: {
              limit: 1024 * 8,
              name: '[path][name].[hash:8].[ext]',
              // outputPath: (url, resourcePath, context) => {
              outputPath: (url) => {
                return url.replace('src/', '');
              },
              publicPath: '',
            },
          },
          // -------------------
          {
            // Exclude `js` files to keep "css" loader working as it injects
            // its runtime that would otherwise processed through "file" loader.
            // Also exclude `html` and `json` extensions so they get processed
            // by webpacks internal loaders.
            test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/, /\.svg$/],
            exclude: [/\.(js|jsx|mjs)$/, /\.html$/, /\.json$/],
            // include: [
            //   path.resolve(__dirname, '../../assets/img'),
            // ],
            use: [
              {
                loader: require.resolve('file-loader'),
                options: {
                  // name: 'assets/img/[name].[hash:8].[ext]',
                  name: '[path][name].[hash:8].[ext]',
                  // outputPath: (url, resourcePath, context) => {
                  outputPath: (url) => {
                    return url.replace('src/', '');
                  },
                  publicPath: '',
                },
              },
            ],
          },
        ],
      },
    ], // rules
  }, // modules
  performance: {
    hints: false,
  },
  devtool: 'source-map',
  plugins: [
    new CleanWebpackPlugin({
      verbose: true,
    }),
    // new FixStyleOnlyEntriesPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(mode),
        BUILD_VERSION: JSON.stringify(pkg.version),
        BUILD_TIME: JSON.stringify(new Date().toLocaleString()),
      },
    }),
    // ---
    ...settings.htmlList,
    // ssi
    new HtmlWebpackSSIPlugin({ baseDir: settings.directory.public }),
    // ---
    new RemoveEmptyScriptsPlugin(),
    // ---
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: '[name].css',
      chunkFilename: '[id].[hash].css',
    }),
  ],
};

config.devServer = server.devServer;

module.exports = config;
