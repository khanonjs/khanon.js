/* eslint-disable @typescript-eslint/no-var-requires */
const { merge } = require('webpack-merge')
const common = require('./webpack.config.js')

module.exports = merge(common, {
  devServer: {
    host: 'localhost',
    port: 8080, // port that we're using for local host (localhost:8080)
    hot: true,
    open: true,
    static: {
      publicPath: '/'
    }
  },
  module: {
    rules: [
      {
        test: /\.(ts|js)x?$/,
        loader: 'string-replace-loader',
        options: {
          search: '/* babylonjs-debugLayer */',
          replace: 'import \'@babylonjs/core/Debug/debugLayer\';'
        }
      },
      {
        test: /\.(ts|js)x?$/,
        loader: 'string-replace-loader',
        options: {
          search: '/* babylonjs-inspector */',
          replace: 'import \'@babylonjs/inspector\';'
        }
      }
    ]
  },
  mode: 'development',
  devtool: 'eval-source-map'
})
