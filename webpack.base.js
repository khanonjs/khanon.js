const fs = require('fs')
const glob = require('glob')
const path = require('path')

module.exports = {
  entry: './src/index.ts',
  output: {
    path: path.resolve(__dirname, '../dist/bundle'),
    filename: 'index.js',
    library: {
      type: 'commonjs2'
    }
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js']
  },
  devtool: false,
  mode: 'none',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        options: {
          transpileOnly: true,
          compilerOptions: {
            declaration: true,
            exclude: ['node_modules']
          }
        }
      }
    ]
  }
}
