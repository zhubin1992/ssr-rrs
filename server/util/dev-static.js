const axios = require('axios')
const path = require('path')
const webpack = require('webpack')
const MemoryFS = require('memory-fs')
const proxy = require('http-proxy-middleware')
const serverRender = require('./server-render')
const serverConfig = require('../../build/webpack.config.server')
const webpackConfig = require('./config')

const getTemplate = () => {
  return new Promise((resolve, reject) => {
    axios.get('http://localhost:8888/public/server.ejs')
      .then((res) => {
        resolve(res.data)
      }).catch(reject)
  })
}
const NativeModule = require('module')
const vm = require('vm')

const getModuleFromString = (bundle, filename) => {
  const m = { exports: {} }
  const wrapper = NativeModule.wrap(bundle) // 包装成函数字符串
  const script = new vm.Script(wrapper, {
    filename,
    displayErrors: true
  })
  const result = script.runInThisContext() // 在虚拟机中运行
  result.call(m.exports, m.exports, require, m)
  return m
}
const mfs = new MemoryFS()
// const Module = module.constructor
let serverBundle
serverConfig.mode = 'development'
const serverCompiler = webpack(serverConfig)
serverCompiler.outputFileSystem = mfs
serverCompiler.watch({}, (err, state) => {
  if (err) throw err
  state = state.toJson()
  state.errors.forEach(error => console.error(error))
  state.warnings.forEach(warn => console.warn(warn))

  const bundlePath = path.join(
    serverConfig.output.path,
    serverConfig.output.filename
  )
  const bundle = mfs.readFileSync(bundlePath, 'utf-8')
  const m = getModuleFromString(bundle, 'server-entry.js')
  serverBundle = m.exports
})

module.exports = function (app) {
  app.use(webpackConfig.publicPath, proxy({
    target: 'http://localhost:8888'
  }))
  app.use(webpackConfig.publicPathDev, proxy({
    target: 'http://localhost:8888'
  }))
  app.get('*', (req, res, next) => {
    if (!serverBundle) {
      return res.send('waiting...')
    }
    getTemplate().then((template) => {
      return serverRender(serverBundle, template, req, res)
    }).catch(next)
  })
}
