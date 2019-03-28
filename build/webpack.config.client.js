/*
 * @Author: zb
 * @Date: 2019-03-25 18:00:51
 * @Last Modified by: zb
 * @Last Modified time: 2019-03-28 10:09:31
 */
const path = require('path')
const webpack = require('webpack')
const webpackMerge = require('webpack-merge')
const HTMLPlugin = require('html-webpack-plugin')
const OpenBrowserPlugin = require('open-browser-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const baseConfig = require('./webpack.base')
const CleanWebpackPlugin = require('clean-webpack-plugin');

const isDev = process.env.NODE_ENV === 'development'

const config = webpackMerge(baseConfig, {
  mode: isDev ? 'development' : 'production',
  plugins: [
    new HTMLPlugin({
      template: path.join(__dirname, '../client/template.html')
    }),
    new HTMLPlugin({
      template: '!!ejs-compiled-loader!' + path.join(__dirname, '../client/server.template.ejs'),
      filename: 'server.ejs'
    })
  ],
  module: {}
})
if (isDev) {
  config.devtool = '#cheap-module-eval-source-map'
  config.entry = {
    app: [
      'react-hot-loader/patch',
      path.join(__dirname, '../client/app.js')
    ]
  }
  config.module.rules.push(
    {
      test: /\.css/, // css作为全局样式导入
      use: [
        {
          loader: 'style-loader'
        }, {
          loader: 'css-loader'
        }]
    },
    {
      test: /\.less/, // less作为cssinjs用来渲染服务端样式
      use: [
        {
          loader: 'style-loader'
        }, {
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
  )
  config.devServer = {
    host: '0.0.0.0',
    compress: true,
    port: '8888',
    contentBase: path.join(__dirname, '../client'),
    hot: true,
    overlay: {
      errors: true
    },
    publicPath: '/public/',
    historyApiFallback: {
      index: '/public/index.html'
    },
    proxy: {
      '/api': 'http://localhost:3333'
    }
  }
  config.plugins.push(
    new webpack.HotModuleReplacementPlugin(),
    new OpenBrowserPlugin({
      url: `http://localhost:8888`
    })
  )
} else {
  config.output.filename = '[name].[chunkhash].js'
  config.output.publicPath = '/public/'
  config.optimization = {
    minimizer: [
      new UglifyJsPlugin({
        uglifyOptions: {
          compress: false
        }
      })
    ],
    runtimeChunk: 'single',
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendor',
          chunks: 'all'
        }
      }
    }
  }
  config.plugins.push(new CleanWebpackPlugin())
  config.plugins.push(new CopyWebpackPlugin([
    {
      from: './client/public',
      to: './public'
    }
  ]))

  config.plugins.push(
    new webpack.HashedModuleIdsPlugin(),
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash].css',
      chunkFilename: '[id].[contenthash].css'
    }),
    // 设置文件名chunk，但在router里异步加载时直接设置了名字，所以下面插件好像没生效
    new webpack.NamedChunksPlugin(chunk => {
      if (chunk.name) {
        return chunk.name
      }
      return Array.from(chunk.modulesIterable, m => m.id).join('_')
    })
  )
  config.module.rules.push(
    {
      test: /\.css/,
      use: [
        MiniCssExtractPlugin.loader,
        'css-loader'
      ]
    },
    {
      test: /\.less/,
      use: [
        {
          loader: MiniCssExtractPlugin.loader
        },
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
  )
}
module.exports = config
