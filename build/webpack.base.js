/*
 * @Author: zb
 * @Date: 2019-03-25 18:00:43
 * @Last Modified by:   zb
 * @Last Modified time: 2019-03-25 18:00:43
 */
const path = require('path')

module.exports = {
  entry: {
    app: path.join(__dirname, '../client/app.js')
  },
  output: {
    path: path.join(__dirname, '../dist'),
    filename: '[name].[hash].js',
    publicPath: '/public/'
  },
  resolve: {
    extensions: ['.js', '.jsx'],
    alias: {
      '@client': path.join(__dirname, '../client'),
      '@assets': path.join(__dirname, '../client/assets'),
      '@state': path.join(__dirname, '../client/state')
    }
  },
  module: {
    rules: [
      {
        test: /\.js[x]?$/,
        exclude: /node_modules/,
        use: 'babel-loader'
      },
      {
        test: /\.(png|jpg|gif)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192,
              name: 'img/[name].[hash:4].[ext]'
            }
          }
        ]
      }
    ]
  }
}
