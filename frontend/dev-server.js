// @flow
import express from 'express'
import webpack from 'webpack'
import webpackMiddleware from 'webpack-dev-middleware'
import config from './webpack.config.js'
import path from 'path'

export const serverPort: number = 8080
const app = express()
const webpackConfigCompiler = webpack(config)

app.use(webpackMiddleware(webpackConfigCompiler, {
  noInfo: true,
  publicPath: config.output.publicPath
}))

app.listen(serverPort, (err) => {
  if (err) return console.log('Server failed to start.', err)
  else return console.log(`Server started. Listening on port ${serverPort}`)
})
