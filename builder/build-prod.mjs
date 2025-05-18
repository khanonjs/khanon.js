import * as esbuild from 'esbuild'
import { optionsBase } from './options-base.mjs'
import yargs from 'yargs/yargs'

(async () => {
  const yargsInstance = yargs(process.argv.slice(2))
  const argv = yargsInstance.parseSync()

  let dest = typeof argv.dest === 'string' ? argv.dest : undefined

  await esbuild.build({
    ...optionsBase(dest),
    logLevel: 'info',
    define: {
       'process.env.NODE_ENV': '"production"',
    },
  });
})();