'use strict';
// --------------------------------------
// 基本機能 - 階層設定します
// --------------------------------------

const path = require('path');
const globule = require('globule');
const HtmlWebpackPlugin = require('html-webpack-plugin');

let port;
try {
  port = require('../port');
} catch (error) {
  console.warn('*********************************');
  console.warn('*[404] `port.js` file not found *');
  console.warn('*use default port number: 61000 *');
  console.warn('*********************************');
  port = 61000;
}

// --------------------------------------
// 生成するファイルをリストします

const directory = {
  src: path.resolve(__dirname, '../src'),
  app: path.resolve(__dirname, '../app'),
  public: path.resolve(__dirname, '../public'),
  dist: path.resolve(__dirname, '../htdocs'),
};

const files = {
  js: globule.find([
    `${directory.src}/**/*.{js,jsx,mjs}`,
    `!${directory.src}/**/_*/**/*.{js,jsx,mjs}`,
    `!${directory.src}/template/**/*.{js,jsx,mjs}`,
  ]),
  html: globule.find([
    `${directory.src}/**/*.html`,
    `!${directory.src}/**/_*/**/_*.html`,
    `!${directory.src}/**/_*.html`,
  ]),
  css: globule.find([
    `${directory.src}/**/*.{css,scss}`,
    `!${directory.src}/**/_*/**/*.{css,scss}`,
    `!${directory.src}/**/_*.{css,scss}`,
  ]),
  babels: globule.find([`${directory.src}/babels/*.js`]),
};

const babelBaseDir = 'common-assets/js';

const entries = {};

// src/babels/*.js
const babelNames = files.babels.reduce((list, file) => {
  list.push(
    file
      .split('/')
      .pop()
      .split('.')
      .shift()
  );
  return list;
}, []);

babelNames.map(
  name =>
    (entries[path.join(babelBaseDir, `${name}.bundle`)] = path.join(
      __dirname,
      '../src-babels',
      `${name}.js`
    ))
);

/**
 * @param {Array<string>} targets glob target path list
 * @param {Array<string>} ext 拡張子リスト - key name から削除します
 * */
const convert = (targets, ext) => {
  Object.values(targets).map(file => {
    // let fileName = file.replace(`${directory.src}/`, '');
    let fileName = file.split('src/').pop();
    ext.map(extension => {
      fileName = fileName.replace(`.${extension}`, '');
    });
    entries[fileName] = file;
  });
};

convert(files.css, ['css', 'scss']);
convert(files.js, ['js', 'jsx', 'mjs']);

/**
 * `.html` - `HtmlWebpackPlugin` instance list
 * @type {Array<HtmlWebpackPlugin>}
 * */
const htmlList = [];

Object.values(files.html).map(file =>
  htmlList.push(
    // @see https://github.com/jantimon/html-webpack-plugin#options
    new HtmlWebpackPlugin({
      // filename: file.replace(`${directory.src}/`, ''),
      filename: file.split('src/').pop(),
      inject: false,
      template: file,
      // production build で HTML 圧縮する時はコメントアウトする
      minify: false,
    })
  )
);

module.exports = {
  // ------
  port,
  // ------
  directory,
  // ------
  entries,
  htmlList,
  // ------
  // babel
  babel: {
    browsers: [
      'last 2 versions',
      'Safari >= 10',
      'Explorer >= 10',
      'last 4 Edge versions',
      'ChromeAndroid >= 18.0',
      'Android >= 6',
      'iOS >= 10.0',
    ],
  },
  // ------
  // css
  autoprefixer: {
    flexbox: 'no-2009',
    grid: true,
  },
};
