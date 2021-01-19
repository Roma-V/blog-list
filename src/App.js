/**
 * @file contains main logic for the Blog List app frontend.
 * @author Roman Vasilyev
 */

import React, { useEffect } from 'react'
import { Switch,
  Route,
  useRouteMatch,
  NavLink,
  Redirect
} from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'

import { setUser, logout } from './reducers/loginReducer.js'
import { initBlogs } from './reducers/blogReducer.js'
import { initUsers } from './reducers/usersReduser.js'

import Notification from './components/Notification.js'
import { Users, UserDetails } from './components/Users.js'
import { Blogs, BlogDetails } from './components/Blog.js'
import Login from './components/Login.js'

import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Button,
  Container,
  ThemeProvider
} from '@material-ui/core'
import { createMuiTheme } from '@material-ui/core/styles'

const theme = createMuiTheme({
  palette: {
    primary: {
      light: '#33ab9f  ',
      main: '#009688',
      dark: '#00695f',
      contrastText: '#fff',
    },
    secondary: {
      light: '#ff6333',
      main: '#ff3d00',
      dark: '#b22a00',
      contrastText: '#fff',
    },
  },
})

/*
 * Main App component
 */
const App = () => {
  const dispatch = useDispatch()

  // User login
  const loggedUser = useSelector(state => state.login)

  // Fetch blogs from API
  useEffect(() => {
    dispatch(initBlogs())
  }, [])

  // Fetch users from API
  useEffect(() => {
    dispatch(initUsers())
  }, [])

  // Store state
  const blogsLoaded = useSelector(state => state.blogs.length > 0)
  const usersLoaded = useSelector(state => state.users.length > 0)

  const userPath = useRouteMatch('/users/:id')
  const blogPath = useRouteMatch('/blogs/:id')

  // Handle login info
  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedUser')
    if (loggedUserJSON) {
      const userLogin = JSON.parse(loggedUserJSON)
      dispatch(setUser(userLogin))
    }
  }, [])

  /*
   * 3. Rendering
   */
  return (
    <ThemeProvider theme={theme}>
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" color="inherit" aria-label="menu">
          </IconButton>
          <Button color="inherit" component={NavLink} to='/' >Blogs</Button>
          <Button color="inherit" component={NavLink} to='/users' >Users</Button>
          {
            loggedUser === null
              ? ''
              : <Typography>
                {loggedUser.username} logged in
                <Button edge="end" color="inherit" type="submit" onClick={() => dispatch(logout())}>Logout</Button>
              </Typography>
          }
        </Toolbar>
      </AppBar>
      <Container>
        <Notification />
        <Switch>
          <Route path='/login'>
            {
              loggedUser === null
                ? <Login />
                : <Redirect to="/" />
            }
          </Route>
          <Route path='/users/:id'>
            {
              loggedUser && usersLoaded
                ? <UserDetails userId={userPath ? userPath.params.id: null} />
                : <Redirect to="/" />
            }
          </Route>
          <Route path='/blogs/:id'>
            {
              loggedUser && blogsLoaded
                ? <BlogDetails blogId={blogPath ? blogPath.params.id: null} />
                : <Redirect to="/" />
            }
          </Route>
          <Route path='/users'>
            {
              loggedUser && usersLoaded
                ? <Users />
                : <Redirect to="/" />
            }
          </Route>
          <Route path='/'>
            {
              loggedUser
                ? <Blogs />
                : <Redirect to="/login" />
            }
          </Route>
        </Switch>
      </Container>
    </ThemeProvider>
  )
}

/*
 * Exports
 */
export default App