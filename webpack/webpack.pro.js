let path = require('path'),
  webpack = require('webpack'),
  pkgInfo =require('../package.json'),
  CleanWebpackPlugin = require('clean-webpack-plugin'),
  HtmlWebpackPlugin = require('html-webpack-plugin'),
  ExtractText = require('extract-text-webpack-plugin');
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
        loader: 'vue-loader',
        options: {
          loaders: {
            less: ExtractText.extract({
              use: ['css-loader', 'less-loader'],
            })
          }
        }
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
        use: ExtractText.extract({
          use: ['css-loader']
        })
      },
      {
        test: /\.less$/,
        use: ExtractText.extract({
          use: ['css-loader', 'less-loader']
        })
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
    'axios': 'axios',
    'blueimp-md5': 'md5',
    'highlight.js': 'hljs'
  }],
  plugins: [
    new CleanWebpackPlugin(['../public/dist/*.js'], {
      root: __dirname,
      verbose: true,
      dry: false
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
    }),
    new ExtractText('index.[hash].css')
  ]
};
