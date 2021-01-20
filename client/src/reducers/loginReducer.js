/**
 * @file Redux reducer that stores information about logged in user.
 * @author Roman Vasilyev
 */

import loginService from '../services/login.js'
import blogService from '../services/blogs.js'

import { notify } from './notificationReducer.js'

const reducer = (state = null, action) => {
  switch(action.type) {
  case 'user/LOGIN':
    return action.data
  case 'user/LOGOUT':
    return null
  default:
    return state
  }
}

export const login = (credentials) => {
  return async dispatch => {
    const userLogin = await loginService.login(credentials)
    if (!userLogin) {
      dispatch(notify('Wrong credentials', 'error'))
      return
    }

    dispatch(setUser(userLogin))
  }
}

export const setUser = (userLogin) => {
  return async dispatch => {
    window.localStorage.setItem(
      'loggedUser', JSON.stringify(userLogin)
    )

    dispatch({
      type: 'user/LOGIN',
      data: userLogin
    })

    blogService.setToken(userLogin.token)
  }
}

export const logout = () => {
  return async dispatch => {
    window.localStorage.removeItem('loggedUser')

    dispatch({
      type: 'user/LOGOUT'
    })

    dispatch(notify('User logged out', 'success'))
  }
}

export default reducer