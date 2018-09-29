const ExtractTextWebpackPlugin = require('extract-text-webpack-plugin')
const FlowStatusWebpackPlugin = require('flow-status-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackInlineSourcePlugin = require('html-webpack-inline-source-plugin');
const path = require('path')
const webpack = require('webpack')

module.exports = {
  devtool: 'eval-source-map',
  entry: [
    'babel-polyfill',
    path.resolve(__dirname, 'index.js')
  ],
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'index_bundle.js',
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
        use: ['css-hot-loader'].concat(
          ExtractTextWebpackPlugin.extract({fallback: 'style-loader', use: [
            'css-loader',
            'sass-loader',
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
            }
          ]})
        )
      }
    ]
  },
  plugins: [
    new webpack.optimize.OccurrenceOrderPlugin(),
    new HtmlWebpackPlugin({
      inlineSource: '.(js|css)$',
      title: 'Trivia'
    }),
    new HtmlWebpackInlineSourcePlugin(),
    new FlowStatusWebpackPlugin({
      restartFlow: true
    }),
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: true,
      comments: false,
      compress: {
        //drop_console: true,
        warnings: false
      }
    })
  ]
}
