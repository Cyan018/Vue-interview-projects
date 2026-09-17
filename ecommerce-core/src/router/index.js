import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'products',
    component: () => import('../views/Products.vue')
  },
  {
    path: '/cart',
    name: 'cart',
    component: () => import('../views/Cart.vue')
  },
  {
    path: '/orders',
    name: 'orders',
    component: () => import('../views/Orders.vue')
  },
  {
    path: '/checkout',
    name: 'checkout',
    component: () => import('../views/Checkout.vue')
  },
  {
    path: '/order-result',
    name: 'order-result',
    component: () => import('../views/OrderResult.vue')
  },
  {
    path: '/lottery',
    name: 'lottery',
    component: () => import('../views/Lottery.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
