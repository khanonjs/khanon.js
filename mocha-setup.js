// NOTE: Don't convert to ES module or it will do a void job
// eslint-disable-next-line @typescript-eslint/no-var-requires
const sinon = require('sinon')

// Restores the default sandbox after every test
exports.mochaHooks = {
  afterEach() {
    sinon.restore()
  }
}

// exports.mochaGlobalSetup = async () => {
// }

// exports.mochaGlobalTeardown = async () => {
// }
