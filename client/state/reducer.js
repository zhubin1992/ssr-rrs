/*
 * @Author: zb
 * @Date: 2019-03-25 18:01:37
 * @Last Modified by: zb
 * @Last Modified time: 2019-03-26 10:41:29
 */
import immutable from 'immutable'
import { combineReducers } from 'redux-immutable'
import { connectRouter } from 'connected-react-router/immutable'
import initState from '../config/clientConfig'

const initialState = () => {
  if (typeof window !== 'undefined' && window.__INITIAL__STATE__) { // eslint-disable-line
    return immutable.fromJS({...initState, ...window.__INITIAL__STATE__.mainReducer}) // eslint-disable-line
  }
  return immutable.fromJS(
    initState,
  )
}
function mainReducer(state = initialState(), action) {
  switch (action.type) {
    case 'loginSuccess': {
      const newstate = state
        .set('user', immutable.fromJS(action.user))
        .set('connect', true)
      return newstate
    }
    default:
      return state
  }
}
const rootReducer = history => combineReducers({
  router: connectRouter(history),
  mainReducer,
})

export default rootReducer
