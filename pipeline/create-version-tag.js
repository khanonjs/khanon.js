/* eslint-disable @typescript-eslint/no-var-requires */

const localPackage = require('../package.json')
const localVersion = localPackage.version
const tag = `v${localVersion}`

console.log(`Adding Git tag '${tag}'`)

let buffer
buffer = require('child_process').execSync('git switch main')
console.log('aki result A:', buffer.toString())
buffer = require('child_process').execSync('git show-ref')
console.log('aki result B:', buffer.toString())
buffer = require('child_process').execSync('git branch')
console.log('aki result C:', buffer.toString())
buffer = require('child_process').execSync(`git tag -a ${tag} -m "Published version ${localVersion}"`)
console.log('aki result D:', buffer.toString())
