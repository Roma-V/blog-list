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
 * @file contains test cases for blogs database api.
 * @author Roman Vasilyev
 */

// Imports
const testHelper = require('../utils/api_test_helper.js')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app.js')
const User = require('../models/user.js')
const Blog = require('../models/blog.js')

// The test app
const api = supertest(app)

/*
 * Helper function to get a token for user
 */
const tokenFor = async (user) => {
  const login = await api
    .post('/api/login')
    .send(user)

  return login.body.token
}

/*
 * Setup a function to run before each test
 */
beforeEach(async () => {
  await User.deleteMany({})
  await Blog.deleteMany({})

  for (const user of testHelper.initialUsers) {
    // Create users
    await api
      .post('/api/users')
      .send(user)

    const userRecord = await User
      .findOne({ username: user.username })

    // Save blogs
    for (const blog of testHelper.initialBlogs) {
      const blogRecord = new Blog({ user: userRecord._id, ...blog })
      const savedBlog = await blogRecord.save()

      userRecord.blogs = userRecord.blogs.concat(savedBlog._id)
      await userRecord.save()
    }
  }
})

/*
 * GET
 */
describe('When database has initial records,', () => {
  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs')

    expect(response.body).toHaveLength(
      testHelper.initialBlogs.length * testHelper.initialUsers.length)
  })

  test('a specific blog is within the returned blogs', async () => {
    const response = await api.get('/api/blogs')

    const title = response.body.map(r => r.title)
    expect(title).toContain(testHelper.initialBlogs[0].title)
  })

  test('the data retrieved contains id field', async () => {
    const response = await api.get('/api/blogs')

    for (const blog of response.body) {
      expect(blog.id).toBeDefined()
    }
  })

  test('the data retrieved contains user id field', async () => {
    const response = await api.get('/api/blogs')

    for (const blog of response.body) {
      expect(blog.user.id).toBeDefined()
    }
  })
})

describe('When a specific record is requested,', () => {
  test('it is reachable with id', async () => {
    const response = await api.get('/api/blogs')
    const ids = response.body.map(blog => blog.id)

    for (const id of ids) {
      await api
        .get(`/api/blogs/${id}`)
        .expect(200)
        .expect('Content-Type', /application\/json/)
    }
  })

  test('if id is valid but non-existant, status 404 is returned ', async () => {
    await api
      .get(`/api/blogs/${testHelper.nonExistingId}`)
      .expect(404)
  })

  test('if id is not valid, status 400 is returned ', async () => {
    await api
      .get('/api/blogs/5fbd5c89f7dd00102b17b20')
      .expect(400)
  })
})

/*
 * Login
 */
describe('When there are users in database,', () => {
  test('it is possible to login', async () => {
    await api
      .post('/api/login')
      .send({
        username: testHelper.initialUsers[0].username,
        password: testHelper.initialUsers[0].password
      })
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })
})

/*
 * POST
 */
describe('When new data is added,', () => {
  test('the blog is saved to database', async () => {
    const token = await tokenFor(testHelper.initialUsers[0])

    await api
      .post('/api/blogs')
      .set('authorization', `bearer ${token}`)
      .send(testHelper.anotherBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const response = await testHelper.blogsInDb()
    expect(response).toHaveLength(
      testHelper.initialBlogs.length * testHelper.initialUsers.length + 1)

    const titles = response.map(r => r.title)
    expect(titles).toContain('Third post')
  })

  test('a blog without likes set has 0 of them', async () => {
    const token = await tokenFor(testHelper.initialUsers[0])

    const newBlog = {
      title: 'Third post',
      author: 'Jason',
      url: 'https://yahoo.com'
    }

    const response = await api
      .post('/api/blogs')
      .set('authorization', `bearer ${token}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    expect(response.body.likes).toEqual(0)
  })

  test('a blog without title is not accepted', async () => {
    const token = await tokenFor(testHelper.initialUsers[0])

    const newBlog = {
      author: 'Jason',
      url: 'https://yahoo.com'
    }

    await api
      .post('/api/blogs')
      .set('authorization', `bearer ${token}`)
      .send(newBlog)
      .expect(400)

    const response = await testHelper.blogsInDb()
    expect(response).toHaveLength(
      testHelper.initialBlogs.length * testHelper.initialUsers.length)
  })

  test('a blog without url is not accepted', async () => {
    const token = await tokenFor(testHelper.initialUsers[0])

    const newBlog = {
      title: 'Third post',
      author: 'Jason'
    }

    await api
      .post('/api/blogs')
      .set('authorization', `bearer ${token}`)
      .send(newBlog)
      .expect(400)

    const response = await testHelper.blogsInDb()
    expect(response).toHaveLength(
      testHelper.initialBlogs.length * testHelper.initialUsers.length)
  })
})

/*
 * PUT
 */
describe('When a blog is updated,', () => {
  test('it is saved to database', async () => {
    const token = await tokenFor(testHelper.initialUsers[0])

    let blogs = await api.get('/api/blogs')
    const indexToUpdate = 0
    const newTitle = 'New one'

    const updatedRecord = await api
      .put(`/api/blogs/${blogs.body[indexToUpdate].id}`)
      .set('authorization', `bearer ${token}`)
      .send({ title: newTitle })
      .expect(200)
      .expect('Content-Type', /application\/json/)

    expect(updatedRecord.body.title).toEqual(newTitle)
  })
})


/*
 * DELETE
 */
describe('When deletion is requested,', () => {
  test('blog is deleted from database', async () => {
    const token = await tokenFor(testHelper.initialUsers[0])

    let blogs = await api.get('/api/blogs')
    const indexToDelete = 0
    const deletedId = blogs.body[indexToDelete].id

    await api
      .delete(`/api/blogs/${blogs.body[indexToDelete].id}`)
      .set('authorization', `bearer ${token}`)
      .expect(204)

    const updatedBlogs = await api.get('/api/blogs')
    const ids = updatedBlogs.body.map(blog => blog.ids)
    expect(updatedBlogs.body).toHaveLength(
      testHelper.initialBlogs.length * testHelper.initialUsers.length - 1)
    expect(ids).not.toContain(deletedId)
  })
})

/*
 * Clean up after tests
 */
afterAll(() => {
  mongoose.connection.close()
})
