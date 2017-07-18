const config = require('../config')
const path = require('path')
const webpack = require('webpack')
const OptimizeJsPlugin = require('optimize-js-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const ProgressBarPlugin = require('progress-bar-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = {
  entry: path.join(config.root, config.src.indexJS),
  output: {
    path: path.join(config.root, config.dist.root),
    filename: config.dist.name + '.js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      },
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          use: 'css-loader'
        })
      },
      {
        test: /\.scss$/,
        use: ExtractTextPlugin.extract({
          use: [
            {
              loader: 'css-loader'
            },
            {
              loader: 'postcss-loader'
            },
            {
              loader: 'sass-loader'
            }
          ]
        })
      },
      {
        test: /\.(eot|woff|woff2|ttf)$/,
        loader: 'url-loader',
        query: {
          limit: 1, // Copy fonts instead of inserting them on the css
          name: './fonts/[name].[ext]'
        }
      },
      {
        test: /\.html$/,
        loader: 'html-loader'
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        query: {
          limit: 10000,
          name: path.join(config.root, path.join(config.src.assets, '[name].[ext]'))
        }
      }
    ]
  },
  plugins: [
    new CopyWebpackPlugin([
      {
        context: config.root,
        from: config.src.manifest,
        to: path.join(config.root, config.dist.root)
      }
    ]),
    new CopyWebpackPlugin([
      {
        context: path.join(config.root, config.src.assets),
        from: '**/*',
        to: path.join(config.root, path.join(config.dist.root, config.src.assets))
      }
    ]),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: config.src.indexHTML,
      inject: true,
      minify: {
        caseSensitive: true,
        collapseBooleanAttributes: true,
        collapseWhitespace: true,
        minifyCSS: true,
        minifyJS: true,
        preventAttributesEscaping: true,
        removeAttributeQuotes: true,
        removeComments: true,
        removeCommentsFromCDATA: true,
        removeEmptyAttributes: true,
        removeOptionalTags: true,
        removeRedundantAttributes: true,
        removeScriptTypeAttributes: true,
        removeStyleLinkTypeAttributes: true
      },
      chunksSortMode: 'dependency'
    }),
    new OptimizeCssAssetsPlugin(),
    new ExtractTextPlugin(config.dist.name + '.css'),
    new webpack.optimize.UglifyJsPlugin(),
    new OptimizeJsPlugin({
      sourceMap: false
    }),
    new ProgressBarPlugin()
  ]
}