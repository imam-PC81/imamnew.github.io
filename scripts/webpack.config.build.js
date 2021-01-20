'use strict';
// --------------------------------------
// DEV - BUILD
// --------------------------------------
const webpack = require('webpack');
const autoprefixer = require('autoprefixer');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const FixStyleOnlyEntriesPlugin = require('webpack-fix-style-only-entries');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin');
const TerserWebpackPlugin = require('terser-webpack-plugin');

const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin');

// ------------------------------------------------------
const pkg = require('../package');
const settings = require('./settings');
const server = require('./webpack.server.config');

const mode = 'production';

const config = {
  cache: {
    type: 'filesystem',
    buildDependencies: {
      config: [__filename],
    },
  },
  mode,
  entry: settings.entries,
  output: {
    path: settings.directory.dist,
    publicPath: '/',
  },
  optimization: {
    minimizer: [
      new TerserWebpackPlugin({
        terserOptions: {
          output: {
            comments: /@license/i,
          },
          compress: {
            drop_console: true,
          },
        },
        parallel: true,
        // extractComments: true,
        // false: *.js.LICENSE output しない
        extractComments: false,
      }),
    ],
    // NamedModulesPlugin deprecated - instead use... https://webpack.js.org/configuration/optimization/
    // namedModules: true,
    // @since webpack5 - `optimization.namedModules: true ↦ optimization.moduleIds: 'named'`
    // @see https://webpack.js.org/migrate/5/
    moduleIds: 'named',
  },
  module: {
    rules: [
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
              // require.resolve('resolve-url-loader'),
              // CSSをバンドルするための機能
              {
                loader: require.resolve('css-loader'),
                options: {
                  // オプションでCSS内のurl()メソッドの取り込みを禁止する
                  url: true,
                  // url: false,
                  // ソースマップの利用有無
                  // sourceMap: true,
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
                  // Necessary for external CSS imports to work
                  // https://github.com/facebookincubator/create-react-app/issues/2677
                  // ident: 'postcss',
                  // sourceMap: true,
                  postcssOptions: {
                    plugins: () => [
                      require('postcss-import'),
                      require('postcss-flexbugs-fixes'),
                      autoprefixer(settings.autoprefixer),
                    ],
                  },
                },
              },
              {
                loader: require.resolve('sass-loader'),
                options: {
                  implementation: require('sass'),
                  sassOptions: {
                    outputStyle: 'compressed',
                  },
                },
              },
            ],
          },
          // ------------------------------------
          // img
          {
            test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/, /\.svg$/],
            exclude: [/\.(js|jsx|mjs)$/, /\.html$/, /\.json$/],
            // loader: require.resolve('url-loader'),
            // options: {
            //   // limit: 8192,
            //   name: '[path][name].[hash:8].[ext]',
            // },
            use: [
              {
                // loader: 'url-loader',
                loader: require.resolve('url-loader'),
                options: {
                  // inline 変換したくない時は `1` へ変更します
                  limit: 1024 * 8,
                  // name: '[path][name].[hash:8].[ext]',
                  name: '[path][name].[ext]',
                  // outputPath: (url, resourcePath, context) => {
                  outputPath: (url) => {
                    return url.replace('src/', '');
                  },
                  publicPath: '',
                },
              },
              {
                loader: 'img-loader',
                options: {
                  plugins: [
                    require('imagemin-gifsicle')({
                      interlaced: false,
                      verbose: true,
                    }),
                    require('imagemin-mozjpeg')({
                      progressive: false,
                      arithmetic: false,
                      quality: 90,
                      verbose: true,
                    }),
                    require('imagemin-pngquant')({
                      floyd: 0.5,
                      speed: 1,
                      quality: [0.8, 0.9],
                      verbose: true,
                    }),
                    require('imagemin-svgo')({
                      plugins: [
                        {
                          removeTitle: true,
                        },
                        {
                          convertPathData: false,
                        },
                      ],
                      verbose: true,
                    }),
                  ],
                },
              },
            ],
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
                  // name: '[path][name].[hash:8].[ext]'
                  name: '[path][name].[ext]',
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
    hints: 'warning',
    // int (in bytes)
    maxAssetSize: 200000,
    maxEntrypointSize: 400000,
  },
  // devtool: 'source-map',
  plugins: [
    new CleanWebpackPlugin({
      verbose: true,
    }),
    new FixStyleOnlyEntriesPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(mode),
        BUILD_VERSION: JSON.stringify(pkg.version),
        BUILD_TIME: JSON.stringify(new Date().toLocaleString()),
      },
    }),
    // ---
    ...settings.htmlList,
    // new webpack.NamedModulesPlugin(),
    // ---
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: '[name].css',
      chunkFilename: '[id].[hash].css',
    }),
    // css 圧縮
    new OptimizeCssAssetsWebpackPlugin({
      assetNameRegExp: /\.css$/g,
      cssProcessor: require('cssnano'),
      cssProcessorPluginOptions: {
        preset: [
          'default',
          {
            discardComments: {
              removeAll: true,
            },
            autoprefixer: false,
            zindex: false,
            reduceIdents: false,
          },
        ],
      },
      canPrint: true,
    }),
    new CopyWebpackPlugin({
      patterns: [
        // {
        //   from: settings.directory.public,
        //   to: settings.directory.dist,
        //   globOptions: {
        //     ignore: [`${settings.directory.public}/**/_*/*`],
        //   },
        // },
        {
          from: settings.directory.src,
          to: settings.directory.dist,
          globOptions: {
            ignore: [
              `${settings.directory.src}/**/template/*`,
              `${settings.directory.src}/**/*.html`,
              `${settings.directory.src}/**/*.scss`,
              `${settings.directory.src}/**/*.css`,
              `${settings.directory.src}/**/*.js`,
            ],
          },
        },
      ],
    }),
    new ImageMinimizerPlugin({
      minimizerOptions: {
        // Lossless optimization with custom option
        // Feel free to experiment with options for better result for you
        plugins: [
          ['gifsicle', {
            interlaced: true,
            verbose: true,
          }],
          ['mozjpeg', {
            progressive: false,
            arithmetic: false,
            quality: 90,
            verbose: true,
          }],
          ['pngquant', {
            floyd: 0.5,
            speed: 1,
            quality: [0.8, 0.9],
            verbose: true,
          }],
          [
            'svgo',
            {
              plugins: [
                {
                  removeViewBox: false,
                },
                {
                  removeTitle: true,
                },
                {
                  convertPathData: false,
                },
              ],
              verbose: true,
            },
          ],
        ],
      },
    }),
  ],
};

config.devServer = server.devServer;
config.devServer.quiet = true;

module.exports = config;
