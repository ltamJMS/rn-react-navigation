module.exports = {
  root: true,
  extends: ['@react-native', 'plugin:react/jsx-runtime'],
  plugins: ['simple-import-sort', 'unused-imports', '@cspell'],
  rules: {
    'simple-import-sort/imports': [
      'warn',
      {
        groups: [
          // `react` first, then packages starting with a character
          ['^react$', '^[a-z]'],
          // Packages starting with `@`
          ['^@'],
          // Imports starting with `../`
          ['^\\.\\.(?!/?$)', '^\\.\\./?$'],
          // Imports starting with `./`
          ['^\\./(?=.*/)(?!/?$)', '^\\.(?!/?$)', '^\\./?$']
        ]
      }
    ],
    'simple-import-sort/exports': 'warn',
    'unused-imports/no-unused-imports': 'warn',
    '@cspell/spellchecker': [
      'error',
      {
        checkComments: true,
        autoFix: false,
        cspell: {
          ignoreWords: []
        },
        customWordListFile: {
          path: './.vscode/cspell.json'
        }
      }
    ],
    'comma-dangle': ['off'],
    semi: ['off'],
    'jsx-quotes': [2, 'prefer-single'],
    'no-console': 'error',
    '@typescript-eslint/no-explicit-any': 'error'
  }
}
