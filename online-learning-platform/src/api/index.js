import request from './request'

export function loginApi(data) {
  return request.post('/login', data)
}

export function getUserInfoApi() {
  return request.get('/user/me')
}

export function updateUserInfoApi(data) {
  return request.put('/user/me', data)
}

export function getResourcesApi(params) {
  return request.get('/resources', { params })
}

export function getResourceDetailApi(id) {
  return request.get(`/resources/${id}`)
}
