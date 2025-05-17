const fs = require('fs');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const path = require('path');
const appDirectory = fs.realpathSync(process.cwd());

module.exports = {
    entry: path.resolve(appDirectory, 'src/app.ts'), //path to the main .ts file
    output: {
        filename: 'js/app.js', //name for the js file that is created/compiled in memory
    },
    resolve: {
        extensions: ['.ts', '.js'],
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            inject: true,
            template: path.resolve(appDirectory, 'public/index.html'),
        }),
    ],
    mode: 'none',
};
