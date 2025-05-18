const base = require('./options');
const serve = require('serve');

(async () => {
  const res = await esbuild.build({
    ...base,
    minify: false,
    sourcemap: true,
    watch: {
      onRebuild(error, result) {
        if (error) console.error('❌ Rebuild failed:', error);
        else console.log('✅ Rebuild succeeded');
      },
    },
  }).then(() => {
    console.log('✅ Build successful');

    // Serve "dist" and "public"
    const serveDist = serve('dist');
    const servePublic = serve('public');
    const server = http.createServer((req, res) => {
      serveDist(req, res, () => servePublic(req, res, finalhandler(req, res)));
    });

    server.listen(3000, () => {
      console.log('🌐 Server running at http://localhost:3000');
    });
  });
})();