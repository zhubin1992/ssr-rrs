const express = require('express')
const fs = require('fs')
const path = require('path')
const favicon = require('serve-favicon')
const bodyParser = require('body-parser')
const serverRender = require('./util/server-render')
const webpackConfig = require('./util/config')

const isDev = process.env.NODE_ENV === 'development'
const app = express()

app.use(favicon(path.join(__dirname, '../ssr_favicon.ico')))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

if (!isDev) {
  const serverEntry = require('../dist/server-entry')
  const template = fs.readFileSync(path.join(__dirname, '../dist/server.ejs'), 'utf-8')
  // 静态资源
  app.use(`${webpackConfig.publicPath}/`, express.static(path.join(__dirname, '../dist')))
  app.get('*', (req, res, next) => {
    // const content = ReactSSR.renderToString(serverEntry)
    // res.send(template.replace('<!--app-->',content))
    serverRender(serverEntry, template, req, res).catch(next)
  })
} else {
  const devStatic = require('./util/dev-static')
  devStatic(app)
}

app.listen(webpackConfig.port, () => {
  console.log(` >>> server listen on http://localhost:${webpackConfig.port}`)
})
