/*
 * @Author: zb
 * @Date: 2019-03-25 18:01:52
 * @Last Modified by: zb
 * @Last Modified time: 2019-03-27 23:16:39
 */
import { delay } from 'redux-saga'
import {
  call, put, takeEvery, all,
} from 'redux-saga/effects'
import { post } from '../config/http'

const getRandomAvatar = require('../../server/util/getRandomAvatar')
// import fetch from '../config/fetch'

function* login(action) {
  // 原本用于socket
  // yield delay(1000)
  // const [res, err] = yield call(fetch, 'login', action.user)
  // if (!err) {
  //   yield put({
  //     type: 'loginSuccess',
  //     user: {
  //       id: res.id,
  //       name: res.name,
  //     },
  //   })
  //   console.log('success:', res)
  // } else {
  //   console.log('err:', err)
  // }
}
function* loginToken(action) {
  const res = yield call(post, '/accesstoken', { accesstoken: action.token })
  if (res.success) {
    yield put({
      type: 'loginSuccess',
      user: {
        id: res.id,
        name: res.loginname,
      },
    })
  }
}

function* getUserImg() {
  yield delay(1000)
  const res = getRandomAvatar()
  yield put({
    type: 'loginSuccess',
    user: {
      avatar: res,
    },
  })
}


function* watchLogin() {
  yield takeEvery('login', login)
}
function* WatchLoginToken() {
  yield takeEvery('loginToken', loginToken)
}
function* WatchGetUserImg() {
  yield takeEvery('getUserImg', getUserImg)
}

export { login, loginToken, getUserImg }
// notice how we now only export the rootSaga
// single entry point to start all Sagas at once
export default function* rootSaga() {
  yield all([
    watchLogin(),
    WatchLoginToken(),
    WatchGetUserImg(),
  ])
}
