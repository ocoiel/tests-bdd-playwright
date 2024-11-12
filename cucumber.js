module.exports = {
  default: {
    paths: ['src/tests/features/**/*.feature'],
    requireModule: ['ts-node/register'],
    require: ['src/tests/steps/**/*.ts', 'src/tests/support/**/*.ts'],
    format: [
      'summary',
      'progress-bar'
    ],
    formatOptions: {
      snippetInterface: 'async-await'
    },
    worldParameters: {
      browsers: {
        chrome: 'chromium'
      }
    },
    timeout: 12000 // 12 seconds
  }
}