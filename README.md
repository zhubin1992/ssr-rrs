# ssr-rrs   <img style="float:right" src="./ssr_favicon.ico"> 
ssr-rrs是一个使用react,rudex,express,css-in-js搭建的服务端渲染骨架

### 项目由来
也是因为之前搭建的那个服务端渲染项目，由于react新版本的问题，导致其中一些插件不能正常使用（如<a target='_blank' href="https://github.com/ctrlplusb/react-tree-walker">react-tree-walker</a>），所以想重新搭建一个，也是重头梳理一遍服务端渲染流程，巩固一下知识点。

### 技术栈
react^16.6 + express + react-router4.x + redux + redux-sage(redux-thunk) + immutable

### 从最简单的服务端开始
```
...
const context = {}
  const frontComponents = renderToString(
    <StaticRouter
      location={req.url}
      context={context}>
      {Routers}
    </StaticRouter>
  )
...
  const html = `
    <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta http-equiv="X-UA-Compatible" content="ie=edge">
      <link rel="stylesheet" type="text/css" href="${cssLink}">
      <title></title>
  </head>
  <body>
      <div id="root">${frontComponents}</div>
  </body>
  <script src="${jsLink}"></script>
  </html>
    `
  res.send(html)
```
简单说就是把打包后的js和css文件用<a target='_blank' href="https://github.com/ztoben/assets-webpack-plugin">assets-webpack-plugin</a>等类似工具获取到，并用ReactDOMServer.renderToString把对应组件生成html，服务端路由使用StaticRouter静态路由，重定向问题用context.url做判断。当然只是做首页服务端渲染肯定是不够用的。

### 优化seo

服务端渲染的优点之一就是seo效果好，能让搜索引擎找的到单页spa应用里面的子页面，如何找到最简单的就是加title、meta等
```
// component.jsx
    
    render(){
        <div>
            <Helmet>
                <title>index</title>
            </Helmet>
        ...
        </div>
    }
```
在页面路由级组件内加入helmet插件，用来给每个路由的页面添加title和meta
```
// 服务端server-render.js

    const content = ReactDomServer.renderToString(app)
    const html = ejs.render(template, {
        appString: content,
        initialState: serialize(state),
        meta: helmet.meta.toString(),
        title: helmet.title.toString(),
        style: `<style>${cssStr}</style>`,
        link: helmet.link.toString()
    })
    res.send(html)
```
用ejs模板来生成具体html页面。接下来既然要做每页的渲染，样式肯定不能直接导入。

### 利用css-in-js做每页渲染

上一个ssr项目是用<a href='https://material-ui.com/' target='_blank'>material-ui</a>作为样式组件库导入的，它支持服务端渲染并提供了详细的使用流程。而在这个项目我并不打算用它，想用自己写的组件，而且可以用less，找了很多方法用css-in-js能较好的解决需求。
首先在每个页面组件里添加一个高阶函数，这个函数用来把页面需要渲染的样式用_getCss处理后传入到静态路由提供的context里面，然后在服务端渲染的时候再把样式取出来用上面用到的模板添加上去。
```
// 客户端
export default (styles) => {
  return (DecoratedComponent) => {
    return class NewComponent extends Component {
    static propTypes = {
      staticContext: PropTypes.object,
    }

    static asyncData = DecoratedComponent.asyncData // 后面数据预取所需要的

    componentWillMount() {
      if (this.props.staticContext) {
        this.props.staticContext.css.push(styles._getCss());
      }
    }

    render() {
      return <DecoratedComponent {...this.props} />
    }
    }
  }
}

// 服务端erver-render.js
const cssStr = context.css.length ? context.css.join('\n') : ''
```
但其实做这之前有个前提就是需要在服务端获得每个页面组件的数据，这也是后面数据预取的重要条件。

### 数据预取

页面组件上添加静态方法，用来获取数据。因为要返回一个promise，用redux-thunk的话比较方便，redux-saga的话需要用到runSaga方法
```
static asyncData(store) {
    const saga = loginToken
    // redux-thunk 
    // return store.dispatch(action.loginToken())
    return runSaga({
      dispatch: res => store.dispatch(res),
    }, saga, { token: '' }).done.catch(err => console.log(err))
  }
```

把接着路由修改成数组形式
```
const routes = [
  {
    path: '/index',
    component: Main,
    exact: true,
    key: 'index',
  },
  {
    path: '/newcode',
    component: NewCode,
    exact: true,
    key: 'newcode',
  },
]
```
改成这种形式的目的是为了用react-router-config中的matchRoutes匹配路由，并执行路由组件的静态方法
```
    const branch = matchRoutes(routes, req.path)
    const promises = branch.map(({ route }) => {
      const fetch = route.component ? route.component.asyncData : null
      return fetch instanceof Function ? fetch(store) : Promise.resolve(null)
    })
```
（在构建项目的过程中正好赶上了react-router不小心发布5.0，导致react-router-config@5.0和react-router@4.x版本不兼容renderRoutes方法有问题，因此当时在这个项目中手写了renderRoutes，实际上用react-router-config@1.0.0-beta.4的方法不会出现问题）

把promise全部执行完后，再进行renderToString，并把数据和优化seo那步一样写入到模板ejs上
```
<script>
  window.__INITIAL__STATE__ = <%%- initialState %>
</script>
```
然后在redux上根据window对象判断是否是服务端来获取初始化数据
```
const initialState = () => {
  if (typeof window !== 'undefined' && window.__INITIAL__STATE__) {
    return immutable.fromJS({...initState, ...window.__INITIAL__STATE__})
  }
  return immutable.fromJS(
    initState,
  )
}
```
### 开发时编译

开发客户端时用webpack-dev-server即可，开发服务端时需要先把客户端的代码用webpack编译后再启动服务端，所以每次改变客户端代码就需要重新打包一遍，再启动服务端过于麻烦。使用 memory-fs 替换默认的 outputFileSystem，以将文件写入到内存中，再通过包装成函数字符串，在vm中运行(就是实现 require() 的工作机制)，得到server入口文件。此时就可以和生产时代码一样启动服务端。
```
// module.js的_compile部分代码

var self = this;
...
function require(path) {
  return self.require(path);
}
...
var wrapper = Module.wrap(content);
...
var compiledWrapper = runInThisContext(wrapper, { filename: filename });
...
var args = [self.exports, require, self, filename, dirname];
return compiledWrapper.apply(self.exports, args);
```


