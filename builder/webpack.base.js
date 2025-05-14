const fs = require('fs');

var glob = require('glob');
const path = require('path');
const srcDir = path.resolve(fs.realpathSync(process.cwd()), './src');
const CircularDependencyPlugin = require('circular-dependency-plugin')

module.exports = {
    entry: './src/index.ts',
    output: {
        path: path.resolve(__dirname, '../dist/bundle'),
        filename: 'index.js',
        library: {
          type: 'commonjs2',
        },
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
    devtool: false,
    plugins: [
        new CircularDependencyPlugin({
          allowAsyncCycles: true
        })
      ],
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
                        exclude: ['node_modules'],
                    },
                },
            },
        ],
    },
};