import * as esbuild from 'esbuild'
import { optionsBase } from './options-base.mjs'
import { runBrowser } from './run-browser.mjs';
import yargs from 'yargs/yargs'
import chalk from 'chalk'

(async () => {
  const yargsInstance = yargs(process.argv.slice(2))
  const argv = yargsInstance.parseSync()

  let dest = typeof argv.dest === 'string' ? argv.dest : undefined
  let port = typeof argv.port === 'number' ? argv.port : undefined

  await esbuild.context({
    ...optionsBase(dest),
    minify: false,
    sourcemap: true,
    logLevel: 'info',
    define: {
       'process.env.NODE_ENV': '"development"',
    },
  }).then(async (ctx) => {
    console.log(chalk.cyan('Initial build complete.'));
    await ctx.watch()
    ctx.serve({
      servedir: dest ?? 'dist',
      port: port ?? 3000,
    }).then(server => {
      runBrowser(server.port);
    });
  })
})();