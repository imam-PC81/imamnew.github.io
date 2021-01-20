'use strict';
// --------------------------------------
// server setting - webpack-dev-server
// https://webpack.js.org/guides/development/
// https://webpack.js.org/configuration/dev-server/
// --------------------------------------
// const path = require('path')

const settings = require('./settings');
const { port, directory } = settings;

/*
server を client ip で起動する option
- useLocalIp: true,
- host: '0.0.0.0',

port 指定し起動します via `port.js`

directory

- src - 開発階層
- app - develop 出力
 */
module.exports = {
  devServer: {
    useLocalIp: true,
    host: '0.0.0.0',
    port,
    contentBase: [directory.app, directory.src, directory.public],
    watchOptions: {
      aggregateTimeout: 300,
      // poll: true,
      poll: 1000,
      ignored: /node_modules/,
    },
    watchContentBase: true,
    hot: true,
    index: 'index.html',
    open: true,
    publicPath: '/',
    progress: true,
    inline: true,
    // quiet: true,
    clientLogLevel: 'warning',
    disableHostCheck: true,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    https: false,
    stats: {
      colors: true,
    },
    historyApiFallback: true,
  },
};
