/* eslint-disable @typescript-eslint/no-var-requires */

const semver = require('semver')

const localPackage = require('../package.json')
const localVersion = localPackage.version
console.log('Local version:', localVersion)

const registryBuffer = require('child_process').execSync('npm view @khanonjs/engine version')
const registryVersion = registryBuffer.toString()
console.log('Registry version:', registryVersion)

if (semver.gt(localVersion, registryVersion)) {
  console.log('Version is higher, OK!')
  process.exit(0)
} else {
  console.log('Local version is equal or lower than registry, won\'t deploy.')
  process.exit(3)
}
