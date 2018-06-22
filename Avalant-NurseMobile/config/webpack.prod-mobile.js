// Webpack Mobile development config

process.env.IONIC_ENV = 'prod-mobile';

global.dotenvConfig = {
  path: '.prod-mobile.env'
};

var webpackConfig = require('./webpack.config');

module.exports = webpackConfig;
