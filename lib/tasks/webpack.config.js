const path = require('path');
const glob = require('glob');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CommonsChunkPlugin = webpack.optimize.CommonsChunkPlugin;
const UglifyJsPlugin = webpack.optimize.UglifyJsPlugin;

const debug = process.env.NODE_ENV !== 'production';

const entries = getEntry('src/page/**/*.js', 'src/scripts/page/');
const chunks = Object.keys(entries);

let config = {
  entry: entries,
  output: {
    path: path.join(__dirname, 'public'),
    publicPath: '/static/',
    filename: 'scripts/[name].js',
    chunkFilename: 'scripts/[id].chunk.js?[chunkhash]'
  },
  module: {
    loaders: [ //加载器
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract('style', 'css')
      }, {
        test: /\.less$/,
        loader: ExtractTextPlugin.extract('css!less')
      }, {
        test: /\.html$/,
        loader: "html?-minimize" 
      }, {
        test: /\.(woff|woff2|ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'file-loader?name=fonts/[name].[ext]'
      }, {
        test: /\.(png|jpe?g|gif)$/,
        loader: 'url-loader?limit=8192&name=imgs/[name]-[hash].[ext]'
      }
    ]
  },
  plugins: [
    new CommonsChunkPlugin({
      name: 'vendors',
      chunks: chunks,
      minChunks: chunks.length
    }),
    new ExtractTextPlugin('styles/[name].css'),
    debug ? function() {} : new UglifyJsPlugin({ 
      compress: {
        warnings: false
      },
      except: ['$super', '$', 'exports', 'require']
    }),
  ]
};
