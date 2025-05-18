const esbuild = require('esbuild');
const base = require('./build');

(async () => {
  const res = await esbuild.build({
    ...base,
    logLevel: 'trace',
    define: {
       'process.env.NODE_ENV': '"development"',
    },
  });
})();