/* eslint-disable @typescript-eslint/no-var-requires */

const localPackage = require('../package.json')
const localVersion = localPackage.version
const tag = `v${localVersion}`

console.log(tag)
