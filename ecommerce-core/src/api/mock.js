import { weightedRandom } from '../utils/weightedRandom'

const products = [
  {
    id: 1,
    name: '极简白衬衫',
    image: '👔',
    price: 199,
    discountPrice: 159,
    skus: [
      { id: 'sku-1-1', name: '白色 / S', stock: 8, price: 199, discountPrice: 159 },
      { id: 'sku-1-2', name: '白色 / M', stock: 12, price: 199, discountPrice: 159 },
      { id: 'sku-1-3', name: '白色 / L', stock: 0, price: 199, discountPrice: 159 }
    ]
  },
  {
    id: 2,
    name: '黑色工装裤',
    image: '👖',
    price: 259,
    discountPrice: 199,
    skus: [
      { id: 'sku-2-1', name: '黑色 / M', stock: 10, price: 259, discountPrice: 199 },
      { id: 'sku-2-2', name: '黑色 / L', stock: 6, price: 259, discountPrice: 199 }
    ]
  },
  {
    id: 3,
    name: '帆布托特包',
    image: '👜',
    price: 129,
    discountPrice: 99,
    skus: [
      { id: 'sku-3-1', name: '米白 / 单色', stock: 20, price: 129, discountPrice: 99 }
    ]
  },
  {
    id: 4,
    name: '纯白运动鞋',
    image: '👟',
    price: 399,
    discountPrice: 329,
    skus: [
      { id: 'sku-4-1', name: '白色 / 39', stock: 7, price: 399, discountPrice: 329 },
      { id: 'sku-4-2', name: '白色 / 40', stock: 9, price: 399, discountPrice: 329 },
      { id: 'sku-4-3', name: '白色 / 41', stock: 0, price: 399, discountPrice: 329 }
    ]
  },
  {
    id: 5,
    name: '极简石英表',
    image: '⌚',
    price: 599,
    discountPrice: 499,
    skus: [
      { id: 'sku-5-1', name: '黑盘 / 钢带', stock: 5, price: 599, discountPrice: 499 }
    ]
  },
  {
    id: 6,
    name: '无线蓝牙耳机',
    image: '🎧',
    price: 299,
    discountPrice: 239,
    skus: [
      { id: 'sku-6-1', name: '白色', stock: 15, price: 299, discountPrice: 239 },
      { id: 'sku-6-2', name: '黑色', stock: 4, price: 299, discountPrice: 239 }
    ]
  }
]

const coupons = [
  { id: 'c1', name: '无门槛立减 10 元', type: 'fixed', amount: 10, minSpend: 0 },
  { id: 'c2', name: '满 200 减 30', type: 'fixed', amount: 30, minSpend: 200 },
  { id: 'c3', name: '满 300 打 9 折', type: 'percent', percent: 0.9, minSpend: 300 }
]

const prizePool = [
  { id: 1, name: '谢谢参与', weight: 40 },
  { id: 2, name: '5元优惠券', weight: 30 },
  { id: 3, name: '10元优惠券', weight: 18 },
  { id: 4, name: '20元优惠券', weight: 8 },
  { id: 5, name: '精美礼品', weight: 3 },
  { id: 6, name: '免单大奖', weight: 1 }
]

const usedNonces = new Set()

function ok(data) {
  return { status: 200, body: { code: 200, message: 'success', data } }
}

function fail(status, message) {
  return { status, body: { code: status, message } }
}

function parseBody(config) {
  try {
    return config.data ? JSON.parse(config.data) : {}
  } catch {
    return {}
  }
}

export function handleMock(config) {
  const method = (config.method || 'get').toLowerCase()
  const path = config.url.replace(/^\/api/, '')

  if (method === 'get' && path === '/products') {
    const keyword = (config.params?.keyword || '').toLowerCase()
    const list = products.filter((item) => item.name.toLowerCase().includes(keyword))
    return ok({ list, total: list.length })
  }

  if (method === 'get' && path === '/coupons') {
    return ok({ list: coupons })
  }

  if (method === 'post' && path === '/orders') {
    const payload = parseBody(config)
    if (!payload.items || payload.items.length === 0) {
      return fail(400, '订单商品不能为空')
    }
    return ok({ orderId: `CY-${Date.now()}`, status: 'pending' })
  }

  const payMatch = path.match(/^\/orders\/([^/]+)\/pay$/)
  if (method === 'post' && payMatch) {
    return ok({ status: 'paid', orderId: payMatch[1] })
  }

  const cancelMatch = path.match(/^\/orders\/([^/]+)\/cancel$/)
  if (method === 'post' && cancelMatch) {
    return ok({ status: 'pending', orderId: cancelMatch[1] })
  }

  if (method === 'post' && path === '/lottery/draw') {
    const payload = parseBody(config)
    const now = Date.now()
    if (!payload.timestamp || Math.abs(now - payload.timestamp) > 60000) {
      return fail(400, '请求已过期，请重试')
    }
    if (!payload.nonce || usedNonces.has(payload.nonce)) {
      return fail(409, '重复请求，请勿重复提交')
    }
    usedNonces.add(payload.nonce)
    const prize = weightedRandom(prizePool)
    return ok({
      orderId: `LOT-${now}`,
      prize: { id: prize.id, name: prize.name }
    })
  }

  return fail(404, `Mock 接口不存在：${method.toUpperCase()} ${path}`)
}
