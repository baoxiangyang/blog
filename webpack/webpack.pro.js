let path = require('path'),
  webpack = require('webpack'),
  pkgInfo =require('../package.json'),
  CleanWebpackPlugin = require('clean-webpack-plugin'),
  HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = {
  entry: {'main': './src/main.js'},
  output: {
    path: path.resolve(__dirname, '../public/dist'),
    publicPath: '/dist',
    filename: '[name].[chunkhash].build.js'
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]?[hash]'
        }
      },
      {
        test: /\.css$/,
        loader: 'style-loader!css-loader'
      },
      {
        test: /\.less$/,
        loader: 'style-loader!css-loader!less-loader'
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2)(\?\S*)?$/,
        loader: 'file-loader'
      },
      {
        test:'/\.html$/',
        loader:'html-loader'
      }
    ]
  },
  externals:[{
    'vue': 'Vue',
    'vuex': 'Vuex',
    'vue-router': 'VueRouter',
    'element-ui': 'ELEMENT',
    'axios': 'axios'
  }],
  plugins: [
    new CleanWebpackPlugin(['../public/dist/main.*.js'], {
      'root': __dirname,
      'verbose': true,
      'dry': true
    }),
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.DefinePlugin({
      DEBUG: false,
      VERSION: JSON.stringify(pkgInfo.version),
      'process.env': {
        NODE_ENV: '"production"'
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    }),
    new HtmlWebpackPlugin({
      title: '小包总',
      template: './views/index.ejs',
      production: true,
      filename: '../../views/index.html'
    })
  ]
};
