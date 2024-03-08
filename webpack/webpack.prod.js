const webpack = require('webpack');
const { merge } = require('webpack-merge');
const common = require('./webpack.common');
const dotenv = require('dotenv');

const envVariables = dotenv.config({ path: '.env.prod' }).parsed;

const stringifiedEnv = Object.keys(envVariables).reduce((acc, key) => {
  acc[`process.env.${key}`] = JSON.stringify(envVariables[key]);
  return acc;
}, {});

module.exports = merge(common, {
  mode: 'development',
  devtool: 'inline-source-map',
  plugins: [
    new webpack.DefinePlugin(stringifiedEnv),
  ],
});
