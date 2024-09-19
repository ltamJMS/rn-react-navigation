class Config {
  appENV = 'production'
  apiRoot = 'https://api.infinitalk.net/api' // cluster cloud auth
  apiGatewayDomain = 'https://api.infinitalk.net' // cluster cloud auth
  controllerApiRoot = 'https://controller.infinitalk.net/api'
  infinitalkConsoleWebDomain = 'https://text.infinitalk.net'
  clientID = 'client_app'
}
const configs = new Config()

export default configs
