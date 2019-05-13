const webpack = require('webpack')
const merge = require('webpack-merge')
const baseConfig = require('./webpack.base.js')
const VueSSRClientPlugin = require('vue-server-renderer/client-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

const isPro = require('process').env.NODE_ENV === 'production';
const path = require('path');
const root= path.resolve(__dirname, '..');
module.exports = merge(baseConfig, {
  mode: 'production',
  entry: path.join(root, '/entry/client.js'),
  output: {
    path: path.join(root, '/public/dist'),
    filename: '[name]_[contenthash:6].js',
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
  externals:[{
    'vue': 'Vue',
    'vuex': 'Vuex',
    'vue-router': 'VueRouter',
    'element-ui': 'ELEMENT',
    'blueimp-md5': 'md5',
    'highlight.js': 'hljs'
  }],
  plugins: [
    new CleanWebpackPlugin(
      ['/public/dist'],  // 匹配删除的文件
      {
        root: path.join(__dirname, '../'), // 必须先重置到根路经
        verbose: true, // 开启在控制台输出信息
        dry: false // 启用删除文件
      }
    ),
    new VueSSRClientPlugin(),
    new webpack.DefinePlugin({
      baseURI: '"/"'
    }),
    new MiniCssExtractPlugin({
      filename: '[name].[hash].css'
    }),
    new HtmlWebpackPlugin({
      template: './view/index.template.ejs',
      production: true,
      minify: false,
      filename: path.resolve(__dirname, '../view/index.template.html'),
    }),
  ]
})