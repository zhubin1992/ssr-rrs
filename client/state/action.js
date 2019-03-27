/*
 * @Author: zb
 * @Date: 2019-03-25 18:01:33
 * @Last Modified by: zb
 * @Last Modified time: 2019-03-27 23:06:52
 */
// import store from './store'
import { post } from '../config/http'

// const { dispatch } = store()

function login(user) {
  return {
    type: 'login',
    user,
  }
}
function loginSuccess(user) {
  return {
    type: 'loginSuccess',
    user,
  }
}
function getUserImg() {
  return {
    type: 'getUserImg',
  }
}
// redux-thunk

// function loginToken(token) {
//   return dispatch => post('/accesstoken', { accesstoken: token }).then((res) => {
//     // console.log(res)
//     dispatch(loginSuccess(
//       {
//         id: res.id,
//         name: res.loginname,
//       },
//     ))
//   })
// }

// redux-saga

function loginToken(token) {
  return {
    type: 'loginToken',
    token,
  }
}


export default {
  login,
  loginToken,
  loginSuccess,
  getUserImg,
}
