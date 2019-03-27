/*
 * @Author: zb
 * @Date: 2019-03-25 18:01:20
 * @Last Modified by: zb
 * @Last Modified time: 2019-03-27 14:46:53
 */
import React from 'react'
import {
  Redirect,
  Route,
  Switch,
} from 'react-router-dom'
// import loadable from '@loadable/component'
import Main from '../view/main'
import NewCode from '../view/newCode'
// 异步加载，设置打包后文件名
// const Main = loadable(() => import(/* webpackChunkName: "Main" */ '../view/Main'))
// const NewCode = loadable(() => import(/* webpackChunkName: "newCode" */ '../view/newCode')) // 异步加载，设置打包后文件名
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
  {
    path: '/newcodeLive',
    component: NewCode,
    exact: true,
    key: 'newcodeLive',
  },
  {
    // path: '/',
    render: () => <Redirect to="/index" />,
    component: Main,
    // exact: true,
    key: 'first',
  },
]
function renderRoutes(routelist, extraProps = {}, switchProps = {}) {
  return routelist ? (
    <Switch {...switchProps}>
      {routelist.map((route, i) => (
        <Route
          key={route.key || i}
          path={route.path}
          exact={route.exact}
          strict={route.strict}
          render={props => (route.render ? (
            route.render({ ...props, ...extraProps, route })
          ) : (
            <route.component {...props} {...extraProps} route={route} />
          ))
          }
        />
      ))}
    </Switch>
  ) : null;
}
export { routes }

export default renderRoutes
