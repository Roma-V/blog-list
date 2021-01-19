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
 * @file contains helper functions to test blogs database api.
 * @author Roman Vasilyev
 */

const Blog = require('../models/blog.js')
const User = require('../models/user.js')


/*
 * User entries definition
 */
const initialUsers = [
  {
    username: 'j.montanha',
    name: 'Joseph Montestew',
    password: 'df72jf73nc'
  },
  {
    username: 'kormac',
    name: 'Korin Mac',
    password: '8fjenn38fn'
  }
]

/*
 * Blog entries definition
 */
const initialBlogs = [
  {
    title: 'Fisrt post',
    author: 'Roma',
    url: 'https://github.com',
    likes: 2
  },
  {
    title: 'Second post',
    author: 'Roma',
    url: 'https://Google.com',
    likes: 5
  },
]

const anotherBlog = {
  title: 'Third post',
  author: 'Jason',
  url: 'https://yahoo.com',
  likes: 7
}

const nonExistingId = async () => {
  const blog = new Blog({
    title: 'Fourth post',
    author: 'Henry',
    url: 'https://henry.com',
    likes: 4
  })

  await blog.save()
  await blog.remove()

  return blog.id.toString()
}

const blogsInDb = async () => {
  const notes = await Blog.find({})
  return notes.map(blog => blog.toJSON())
}

const anotherUser = {
  username: 'Penny',
  name: 'Penny Jackson',
  password: '9dnnv245ncv'
}

const invalidUsers = [
  {
    username: 'Mo',
    name: 'Mo Pavlov',
    password: '9dnnv245ncv'
  },
  {
    username: 'steamboat',
    name: 'Bobby Steemson',
    password: 'v3'
  }
]

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(user => user.toJSON())
}

module.exports = {
  initialBlogs,
  anotherBlog,
  nonExistingId,
  blogsInDb,
  initialUsers,
  anotherUser,
  invalidUsers,
  usersInDb
}