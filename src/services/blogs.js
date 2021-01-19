/**
 * @file services for managing Blog element.
 * @author Roman Vasilyev
 */

import axios from 'axios'

const baseUrl = '/api/blogs'
let token = null

const setToken = newToken => {
  token = `bearer ${newToken}`
}

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const create = async newBlog => {
  const config = {
    headers: { Authorization: token },
  }

  try {
    const response = await axios.post(baseUrl, newBlog, config)
    return response.data
  } catch (error) {
    console.log('Server responded with status', error.response.status)
    return null
  }
}

const put = async updateBlog => {
  const config = {
    headers: { Authorization: token },
  }
  const objectToSend = {
    likes: updateBlog.likes
  }

  const response = await axios.put(baseUrl.concat(`/${updateBlog.id}`), objectToSend, config)
  return response.data
}

const putComment = async (blogId, comment) => {
  const config = {
    headers: { Authorization: token },
  }

  const response = await axios.put(baseUrl.concat(`/${blogId}/comments`), { comment }, config)
  return response.data
}

const remove = async blogId => {
  const config = {
    headers: { Authorization: token },
  }

  try {
    const response = await axios.delete(baseUrl.concat(`/${blogId}`), config)
    return response.status
  } catch(error) {
    return error.response.status
  }
}

export default {
  setToken,
  getAll,
  create,
  put,
  putComment,
  remove
}