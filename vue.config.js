const path = require("path");
const webpack = require('webpack')

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

    outputDir: path.resolve(__dirname, "server/build"),
};