// webpack.common.js
const path = require('path');
const webpack = require('webpack');
const NodeExternals = require('webpack-node-externals');

module.exports = {
  entry: './server.js',
  target: 'node',
  externals: [NodeExternals()],
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, '../'), // Adjust the path as needed
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV),
        ...require('dotenv').config().parsed,
      },
    }),
  ],
};
