const { merge } = require('webpack-merge');
const base = require('./webpack.base.js');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = merge(base, {
    mode: 'production',
    performance: {
        hints: false,
    },
    devtool: false,
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
    module: {
        rules: [
            {
                test: /\.ts$/,
                loader: 'string-replace-loader',
                options: {
                    search: '^.*Logger.debug.*\\n?',
                    replace: '',
                    flags: 'gm'
                },
            }
        ],
    },
});
