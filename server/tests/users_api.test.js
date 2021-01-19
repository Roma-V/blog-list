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
 * @file contains test cases for users database api.
 * @author Roman Vasilyev
 */

// Imports
const testHelper = require('../utils/api_test_helper.js')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app.js')
const User = require('../models/user.js')

// The test app
const api = supertest(app)

/*
 * Setup a function to run before each test
 */
beforeEach(async () => {
  await User.deleteMany({})

  const users = testHelper.initialUsers.map(user => new User(user))
  const promises = users.map(user => user.save())
  await Promise.all(promises)
})

/*
 * GET
 */
describe('When database has initial records,', () => {
  test('users are returned as json', async () => {
    await api
      .get('/api/users')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('all users are returned', async () => {
    const response = await api.get('/api/users')

    expect(response.body).toHaveLength(testHelper.initialUsers.length)
  })

  test('a specific user is within the returned users', async () => {
    const response = await api.get('/api/users')

    const usernames = response.body.map(r => r.username)
    expect(usernames).toContain(testHelper.initialUsers[0].username)
  })

  test('the data retrieved contains id field', async () => {
    const response = await api.get('/api/users')

    for (const user of response.body) {
      expect(user.id).toBeDefined()
    }
  })
})

/*
 * POST
 */
describe('When new data is added,', () => {
  test('a new user is saved to database', async () => {
    await api
      .post('/api/users')
      .send(testHelper.anotherUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const response = await testHelper.usersInDb()
    expect(response).toHaveLength(testHelper.initialUsers.length + 1)

    const usernames = response.map(r => r.username)
    expect(usernames).toContain(testHelper.anotherUser.username)
  })

  test('an existing username is rejected', async () => {
    await api
      .post('/api/users')
      .send(testHelper.initialUsers[0])
      .expect(400)

    const users = await testHelper.usersInDb()
    expect(users).toHaveLength(testHelper.initialUsers.length)

    expect(users[0].name).toBe(testHelper.initialUsers[0].name)
  })

  test('short username or password are rejected', async () => {
    for (const invalidUser of testHelper.initialUsers) {
      await api
        .post('/api/users')
        .send(invalidUser)
        .expect(400)

      const users = await testHelper.usersInDb()
      expect(users).toHaveLength(testHelper.initialUsers.length)
      expect(users[0].name).toBe(testHelper.initialUsers[0].name)
    }
  })
})

/*
 * Clean up after tests
 */
afterAll(() => {
  mongoose.connection.close()
})
