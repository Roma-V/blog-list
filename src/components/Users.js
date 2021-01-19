/**
 * @file Users element.
 * @author Roman Vasilyev
 */

import React from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'

import {
  TableContainer,
  Table,
  TableBody,
  TableHead,
  TableCell,
  TableRow,
  Paper,
  Button
} from '@material-ui/core'

export const Users = () => {
  // Store
  const users = useSelector(state => state.users)

  return (
    <div>
      <h2>Users</h2>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>User</TableCell>
              <TableCell>blogs created</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map(user =>
              <TableRow key={user.id}>
                <TableCell>
                  <Link to={`/users/${user.id}`}>{user.username}</Link>
                </TableCell>
                <TableCell>{user.blogs.length}</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  )
}

export const UserDetails = ({ userId }) => {
  // Store
  const user = useSelector(state => state.users.find(user => user.id === userId))

  if (!user) {
    return null
  } else return (
    <div>
      <h2>{user.username}</h2>
      <h3>added {user.blogs.length} blogs</h3>
      <TableContainer component={Paper}>
        <Table>
          <TableBody>
            {user.blogs.map(blog =>
              <TableRow key={blog.id}>
                <TableCell>
                  <Link to={`/blogs/${blog.id}`}>{blog.title}</Link>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  )
}

export default Users