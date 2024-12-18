module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    'module:react-native-dotenv',
    [
      'module-resolver',
      {
        alias: {
          '@components': './components',
          '@constants': './constants',
          '@hooks': './hooks',
          '@providers': './providers',
          '@navigators': './navigators',
          '@screens': './screens',
          '@utils': './utils',
          '@stores': './stores',
          '@types': './types',
          '@libs': './libs',
          '@schemas': './schemas',
          '@i18n': './i18n'
        }
      }
    ]
  ]
}
