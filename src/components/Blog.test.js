/* eslint-disable react/prop-types */
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
 * @file Tests for a Blog element.
 * @author Roman Vasilyev
 */

import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
import { Blog, NewBlog } from './Blog.js'

const testBlog = {
  likes: 1,
  user: {
    username: 'tester',
    name: 'John Johnson',
    id: '0aaaa00aa00000000a0a0aaa'
  },
  title: 'Test case',
  author: 'testman',
  url: 'https://test.url',
  id: '0aa0aaaa00000000a000aa00'
}

describe('A Blog component renders and', () => {
  let component

  beforeEach(() => {
    component = render(
      <Blog blog={testBlog} />
    )
  })

  test('contains title', () => {
    expect(component.container).toHaveTextContent(testBlog.title)
  })

  test('contains author', () => {
    expect(component.container).toHaveTextContent(testBlog.author)
  })

  test('contains url, which is hidden', () => {
    // component.debug()
    const div = component.container.querySelector('.togglableContent')
    expect(div).toHaveTextContent(testBlog.url)
    expect(div).toHaveStyle('display: none')
  })

  test('contains likes amount, which is hidden', () => {
    const div = component.container.querySelector('.togglableContent')
    expect(div).toHaveTextContent(testBlog.likes.toString())
    expect(div).toHaveStyle('display: none')
  })
})

describe('On view button click', () => {
  test('the view contains url and likes, which are not hidden', () => {
    const component = render(
      <Blog blog={testBlog} />
    )

    const button = component.getByText('view')
    fireEvent.click(button)

    const div = component.container.querySelector('.togglableContent')
    expect(div).not.toHaveStyle('display: none')
    expect(div).toHaveTextContent(testBlog.url)
    expect(div).toHaveTextContent(testBlog.likes.toString())
  })
})

describe('On like button click', () => {
  let amount = 2

  test(`if clicked ${amount} times, an event handler is called ${amount} times as well`, () => {
    const mockHandler = jest.fn()

    const component = render(
      <Blog blog={testBlog} update={mockHandler} />
    )

    const button = component.getByText('like')
    for (let i = 0; i<amount; i++) {
      fireEvent.click(button)
    }

    expect(mockHandler.mock.calls).toHaveLength(amount)
  })

  amount = 5
  test(`if clicked ${amount} times, an event handler is called ${amount} times as well`, () => {
    const mockHandler = jest.fn()

    const component = render(
      <Blog blog={testBlog} update={mockHandler} />
    )

    const button = component.getByText('like')
    for (let i = 0; i<amount; i++) {
      fireEvent.click(button)
    }

    expect(mockHandler.mock.calls).toHaveLength(amount)
  })
})

describe('When a new blog is created', () => {
  test('event handler returned proper data', () => {
    const createHandler = jest.fn(x => x)

    const component = render(
      <NewBlog submit={createHandler} />
    )

    const newBlog = {
      title: testBlog.title,
      author: testBlog.author,
      url: testBlog.url
    }

    const form = component.container.querySelector('form')
    const title = form.elements['Title']
    const author = form.elements['Author']
    const url = form.elements['URL']

    fireEvent.change(title, {
      target: { value: newBlog.title }
    })
    fireEvent.change(author, {
      target: { value: newBlog.author }
    })
    fireEvent.change(url, {
      target: { value: newBlog.url }
    })
    fireEvent.submit(form)

    expect(createHandler.mock.calls).toHaveLength(1)
    expect(createHandler.mock.results[0].value).toEqual(newBlog)
  })
})