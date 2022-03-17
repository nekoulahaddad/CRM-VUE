<<<<<<< HEAD
const path = require("path");

// module.exports = {

//     outputDir: "/var/www/crm_test_api/server/build"
// };const path = require("path");
// const webpack = require('webpack')

module.exports = {
    chainWebpack: (config) => {
        config.plugins.delete("prefetch");
        config.plugins.delete("preload");
        config.module.rule('vue').uses.delete('cache-loader');			
        config.module.rule('js').uses.delete('cache-loader');			
        config.module.rule('ts').uses.delete('cache-loader');			
        config.module.rule('tsx').uses.delete('cache-loader');	
        if (process.env.NODE_ENV === 'production') {
            // mutate config for production...
        } else {
            // mutate for development...
        }
    },

    outputDir: "/var/www/crm_test_api/server/build",
};
=======
const path = require("path");
const webpack = require("webpack");

module.exports = {
  chainWebpack: (config) => {
    config.plugins.delete("prefetch");
    config.plugins.delete("preload");
    config.module.rule("vue").uses.delete("cache-loader");
    config.module.rule("js").uses.delete("cache-loader");
    config.module.rule("ts").uses.delete("cache-loader");
    config.module.rule("tsx").uses.delete("cache-loader");
    if (process.env.NODE_ENV === "production") {
      // mutate config for production...
    } else {
      // mutate for development...
    }
  },

  outputDir: path.resolve(__dirname, "server/build"),
};
>>>>>>> 7dfe9d2824a78beaffa7a7f169e3de4fc286242f
