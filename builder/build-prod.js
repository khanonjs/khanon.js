const esbuild = require('esbuild');
const base = require('./options');

(async () => {
  const res = await esbuild.build({
    ...base,
    logLevel: 'info',
    define: {
       'process.env.NODE_ENV': '"production"',
    },
  });
})();