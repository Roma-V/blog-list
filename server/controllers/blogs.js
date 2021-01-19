/**
 * @license
 * Copyright (c) 2020 Example Corporation Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

/**
 * @file implements express router for blogs.
 * @author Roman Vasilyev
 */

const jwt = require('jsonwebtoken')
const blogsRouter = require('express').Router()
const Blog = require('../models/blog.js')
const User = require('../models/user.js')
const logger = require('../utils/logger.js')

const userSchema = { username: 1, name: 1 }

/*
 * User verification
 */
const verifyToken = token => {
  const decodedToken = jwt.verify(token, process.env.LOGIN_TOKENIZER)
  if (!token || !decodedToken.id) {
    const error = Error()
    error.name = 'JsonWebTokenError'
    throw error
  }

  return decodedToken.id
}

/*
 * GET
 */
blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog
    .find({})
    .populate('user', userSchema)

  response.json(blogs)
})

blogsRouter.get('/:id', async (request, response) => {
  const blog = await Blog
    .findById(request.params.id)
    .populate('user', userSchema)

  if (blog) {
    response.json(blog)
  } else {
    response.status(404).end()
  }
})

/*
 * PUT a blog
 */
blogsRouter.put('/:id', async (request, response) => {
  verifyToken(request.token)

  const updatedRecord = await Blog.findByIdAndUpdate(request.params.id,
    request.body,
    {
      new: true,
      runValidators: true,
      context: 'query'
    })

  response.json(updatedRecord)
})

/*
 * PUT a comment
 */
blogsRouter.put('/:id/comments', async (request, response) => {
  const userId = verifyToken(request.token)

  const commentText = request.body.comment
  if (!commentText)
    response.status(400)

  const comment = {
    author: userId,
    content: commentText
  }

  const updatedRecord = await Blog.findByIdAndUpdate(request.params.id,
    { $push: { comments: comment } },
    {
      new: true,
      runValidators: true,
      context: 'query'
    })

  response.json(updatedRecord)
})

/*
 * POST
 */
blogsRouter.post('/', async (request, response) => {
  const userId = verifyToken(request.token)
  const user = await User.findById(userId)

  const blog = new Blog({ user: user._id, ...request.body })
  const savedBlog = await blog.save()

  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  response.status(201).json(savedBlog)
})

/*
 * DELETE
 */
blogsRouter.delete('/:id', async (request, response) => {
  const userId = verifyToken(request.token)

  const success = await Blog.findOneAndRemove({ _id: request.params.id, user: userId })

  if (success) response.status(204)
  else response.status(403)

  response.end()
})

module.exports = blogsRouter