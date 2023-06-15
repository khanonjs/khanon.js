/* eslint-disable @typescript-eslint/no-var-requires */

const localPackage = require('../package.json')
const localVersion = localPackage.version

require('child_process').execSync(`git tag -a v${localVersion} -m "Published version ${localVersion}"`)
