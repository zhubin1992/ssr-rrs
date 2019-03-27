/* eslint-disable jsx-a11y/alt-text */
/*
 * @Author: zb
 * @Date: 2019-03-25 18:02:55
 * @Last Modified by: zb
 * @Last Modified time: 2019-03-27 23:37:00
 */
import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import withStyles from '@client/config/withStyle'
import action from '@state/action'
import Helmet from 'react-helmet'
import { runSaga } from 'redux-saga'
import { Link } from 'react-router-dom'
import { getUserImg } from '../state/sagas'
import styles from './newCode.less'

@withStyles(styles)
class NewCode extends Component {
    static propTypes = {
      user: PropTypes.object,
      getUserImg: PropTypes.func,
    };

    static asyncData(store) {
      const saga = getUserImg
      // redux-thunk
      // return store.dispatch(action.loginToken('af93d65b-bdc0-45a7-af8f-7cc3d021b1c7'))
      return runSaga({
        dispatch: res => store.dispatch(res),
      }, saga, {}).done
    }

    constructor(props) {
      super(props)
      this.state = {
      }
    }

    componentDidMount() {
      if (!this.props.user.get('avatar')) this.props.getUserImg('af93d65b-bdc0-45a7-af8f-7cc3d021b1c7')
    }


    render() {
      return (
        <div className={styles.box}>
          <Helmet>
            <title>newCode</title>
          </Helmet>
          <div className={styles.blur} />
          <img className={styles.img} src={this.props.user.get('avatar')} />
          <Link to="/index">index</Link>
        </div>
      )
    }
}
export default connect(state => ({
  user: state.getIn(['mainReducer', 'user']),
  connect: state.getIn(['mainReducer', 'connect']),
}),
dispatch => ({
  fetchUsers: user => dispatch(action.login(user)),
  fetchToken: token => dispatch(action.loginToken(token)),
  getUserImg: () => dispatch(action.getUserImg()),
}))(NewCode)
