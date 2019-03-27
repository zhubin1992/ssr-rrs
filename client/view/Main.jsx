/* eslint-disable no-empty-pattern */
/*
 * @Author: zb
 * @Date: 2019-03-25 18:02:13
 * @Last Modified by: zb
 * @Last Modified time: 2019-03-27 23:36:13
 */
import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { runSaga } from 'redux-saga'
import { Link, withRouter } from 'react-router-dom'
import Helmet from 'react-helmet'
import withStyles from '@client/config/withStyle'
import action from '@state/action'
import { loginToken } from '../state/sagas'
import styles from './Main.less'

// @withRouter
@withStyles(styles)
class Main extends Component {
  static propTypes = {
    user: PropTypes.object,
    connect: PropTypes.bool,
    fetchToken: PropTypes.func,
  };

  static asyncData(store) {
    const saga = loginToken
    // redux-thunk ****为Cnode社区的个人token字符串
    // return store.dispatch(action.loginToken('*********************'))
    return runSaga({
      dispatch: res => store.dispatch(res),
    }, saga, { token: '*******************' }).done.catch(err => console.log(err))
  }

  constructor(props) {
    super(props)
    this.state = {
    }
  }

  componentWillMount() {
    // console.log('props', this.props)
  }

  componentDidMount() {
    if (!this.props.user.get('id')) this.props.fetchToken('af93d65b-bdc0-45a7-af8f-7cc3d021b1c7')
  }


  render() {
    const {
    } = this.state
    return (
      <div className={styles.box}>
        <Helmet>
          <title>ssr-react-redux-immutable index</title>
        </Helmet>
        <div className={styles.blur} />
        <div className={styles.content}>
          <div><Link to="/newcode">newcode</Link></div>
          <Link to="/newcodeLive">newcodeLive</Link>
          <div>
              id:{this.props.user.get('id')} {this.props.connect}
          </div>
        </div>
      </div>
    )
  }
}
export default connect(state => ({
  user: state.getIn(['mainReducer', 'user']),
  connect: state.getIn(['mainReducer', 'connect']),
  backgroundImg: state.getIn(['mainReducer', 'backgroundImg']),
}),
dispatch => ({
  fetchUsers: user => dispatch(action.login(user)),
  fetchToken: token => dispatch(action.loginToken(token)),
  dispatch,
}))(Main)
