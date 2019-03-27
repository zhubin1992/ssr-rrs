/*
 * @Author: zb
 * @Date: 2019-03-25 18:01:58
 * @Last Modified by: zb
 * @Last Modified time: 2019-03-26 23:43:15
 */
import { applyMiddleware, compose, createStore } from 'redux'
import createSagaMiddleware from 'redux-saga'
// import thunk from 'redux-thunk';
import { createBrowserHistory, createMemoryHistory } from 'history'
import { routerMiddleware } from 'connected-react-router/immutable'
import rootReducer from './reducer'
import rootSaga from './sagas'

const history = typeof window !== 'undefined' ? createBrowserHistory() : createMemoryHistory()
const sagaMiddleware = createSagaMiddleware()

const store = (init = undefined) => {
  const newstate = createStore(
    rootReducer(history),
    init,
    compose(
      applyMiddleware(
        routerMiddleware(history), // for dispatching history actions
        // ... other middlewares ...
        sagaMiddleware,
        // thunk,
      ),
    ),
    // typeof window !== 'undefined' && window.__REDUX_DEVTOOLS_EXTENSION__
    // && window.__REDUX_DEVTOOLS_EXTENSION__(),
  )
  sagaMiddleware.run(rootSaga)
  // console.log('store')
  return newstate
}


export { history }
export default store;
