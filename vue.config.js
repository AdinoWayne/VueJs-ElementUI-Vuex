const Dotenv = require('dotenv-webpack');

const getFile = function() {
  const data = `@import "@/assets/styles/common/variables.scss";`;
  return data;
};

module.exports = {
  devServer: {
    port: 8081
  },
  css: {
    loaderOptions: {
      sass: {
        data: getFile()
      }
    }
  },
  configureWebpack: {
    plugins: [
      new Dotenv()
    ]
  },
  pluginOptions: {
    i18n: {
      locale: "en",
      fallbackLocale: "en",
      localeDir: "/languages",
      enableInSFC: false
    }
  },
}