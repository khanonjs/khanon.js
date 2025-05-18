import * as pluginCopy from 'esbuild-plugin-copy'

export const optionsBase = (distFolder) => {
  if (!distFolder) {
    distFolder = 'dist'
  }
  return {
    entryPoints: ['src/app.ts'],
      bundle: true,
      minify: true,
      sourcemap: false,
      platform: 'browser',
      target: ['es2017'],
      outfile: `./${distFolder}/js/app.js`,
      treeShaking: true,
      plugins: [
        pluginCopy.copy({
          resolveFrom: 'cwd',
          assets: [
            {
              from: ['./public/*'],
              to: [`./${distFolder}`]
            }
          ]
        })
      ],
  }
}