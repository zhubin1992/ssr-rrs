/*
 * @Author: zb
 * @Date: 2019-03-25 18:28:47
 * @Last Modified by:   zb
 * @Last Modified time: 2019-03-25 18:28:47
 */
import React from 'react'
import { StaticRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import store, { history } from '@state/store'
import App from './App.jsx'
import { routes } from './config/router'

export default (initstore, routerContext, url) => (
  <Provider store={initstore}>
    <StaticRouter context={routerContext} location={url}>
      <App history={history} />
    </StaticRouter>
  </Provider>
)

export { store, history, routes }
