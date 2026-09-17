import axios from 'axios'
import { handleMock } from './mock'

const mockAdapter = async (config) => {
  const result = handleMock(config)
  const response = {
    data: result.body,
    status: result.status,
    statusText: result.status === 200 ? 'OK' : 'Error',
    headers: {},
    config
  }

  if (result.status >= 400) {
    const error = new Error(result.body?.message || 'Request failed')
    error.config = config
    error.response = response
    throw error
  }

  return response
}

const request = axios.create({
  baseURL: '/api',
  timeout: 5000,
  adapter: mockAdapter
})

request.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

request.interceptors.response.use(
  (response) => {
    const body = response.data
    if (body.code !== 200) {
      return Promise.reject(new Error(body.message || '请求失败'))
    }
    return body.data
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      if (window.location.pathname !== '/login') {
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

export default request
