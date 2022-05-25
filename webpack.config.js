const MomentLocalesPlugin = require("moment-locales-webpack-plugin");

module.exports = {
  module: {
    rules: [
      // ... other rules omitted
      // this will apply to both plain `.scss` files
      // AND `<style lang="scss">` blocks in `.vue` files
      {
        test: /\.scss$/,
        use: ["vue-style-loader", "css-loader", "sass-loader"]
      },
      {
        // this will apply the indent-based sass syntax.
        test: /\.sass$/,
        use: [
          "vue-style-loader",
          "css-loader",
          {
            loader: "sass-loader",
            options: {
              indentedSyntax: true
            }
          }
        ]
      }
    ]
  },
  // plugin omitted
  plugins: [
    // To strip all locales except “en”
    new MomentLocalesPlugin()
  ]
};
