module.exports = {
  parserPreset: {
    parserOpts: {
      headerPattern: /^NFNTLKDVLP-(\d+) - (.*?):(.*)/,
      headerCorrespondence: ['taskId', 'type', 'message']
    }
  },
  plugins: [
    {
      rules: {
        'header-match-team-pattern': (parsed) => {
          const { taskId, type, message } = parsed
          const rawInput = parsed.header

          if (rawInput?.toLowerCase()?.startsWith('test')) {
            return [true, '']
          }

          if (taskId === null && type === null && message === null) {
            return [
              false,
              "\x1b[31mERROR\x1b[0m: Please follow the format 'NFNTLKDVLP-TaskID - Type: message' \n 👉 Type is one of [build, chore, ci, docs, feature, bugfix, refactor, revert, test] \n 👉 Example: NFNTLKDVLP-1111 - feature: add new feature"
            ]
          }
          return [true, '']
        },
        'gitmoji-type-enum': (parsed, _when, expectedValue) => {
          const { type } = parsed
          if (type && !expectedValue.includes(type)) {
            return [
              false,
              `\x1b[31mERROR\x1b[0m: [${type}] doesn't include in [${expectedValue}]`
            ]
          }

          return [true, '']
        }
      }
    }
  ],
  rules: {
    'header-match-team-pattern': [2, 'always'],
    'gitmoji-type-enum': [
      2,
      'always',
      [
        'build',
        'chore',
        'ci',
        'docs',
        'feature',
        'bugfix',
        'refactor',
        'revert',
        'test'
      ]
    ]
  }
}
