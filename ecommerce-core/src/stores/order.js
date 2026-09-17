import { defineStore } from 'pinia'
import { cancelOrderApi, createOrderApi, payOrderApi } from '../api'

const STORAGE_KEY = 'cyan-mall-orders'

const seedOrders = [
  {
    id: 'CY-DEMO-0004',
    status: 'pending',
    createdAt: '2026-09-17 10:20',
    payable: 159,
    items: [
      { id: 'demo-4', name: '极简白衬衫', image: '白衬衫', skuName: '白色 / M', quantity: 1, price: 199, discountPrice: 159 }
    ]
  },
  {
    id: 'CY-DEMO-0003',
    status: 'paid',
    createdAt: '2026-09-16 15:45',
    payable: 199,
    items: [
      { id: 'demo-3', name: '黑色工装裤', image: '工装裤', skuName: '黑色 / L', quantity: 1, price: 259, discountPrice: 199 }
    ]
  },
  {
    id: 'CY-DEMO-0002',
    status: 'shipped',
    createdAt: '2026-09-14 09:10',
    payable: 329,
    items: [
      { id: 'demo-2', name: '纯白运动鞋', image: '运动鞋', skuName: '白色 / 40', quantity: 1, price: 399, discountPrice: 329 }
    ]
  },
  {
    id: 'CY-DEMO-0001',
    status: 'delivered',
    createdAt: '2026-09-10 18:30',
    payable: 239,
    items: [
      { id: 'demo-1', name: '无线蓝牙耳机', image: '蓝牙耳机', skuName: '白色', quantity: 1, price: 299, discountPrice: 239 }
    ]
  }
]

function loadOrders() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : seedOrders
  } catch {
    return seedOrders
  }
}

function saveOrders(orders) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(orders))
}

export const useOrderStore = defineStore('order', {
  state: () => ({
    orders: loadOrders(),
    currentOrder: null,
    status: 'idle'
  }),
  actions: {
    persistOrders() {
      saveOrders(this.orders)
    },
    async createOrder(payload) {
      const data = await createOrderApi(payload)
      const order = {
        id: data.orderId,
        status: 'pending',
        createdAt: new Date().toLocaleString(),
        ...payload
      }
      this.currentOrder = order
      this.orders.unshift(order)
      this.persistOrders()
      this.status = 'pending'
      return this.currentOrder
    },
    async pay(method) {
      if (!this.currentOrder) return
      this.status = 'paying'
      await payOrderApi(this.currentOrder.id, method)
      this.currentOrder.status = 'paid'
      this.updateOrderStatus(this.currentOrder.id, 'paid')
      this.status = 'paid'
    },
    async cancel() {
      if (!this.currentOrder) return
      await cancelOrderApi(this.currentOrder.id)
      this.currentOrder.status = 'pending'
      this.status = 'pending'
    },
    updateOrderStatus(orderId, status) {
      const order = this.orders.find((item) => item.id === orderId)
      if (order) {
        order.status = status
        this.persistOrders()
      }
    },
    confirmReceipt(orderId) {
      this.updateOrderStatus(orderId, 'delivered')
      if (this.currentOrder?.id === orderId) {
        this.currentOrder.status = 'delivered'
      }
    },
    reset() {
      this.currentOrder = null
      this.status = 'idle'
    }
  }
})
