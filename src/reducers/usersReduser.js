/**
 * @file Redux reducer that stores blogs and manages their lifecycle.
 * @author Roman Vasilyev
 */

import usersServices from '../services/users.js'

const reducer = (state = [], action) => {
  switch(action.type) {
  case 'users/INIT':
    return action.data
  default:
    return state
  }
}

export const initUsers = () => {
  return async dispatch => {
    const users = await usersServices.getAll()

    dispatch({
      type: 'users/INIT',
      data: users
    })
  }
}

export default reducer