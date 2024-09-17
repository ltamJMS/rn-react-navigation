class Config {
  appENV = 'development'
  apiRoot = 'https://dev-api.infinitalk.net/api' // cluster cloud auth
  apiGatewayDomain = 'https://dev-api.infinitalk.net' // cluster cloud auth
  controllerApiRoot = 'https://dev1-controller.infinitalk.net/api'
  infinitalkConsoleWebDomain = 'https://dev1-text.infinitalk.net'
  clientID = 'client_app'
}
const configs = new Config()

export default configs
