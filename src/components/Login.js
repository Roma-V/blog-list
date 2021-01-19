/**
 * @file Login form element.
 * @author Roman Vasilyev
 */

import React, { useState } from 'react'
import { useDispatch } from 'react-redux'

import { login } from '../reducers/loginReducer.js'

import {
  TextField,
  Button
} from '@material-ui/core'

const Login = () => {
  const dispatch = useDispatch()

  // Login the user upon submitting credentials
  const handleLogin = async (event) => {
    event.preventDefault()
    const username = event.target[0].value
    const password = event.target[1].value

    dispatch(login({ username, password }))
  }

  return (
    <div>
      <h2>Log in to application</h2>
      <form onSubmit={handleLogin}>
        <div>
          <TextField label='username' />
        </div>
        <div>
          <TextField label='password' type='password' />
        </div>
        <Button variant="contained" color="primary" type="submit">login</Button>
      </form>
    </div>
  )
}

export default Login