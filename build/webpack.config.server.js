/*
 * @Author: zb
 * @Date: 2019-03-22 16:04:32
 * @Last Modified by: zb
 * @Last Modified time: 2019-03-26 16:45:08
 */

const path = require('path')
const webpack = require('webpack')
const webpackMerge = require('webpack-merge')
const baseConfig = require('./webpack.base')

const isDev = process.env.NODE_ENV === 'development'

module.exports = webpackMerge(baseConfig, {
  target: 'node',
  mode: isDev ? 'development' : 'production',
  entry: {
    app: path.join(__dirname, '../client/server-entry.js')
  },
  output: {
    path: path.join(__dirname, '../dist'),
    filename: 'server-entry.js',
    libraryTarget: 'commonjs2'
  },
  externals: { // import fetch.js时报错解决办法
    bufferutil: 'commonjs bufferutil',
    'utf-8-validate': 'commonjs utf-8-validate'
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          'isomorphic-style-loader',
          {
            loader: 'css-loader'
          }
        ]
      },
      {
        test: /\.less/,
        use: [
          'isomorphic-style-loader',
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
              modules: true,
              localIdentName: '[name]_[local]_[hash:base64:5]'
            }
          }, {
            loader: 'less-loader'
          }]
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.API_BASE': '"http://127.0.0.1:3333"'
    })
  ]
})
