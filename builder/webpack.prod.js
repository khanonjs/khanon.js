const { merge } = require('webpack-merge');
const path = require('path');
const base = require('./webpack.base.js');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = merge(base, {
    devServer: {
        host: 'localhost',
        port: 8080,
        hot: true,
        open: true,
        static: {
            publicPath: '/',
        },
    },
    mode: 'production',
    optimization: {
        minimize: true,
        minimizer: [
            new TerserPlugin({
                terserOptions: {
                    format: {
                        comments: false,
                    },
                },
                extractComments: false,
                parallel: true,
            }),
        ],
    },
    performance: {
        hints: false,
    },
    devtool: false,
    resolve: {
      alias: {
        '@khanonjs/engine': path.resolve(__dirname, 'node_modules/@khanonjs/engine/bundle')
      },
      extensions: ['.ts', '.js']
    },
});
