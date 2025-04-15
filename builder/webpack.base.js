const fs = require('fs');

var glob = require('glob');
const path = require('path');
const srcDir = path.resolve(fs.realpathSync(process.cwd()), './src');
const CircularDependencyPlugin = require('circular-dependency-plugin')

console.log('aki srcDir:', srcDir);

entryObj = {};
glob.sync(srcDir + '/**/*.ts').forEach((value) => {
    value = value.slice(srcDir.length);
    console.log('aki glob value:', value);
    console.log('aki glob file:', path.parse(value).base);
    console.log('aki glob path:', path.parse(value).dir);
    entryObj[value] = value
});

// console.log('entryObj:', entryObj);

module.exports = {
    // entry: path.resolve(appDirectory, './src/*'),
    // entry: {
    //     core: path.resolve(appDirectory, './src'),
    // },
    // output: {
    //     filename: '[name].js',
    // },
    entry: {
        'modules/sprite/sprite-texture': 'C:/Proyectos/khanon.js/src/modules/sprite/sprite-texture.ts',
        'modules/scene/scene': 'C:/Proyectos/khanon.js/src/modules/scene/scene.ts',
    },
    output: {
        filename: '[name].js',
        sourceMapFilename: '[name].js.map',
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
