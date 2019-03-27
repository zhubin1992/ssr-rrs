/*
 * @Author: zb
 * @Date: 2019-03-25 18:01:26
 * @Last Modified by: zb
 * @Last Modified time: 2019-03-27 15:30:41
 */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-mixed-spaces-and-tabs */
/* eslint-disable no-tabs */
import React, { Component } from 'react'
import PropTypes from 'prop-types'

// 这个函数，是生成高阶组件的函数
// 这个函数，返回一个组件
export default (styles) => {
  return (DecoratedComponent) => {
    // 返回的这个组件，叫做高阶组件

    return class NewComponent extends Component {
    static propTypes = {
      staticContext: PropTypes.object,
    }

    static asyncData = DecoratedComponent.asyncData

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
