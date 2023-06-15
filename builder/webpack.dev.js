const { merge } = require('webpack-merge');
const common = require('./webpack.base.js');

module.exports = merge(common, {
    mode: 'development',
    devtool: 'eval-source-map',
    module: {
        rules: [
            {
                test: /\.(ts|js)x?$/,
                loader: 'string-replace-loader',
                options: {
                    search: '/* babylonjs-debugLayer */',
                    replace: `import '@babylonjs/core/Debug/debugLayer';`,
                },
            },
            {
                test: /\.(ts|js)x?$/,
                loader: 'string-replace-loader',
                options: {
                    search: '/* babylonjs-inspector */',
                    replace: `import '@babylonjs/inspector';`,
                },
            },
        ],
    },
});
