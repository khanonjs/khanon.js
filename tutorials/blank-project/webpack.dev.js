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
  mode: 'development',
  devtool: 'eval-source-map'
})
