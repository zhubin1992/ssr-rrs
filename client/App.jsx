/*
 * @Author: zb
 * @Date: 2019-03-25 18:03:08
 * @Last Modified by: zb
 * @Last Modified time: 2019-03-27 16:48:36
 */
import React, { Component } from 'react'
import { hot } from 'react-hot-loader'

// import { renderRoutes } from 'react-router-config'

import renderRoutes, { routes } from './config/router'


class App extends Component {
  constructor() {
    super()
    this.state = {
    }
  }


  render() {
    return (
      renderRoutes(routes)
    )
  }
}
export default hot(module)(App)
