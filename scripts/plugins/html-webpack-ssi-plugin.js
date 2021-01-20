// https://github.com/jantimon/html-webpack-plugin
const HtmlWebpackPlugin = require('html-webpack-plugin');
// https://github.com/yanni4night/node-ssi/
const SSI = require('node-ssi');

/**
 * html-webpack-plugin へ SSI 機能追加するプラグイン
 * @see https://github.com/jantimon/html-webpack-plugin
 * @see https://github.com/yanni4night/node-ssi
 *
 * webpack@5 では `html-webpack-plugin@next` が必要 @see https://github.com/jantimon/html-webpack-plugin#install
 */
class HtmlWebpackSSIPlugin {
  /**
   * `node-ssi` option と等価の引数を取得し initial property へマージする
   * - baseDir: '' - ssi file directory
   * - encoding: 'utf-8'
   * - payload: {}
   * @param {*} options `node-ssi` option と等価
   */
  constructor(options = {}) {
    const initial = {
      baseDir: '',
      encoding: 'utf-8',
      payload: {},
    };
    this.options = { ...initial, ...options };

    this.ssi = new SSI(this.options);
    this.ssiProcessing = this.ssiProcessing.bind(this);
  }

  apply(compiler) {
    compiler.hooks.compilation.tap('HtmlWebpackSSIPlugin', compilation => {
      // console.log('HtmlWebpackSSIPlugin', HtmlWebpackPlugin.getHooks)
      // if (HtmlWebpackPlugin.getHooks) {
      //   // v4
      //   HtmlWebpackPlugin.getHooks(compilation).afterEmit.tapAsync(
      //     'HtmlWebpackSSIPlugin',
      //     this.afterHtmlProcessing
      //   );
      // } else {
      //   // v3
      //   compilation.hooks.htmlWebpackPluginAfterHtmlProcessing.tapAsync(
      //     'HtmlWebpackSSIPlugin',
      //     this.afterHtmlProcessing
      //   );
      // }
      // HtmlWebpackPlugin.getHooks(compilation).afterEmit.tapAsync(
      // @since webpack5+html-webpack-plugin@next beforeEmit でないと insert できない
      HtmlWebpackPlugin.getHooks(compilation).beforeEmit.tapAsync(
        'HtmlWebpackSSIPlugin',
        this.ssiProcessing
      );
    });
  }

  ssiProcessing(data, callback) {
    if (data.html) {
      this.ssi.compile(data.html, this.options, (error, content) => {
        if (!error) {
          data.html = content
        } else {
          console.error('[HtmlWebpackSSIPlugin] - error', error)
        }

        callback(null, data)
      })
    } else {
      callback(null, data)
    }
  }
}

module.exports = HtmlWebpackSSIPlugin;
