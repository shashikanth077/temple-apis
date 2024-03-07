const webpack = require('webpack');
const { merge } = require('webpack-merge');
const common = require('./webpack.common');
const dotenv = require('dotenv');

// Load environment variables from .env.dev file
const envVariables = dotenv.config({ path: '.env.prod' }).parsed;

module.exports = merge(common, {
  mode: 'development',
  devtool: 'inline-source-map',
  plugins: [
    new webpack.DefinePlugin({
      'process.env': JSON.stringify(envVariables),
    }),
  ],
});
