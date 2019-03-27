/*
 * @Author: zb
 * @Date: 2019-03-25 18:03:03
 * @Last Modified by: zb
 * @Last Modified time: 2019-03-27 16:16:09
 */
import React from 'react'
import ReactDom from 'react-dom'
import { Provider } from 'react-redux'
import { AppContainer } from 'react-hot-loader'
import { ConnectedRouter } from 'connected-react-router/immutable'
import store, { history } from '@state/store'
import App from './App.jsx'
import './app.css'

const root = document.getElementById('root')

const Render = (Component) => {
  const renderMethod = module.hot ? ReactDom.render : ReactDom.hydrate
  renderMethod(
    <AppContainer>
      <Provider store={store()}>
        <ConnectedRouter history={history}>
          <Component />
        </ConnectedRouter>
      </Provider>
    </AppContainer>,
    root,
  )
}
Render(App)
