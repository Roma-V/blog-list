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
 * @file contains helper functionality for testing.
 * @author Roman Vasilyev
 */

const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  const reducer = (accumulator, currentValue) => accumulator + currentValue.likes
  return blogs.reduce(reducer, 0)
}

const favoriteBlog = (blogs) => {
  const maximizer = (max, currentValue) => Math.max(max, currentValue)
  const maximum = blogs
    .map(blog => blog.likes)
    .reduce(maximizer, 0)
  return blogs.find(blog => blog.likes === maximum)
}

const mostBlogs = (blogs) => {
  let authors = new Map()
  blogs.forEach(element => {
    authors.has(element.author)
      ? authors.set(element.author, authors.get(element.author) + 1)
      : authors.set(element.author, 1)
  })

  const maximum = Math.max(...authors.values())
  for (let [key, value] of authors) {
    if (value === maximum) return { author: key, blogs: value }
  }
  return undefined
}

const mostLikes = (blogs) => {
  let authors = new Map()
  blogs.forEach(element => {
    authors.has(element.author)
      ? authors.set(element.author, authors.get(element.author) + element.likes)
      : authors.set(element.author, element.likes)
  })

  const maximum = Math.max(...authors.values())
  for (let [key, value] of authors) {
    if (value === maximum) return { author: key, likes: value }
  }
  return undefined
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}