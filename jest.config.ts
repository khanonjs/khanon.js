module.exports = {
  clearMocks: true,
  coverageProvider: 'v8',
  preset: 'ts-jest/presets/js-with-ts',
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': ['ts-jest', {
      isolatedModules: true,
      tsconfig: { // to have tsc transform .js files
        allowJs: true,
        checkJs: false
      }
    }]
  },
  transformIgnorePatterns: [

  ],
  testPathIgnorePatterns: [
    '<rootDir>/node_modules/'
  ],
  testEnvironment: 'node'
}
