module.exports = {
  "transpileDependencies": [
    "vuetify"
  ],
  configureWebpack: {
    devtool: 'source-map',
  },
  runtimeCompiler: true,
  pluginOptions: {
    electronBuilder: {
      builderOptions: {
        productName: '程序员鼓励师',
        appId: 'cheerkit',
        copyright: 'Copyright',
        publish: [
          {
            'provider': 'generic',
            'url': 'https://**.**.*/download/'
          }
        ]
      }
    }
  }
}
