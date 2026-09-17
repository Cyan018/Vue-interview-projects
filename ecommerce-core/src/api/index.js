import request from './request'

export function getProductsApi(params) {
  return request.get('/products', { params })
}

export function getCouponsApi() {
  return request.get('/coupons')
}

export function createOrderApi(data) {
  return request.post('/orders', data)
}

export function payOrderApi(orderId, method) {
  return request.post(`/orders/${orderId}/pay`, { method })
}

export function cancelOrderApi(orderId) {
  return request.post(`/orders/${orderId}/cancel`)
}

export function drawApi() {
  return request.post('/lottery/draw', {
    timestamp: Date.now(),
    nonce: Math.random().toString(36).slice(2)
  })
}
