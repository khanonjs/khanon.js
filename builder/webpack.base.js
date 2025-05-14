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
                    // configFile: settings.computed.tsConfigPath,
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

/* 8a8f eliminar
{
    "context": "C:\\Proyectos\\Babylon.js\\src",
    "entry": {
        "babylonjs": "C:\\Proyectos\\Babylon.js\\src\\Legacy\\legacy.ts"
    },
    "output": {
        "path": "C:\\Proyectos\\Babylon.js\\dist\\preview release",
        "filename": "babylon.js",
        "libraryTarget": "umd",
        "library": {
            "root": [
                "BABYLON"
            ],
            "amd": "babylonjs",
            "commonjs": "babylonjs"
        },
        "umdNamedDefine": true,
        "globalObject": "(typeof self !== \"undefined\" ? self : typeof global !== \"undefined\" ? global : this)"
    },
    "resolve": {
        "extensions": [
            ".ts"
        ]
    },
    "externals": [
        null
    ],
    "devtool": "none",
    "module": {
        "rules": [
            {
                "test": {},
                "loader": "ts-loader",
                "options": {
                    "configFile": "C:\\Proyectos\\Babylon.js\\src\\tsconfig.json",
                    "compilerOptions": {
                        "declaration": false,
                        "exclude": [
                            "node_modules"
                        ]
                    }
                }
            }
        ]
    },
    "mode": "production",
    "performance": {
        "hints": false
    },
    "plugins": [
        {
            "paths": [
                {},
                {},
                {},
                {}
            ]
        }
    ]
}
*/
