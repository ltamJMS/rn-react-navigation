module.exports = {
  root: true,
  extends: [
    'plugin:prettier/recommended',
    '@react-native',
    'plugin:react/jsx-runtime'
  ],
  plugins: ['simple-import-sort', 'unused-imports', '@cspell'],
  rules: {
    'simple-import-sort/imports': 'warn',
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
    'jsx-quotes': [2, 'prefer-single']
  }
}
