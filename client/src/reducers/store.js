/**
 * @file This file provides a redux store for Blog List App.
 * @author Roman Vasilyev
 */

import { createStore, combineReducers, applyMiddleware } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import thunk from 'redux-thunk'
import loginReducer from './loginReducer.js'
import usersReduces from './usersReduser.js'
import blogReducer from './blogReducer.js'
import notificationReducer from './notificationReducer.js'

const store = createStore(
  combineReducers({
    notification: notificationReducer,
    login: loginReducer,
    users: usersReduces,
    blogs: blogReducer
  }),
  composeWithDevTools(
    applyMiddleware(thunk)
  )
)

export default store