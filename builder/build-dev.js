const esbuild = require('esbuild');
const base = require('./build');

(async () => {
  const res = await esbuild.build({
    ...base,
    logLevel: 'debug',
    define: {
       'process.env.NODE_ENV': '"development"',
    },
  });
})();