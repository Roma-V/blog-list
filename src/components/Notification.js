/**
 * @file A notification component.
 * @author Roman Vasilyev
 */

import React from 'react'
import { useSelector } from 'react-redux'

import { Alert } from '@material-ui/lab'

const Notification = () => {
  const notification = useSelector(state => state.notification.content)
  const type = useSelector(state => state.notification.type)

  if (!notification) return null

  return (
    <div>
      <Alert severity={type}>
        {notification}
      </Alert>
    </div>
  )
}

export default Notification