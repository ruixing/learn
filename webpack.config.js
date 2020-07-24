const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'development',

  entry: './client/index.jsx',

  output: {
    path: path.resolve(__dirname, 'build'), // string
    filename: 'bundle.js', // string
    publicPath: '', // string
  },

  module: {
    rules: [
      {
        test: /\.jsx?$/,
        include: path.resolve(__dirname, 'client'),
        loader: 'babel-loader'
      }
    ]
  },

  plugins: [
    new HtmlWebpackPlugin({
        filename: path.resolve(__dirname, 'build/index.html'),
        template: path.resolve(__dirname, 'client/index.html')
    })
  ]
};