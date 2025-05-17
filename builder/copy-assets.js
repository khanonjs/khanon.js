/**
 * Needed to keep files timestamps and avoid undesired uploads to server
 */

const copy = require('recursive-copy')

copy('./public', './dist', function (error, results) {
  if (error) {
    console.error('Copy assets failed: ' + error)
  } else {
    console.info('Copy assets: Copied ' + results.length + ' files')
  }
})
