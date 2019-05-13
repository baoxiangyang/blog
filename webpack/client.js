const webpack = require('webpack')
const merge = require('webpack-merge')
const baseConfig = require('./webpack.base.js')
const VueSSRClientPlugin = require('vue-server-renderer/client-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const isPro = require('process').env.NODE_ENV === 'production';

const path = require('path');
const root= path.resolve(__dirname, '..');
module.exports = merge(baseConfig, {
  entry: path.join(root, '/entry/client.js'),
  output: {
    path: path.join(root, '/public/dist'),
    filename: '[name].js',
    publicPath: '/dist/'
  },
  module: {
    rules: [{
      test: /\.less$/,
      use:[isPro ? MiniCssExtractPlugin.loader : 'vue-style-loader','css-loader','less-loader']       
    },{
      test: /\.css$/,
      use:[isPro ? MiniCssExtractPlugin.loader : 'vue-style-loader','css-loader']       
    }]
  },
  plugins: [
    // 重要信息：这将 webpack 运行时分离到一个引导 chunk 中，
    // 以便可以在之后正确注入异步 chunk。
    // 这也为你的 应用程序/vendor 代码提供了更好的缓存。
    /*new webpack.optimize.CommonsChunkPlugin({
      name: 'manifest',
      filename: 'manifest.js',
      minChunks: Infinity
    }),*/
    // 此插件在输出目录中
    // 生成 `vue-ssr-client-manifest.json`。
    new VueSSRClientPlugin(),
    new MiniCssExtractPlugin({
      filename: '[name].[hash].css'
    }),
    new webpack.DefinePlugin({
      baseURI: '"/"'
    }),
    new HtmlWebpackPlugin({
      template: './view/index.template.ejs',
      production: false,
      minify: false,
      filename: path.resolve(__dirname, '../view/index.template.html'),
    }),
  ]
})