// Webpack Mobile development config

process.env.IONIC_ENV = 'dev-mobile';

global.dotenvConfig = {
  path: '.dev-mobile.env'
};

var webpackConfig = require('./webpack.config');

module.exports = webpackConfig;
