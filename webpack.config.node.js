// for babel-plugin-webpack-loaders
var devConfigs = require('./webpack.config.development');

module.exports = {
  output: {
    libraryTarget: 'umd'
  },
  module: {
    loaders: devConfigs.module.loaders.slice(1)  // remove babel-loader
  }
};
