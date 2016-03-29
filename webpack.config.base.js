/* eslint strict: 0 */
'use strict';

var path = require('path');

process.env.NODE_ENV = process.env.NODE_ENV || 'production';
//
// If you have some problems, such as
//
// ```
//
// ```
//
// please try install request package
//
// For more details, please check https://github.com/request/request/issues/1920#issuecomment-179904270
// and https://github.com/request/request/issues/1920#issuecomment-171246043

module.exports = {
  noParse: /json-schema\/lib\/validate.js/,
  module: {
    loaders: [{
      test: /\.jsx?$/,
      loaders: ['babel-loader'],
      exclude: /node_modules/
    },
    {
      test: /\.json$/,
      loader: 'json-loader'
    }]
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js',
    libraryTarget: 'umd'
  },
  resolve: {
    extensions: ['', '.js', '.jsx', 'json'],
    packageMains: ['webpack', 'browser', 'web', 'browserify', ['jam', 'main'], 'main']
  },
  plugins: [

  ],
  externals: [
    // put your node 3rd party libraries which can't be built with webpack here
    // (mysql, mongodb, and so on..)
  ]
};
