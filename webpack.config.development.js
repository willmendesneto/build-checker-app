/* eslint strict: 0 */
'use strict';

var webpack = require('webpack');
var webpackTargetElectronRenderer = require('webpack-target-electron-renderer');
var baseConfig = require('./webpack.config.base');


var config = Object.create(baseConfig);

config.debug = true;

config.devtool = 'cheap-module-eval-source-map';

config.entry = [
  'webpack-hot-middleware/client?path=http://localhost:3000/__webpack_hmr',
  './app/index'
];

config.noParse = /json-schema\/lib\/validate.js/;

config.output.publicPath = 'http://localhost:3000/dist/';

config.module.loaders.push({
  test: /\.global\.css$/,
  loaders: [
    'style-loader',
    'css-loader?sourceMap'
  ]
}, {
  test: /^((?!\.global).)*\.css$/,
  loaders: [
    'style-loader',
    'css-loader?modules&sourceMap&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]'
  ]
});


config.plugins.push(
  new webpack.HotModuleReplacementPlugin(),
  new webpack.NoErrorsPlugin(),
  new webpack.DefinePlugin({
    __DEV__: true,
    'process.env': {
      NODE_ENV: JSON.stringify('development')
    }
  })
);

config.target = webpackTargetElectronRenderer(config);

module.exports = config;
