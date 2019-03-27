const ReactDomServer = require('react-dom/server')
const serialize = require('serialize-javascript')
const { matchRoutes } = require('react-router-config')
const ejs = require('ejs')
const Helmet = require('react-helmet').default
const immutable = require('immutable')

module.exports = (bundle, template, req, res) => {
  return new Promise((resolve, reject) => {
    const createStoreMap = bundle.store
    // const history = bundle.history
    const createApp = bundle.default
    const routes = bundle.routes
    const routerContext = { css: [] }
    // 获取initstore
    const initData = immutable.fromJS({})
    const store = createStoreMap(initData)
    // 匹配路由，执行路由组件静态方法asyncData
    const branch = matchRoutes(routes, req.path)
    const promises = branch.map(({ route }) => {
      const fetch = route.component ? route.component.asyncData : null
      return fetch instanceof Function ? fetch(store) : Promise.resolve(null)
    })
    Promise.all(promises).then(data => {
      // const initStateString = JSON.stringify(store.getState())
      const app = createApp(store, routerContext, req.url)
      const content = ReactDomServer.renderToString(app)
      const cssStr = routerContext.css.length ? routerContext.css.join('\n') : ''
      if (routerContext.url) {
        res.status(302).setHeader('Location', routerContext.url)
        res.end()
        return
      }
      const helmet = Helmet.rewind()
      const state = store.getState()
      // res.send(template.replace('<!--app-->',content))
      const html = ejs.render(template, {
        appString: content,
        initialState: serialize(state),
        meta: helmet.meta.toString(),
        title: helmet.title.toString(),
        style: `<style>${cssStr}</style>`,
        link: helmet.link.toString()
      })
      res.send(html)
      resolve()
    }).catch((err) => {
      res.status(500).send(err && err.message)
    })
  })
}
