/* eslint-disable @typescript-eslint/no-var-requires */

const localPackage = require('../package.json')
const localVersion = localPackage.version
const tag = `v${localVersion}`

console.log(`Adding Git tag '${tag}'`)

require('child_process').execSync(`git tag -a ${tag} -m "Published version ${localVersion}"`)
