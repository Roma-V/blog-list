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
 * @file contains test cases for blogs array.
 * @author Roman Vasilyev
 */

// Imports
const listHelper = require('../utils/list_helper.js')

/*
 * Variables
 */
const emptyList = new Array()
const singleEntryList = emptyList.concat({
  title: 'First post',
  author: 'Roma',
  url: 'https://google.com',
  likes: 3
})
const multiEntryList = singleEntryList.concat({
  title: 'Second post',
  author: 'Roma',
  url: 'https://github.com',
  likes: 2
})
const FSOList = [
  { _id: '5a422a851b54a676234d17f7',
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
    __v:
  0
  },
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
    __v: 0
  },
  {
    _id: '5a422b3a1b54a676234d17f9',
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
    likes: 12,
    __v: 0
  },
  {
    _id: '5a422b891b54a676234d17fa',
    title: 'First class tests',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
    likes: 10,
    __v: 0
  },
  {
    _id: '5a422ba71b54a676234d17fb',
    title: 'TDD harms architecture',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
    likes: 0,
    __v: 0
  },
  {
    _id: '5a422bc61b54a676234d17fc',
    title: 'Type wars',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
    likes: 2,
    __v: 0
  }
]

/*
 * Tests
 */
test('dummy returns one', () => {
  const result = listHelper.dummy(emptyList)
  expect(result).toBe(1)
})

describe('total likes', () => {
  test('of empty list is zero', () => {
    const result = listHelper.totalLikes(emptyList)
    expect(result).toBe(0)
  })

  test('when list has only one blog, equals the likes of that', () => {
    const result = listHelper.totalLikes(singleEntryList)
    expect(result).toBe(3)
  })

  test('of a big list is calculated right', () => {
    const result = listHelper.totalLikes(multiEntryList)
    expect(result).toBe(5)
  })

  test('of a very big list is still calculated right', () => {
    const result = listHelper.totalLikes(FSOList)
    expect(result).toBe(36)
  })
})

describe('favorite posts', () => {
  test('of empty list is undefined', () => {
    const result = listHelper.favoriteBlog(emptyList)
    expect(result).toEqual(undefined)
  })

  test('when list has only one blog, equals that blog', () => {
    const result = listHelper.favoriteBlog(singleEntryList)
    expect(result).toEqual(singleEntryList[0])
  })

  test('of a big list is calculated right', () => {
    const result = listHelper.favoriteBlog(multiEntryList)
    expect(result).toEqual(multiEntryList[0])
  })

  test('of a very big list is still calculated right', () => {
    const result = listHelper.favoriteBlog(FSOList)
    expect(result).toEqual(FSOList[2])
  })
})

describe('Most posts', () => {
  test('of empty list are wrriten by undefined', () => {
    const result = listHelper.mostBlogs(emptyList)
    expect(result).toEqual(undefined)
  })

  test('when list has only one blog, equals that blog', () => {
    const result = listHelper.mostBlogs(singleEntryList)
    expect(result).toEqual({
      author: 'Roma',
      blogs: 1
    })
  })

  test('of a big list is calculated right', () => {
    const result = listHelper.mostBlogs(multiEntryList)
    expect(result).toEqual({
      author: 'Roma',
      blogs: 2
    })
  })

  test('of a very big list is still calculated right', () => {
    const result = listHelper.mostBlogs(FSOList)
    expect(result).toEqual({
      author: 'Robert C. Martin',
      blogs: 3
    })
  })
})

describe('Most likes', () => {
  test('of empty list are undefined', () => {
    const result = listHelper.mostLikes(emptyList)
    expect(result).toEqual(undefined)
  })

  test('when list has only one blog, equals that blog', () => {
    const result = listHelper.mostLikes(singleEntryList)
    expect(result).toEqual({
      author: 'Roma',
      likes: 3
    })
  })

  test('of a big list is calculated right', () => {
    const result = listHelper.mostLikes(multiEntryList)
    expect(result).toEqual({
      author: 'Roma',
      likes: 5
    })
  })

  test('of a very big list is still calculated right', () => {
    const result = listHelper.mostLikes(FSOList)
    expect(result).toEqual({
      author: 'Edsger W. Dijkstra',
      likes: 17
    })
  })
})