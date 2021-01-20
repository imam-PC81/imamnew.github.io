# README

Webpack@5 開発環境

@see - [webpack](https://webpack.js.org/)

## インストール
Node.js 事前にインストールが必要です。

[node.js](https://nodejs.org/ja/)

node v14以上 推奨 - [package.json - engines](./package.json)

```
"engines": {
  "node": ">= 14.15.4",
  "npm": ">= 6.14.10"
}
```

インストールコマンド

    npm i

## コマンド

### 開発

    npm start

web-dev-server が起動し開発を行えます。

サーバーへは以下いずれかでアクセス可能です。

    http://YOUR_IP_ADDRESS:63000
    http://localhost:63000
    http://0.0.0.0:63000

### ビルド

    npm run build

`./htdocs` 内へ出力されます。

- JS: minify されます
- CSS: minify されます
- png, gif, jpg, svg: optimize されます

## 階層

`./src` - 開発階層(HTML / CSS / JS)

`./public` - 依存ファイル配置（SSI include 含む）・JS / CSS / 画像 ビルド時に minify, optimize 不要ファイル配置


## JS
ES2016(babel)以降対応, ES5は保証外です。

[babel](https://babeljs.io/)

## SCSS
Dart Sass を使用します。

`@import` を廃止し `@use / @forward` を使用します。

- [@use](https://sass-lang.com/documentation/at-rules/use)
- [@forward](https://sass-lang.com/documentation/at-rules/forward)

【ご注意】  
scss からの画像パスは **相対** で記述をお願いします。


