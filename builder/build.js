const pluginCopy = require('esbuild-plugin-copy');

module.exports = {
  entryPoints: ['src/app.ts'],
    bundle: true,
    minify: true,
    sourcemap: false,
    platform: 'browser',
    target: ['es2017'],
    outfile: 'dist/js/app.js',
    treeShaking: true,
    plugins: [
      pluginCopy.copy({
        resolveFrom: 'cwd',
        assets: [
          {
            from: ['./public/*'],
            to: ['./dist']
          }
        ]
      })
    ],
}