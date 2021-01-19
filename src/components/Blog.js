/**
 * @file Blog element.
 * @author Roman Vasilyev
 */

import React, { useState } from 'react'
import { Link,  Redirect } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'

import { createBlog, likeBlog, addComment, deleteBlog } from '../reducers/blogReducer.js'

import Togglable from './Togglable.js'

import {
  TableContainer,
  Table,
  TableBody,
  TableCell,
  TableRow,
  TextField,
  Paper,
  Button
} from '@material-ui/core'

export const Blogs = () => {
  // Store
  const blogs = useSelector(state => state.blogs)

  // Handle visibility
  const newBlogFormRef = React.createRef()

  return (
    <div>
      <h2>Blogs</h2>
      <Togglable
        buttonLabel1='new blog'
        buttonLabel2='cancel'
        ref={newBlogFormRef}>
        <NewBlog visibilityHandle={() => newBlogFormRef.current.toggleVisibility()}/>
      </Togglable>
      <div>The blog posts in database:</div>
      <TableContainer component={Paper}>
        <Table>
          <TableBody>
            {blogs.map(blog =>
              <TableRow key={blog.id}>
                <TableCell><Link to={`/blogs/${blog.id}`}>{blog.title}</Link></TableCell>
                <TableCell>{blog.author}</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  )
}

export const BlogDetails = ({ blogId }) => {
  const dispatch = useDispatch()

  const blog = useSelector(state => state.blogs.find(blog => blog.id === blogId))

  const deleteHandler = (event) => {
    event.preventDefault()

    dispatch(deleteBlog(blog))
  }

  const commentHandler = (event) => {
    event.preventDefault()
    const comment = event.target[0].value

    dispatch(addComment(blogId, comment))

    event.target[0].value = ''
  }

  if (!blog) return <Redirect to="/" />

  return (
    <div>
      <h2>{blog.title}</h2>
      <TableContainer component={Paper}>
        <Table>
          <TableBody>
            <TableRow key='url'>
              <TableCell>URL</TableCell>
              <TableCell>
                <a href={blog.url} target='_blank' rel='noreferrer'>{blog.url}</a>
              </TableCell>
            </TableRow>
            <TableRow key='likes'>
              <TableCell>Likes</TableCell>
              <TableCell align='left'>
                {blog.likes}
              </TableCell>
              <TableCell align='right'>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => dispatch(likeBlog(blog))}
                >
                  like
                </Button>
              </TableCell>
            </TableRow>
            <TableRow key='author'>
              <TableCell>Author</TableCell>
              <TableCell>
                {blog.user.username}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
      <Button
        variant="contained"
        color="secondary"
        onClick={deleteHandler}
      >
        remove
      </Button>
      <h3>Comments</h3>
      <form onSubmit={commentHandler}>
        <TextField label="comment" />
        <Button variant="contained" color="primary" type="submit">add comment</Button>
      </form>
      <TableContainer component={Paper}>
        <Table>
          <TableBody>
            {blog.comments.map(comment =>
              <TableRow key={comment.id}>
                <TableCell>{comment.content}</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  )
}

const NewBlog = ({ visibilityHandle }) => {
  const dispatch = useDispatch()

  // New blog form inputs
  const [newTitle, setNewTitle] = useState('')
  const [newAuthor, setNewAuthor] = useState('')
  const [newUrl, setNewUrl] = useState('')

  // Handle submition of a new blog
  const addBlogHandler = (event) => {
    event.preventDefault()
    const newBlog = {
      title: newTitle,
      author: newAuthor,
      url: newUrl
    }

    dispatch(createBlog(newBlog))

    setNewTitle('')
    setNewAuthor('')
    setNewUrl('')

    // Switch visibility
    visibilityHandle()
  }

  return (
    <div>
      <form onSubmit={addBlogHandler}>
        <div>
          <TextField
            label='Title'
            fullWidth={true}
            value={newTitle}
            onChange={({ target }) => setNewTitle(target.value)}
          />
        </div>
        <div>
          <TextField label='Author'
            fullWidth={true}
            value={newAuthor}
            onChange={({ target }) => setNewAuthor(target.value)}
          />
        </div>
        <div>
          <TextField label='URL'
            fullWidth={true}
            value={newUrl}
            onChange={({ target }) => setNewUrl(target.value)}
          />
        </div>
        <Button variant="contained" color="primary" type="submit">create</Button>
      </form>
    </div>
  )
}

export default Blogs