/**
 * @file Redux reducer that stores notification.
 * @author Roman Vasilyev
 */

const hiddenState = {
  content: null,
  type: null
}

const reducer = (state = hiddenState, action) => {
  switch(action.type) {
  case 'SHOW':
    return action.data
  case 'HIDE':
    return hiddenState
  default:
    return state
  }
}

/*
 * Actions
 */
const setNotification = (content, type) => {
  return dispatch => {
    dispatch({
      type: 'SHOW',
      data: {
        content,
        type
      }
    })
  }
}

const hideNotification = () => {
  return dispatch => {
    dispatch({
      type: 'HIDE'
    })
  }
}

export const notify = (message, type, duration=3000) => {
  return dispatch => {
    dispatch(setNotification(message, type))

    setTimeout(() => {
      dispatch(hideNotification())
    }, duration)
  }
}

export default reducer