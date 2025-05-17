const { merge } = require('webpack-merge');
const base = require('./webpack.base.js');

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
    mode: 'development',
    devtool: 'eval-source-map',
});
