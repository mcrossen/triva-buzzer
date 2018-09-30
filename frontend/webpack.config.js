const ExtractTextWebpackPlugin = require('extract-text-webpack-plugin')
const FlowStatusWebpackPlugin = require('flow-status-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const HtmlWebpackInlineSourcePlugin = require('html-webpack-inline-source-plugin')
const path = require('path')
const webpack = require('webpack')
const WebpackCleanPlugin = require('webpack-clean');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
  entry: [
    path.resolve(__dirname, 'index.js'),
    path.resolve(__dirname, 'styles.scss')
  ],
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'app.js',
    publicPath: '/',
  },
  resolve: {
    modules: [path.resolve(__dirname), "node_modules"],
    extensions: ['.js']
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: path.resolve(__dirname, 'node_modules'),
        use: 'babel-loader'
      },
      {
        test: /(\.scss|\.css)$/,
        use: ExtractTextWebpackPlugin.extract({fallback: 'style-loader', use: [
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              plugins: () => [
                'postcss-import',
                {loader: 'autoprefixer', options: { add: false, browsers: [] }},
                'postcss-next',
                'cssnano'
              ]
            }
          },
          {
            loader: 'sass-loader',
            options: {
              includePaths: ['./node_modules'],
            }
          },
        ]})
      }
    ]
  },
  plugins: [
    new ExtractTextWebpackPlugin('app.css'),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new HtmlWebpackPlugin({
      inlineSource: '.(js|css)$',
      template: 'index.html'
    }),
    new HtmlWebpackPlugin({
      filename: 'scoreboard.html',
      inlineSource: '.(js|css)$',
      template: 'scoreboard.html'
    }),
    new HtmlWebpackInlineSourcePlugin(),
    new FlowStatusWebpackPlugin({
      restartFlow: true
    }),
    new WebpackCleanPlugin([
      'app.css',
      'app.js'
    ], {basePath: path.join(__dirname, 'dist')})
  ]
}
