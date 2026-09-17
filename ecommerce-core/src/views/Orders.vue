<template>
  <div class="page">
    <h2>我的订单</h2>

    <div v-if="orderStore.orders.length === 0" class="empty">
      <div class="empty-icon">📦</div>
      <p>暂无订单</p>
      <el-button type="primary" @click="$router.push('/')">去逛逛</el-button>
    </div>

    <div v-for="order in orderStore.orders" :key="order.id" class="order-card card">
      <div class="order-head">
        <div class="order-meta">
          <span>订单号：{{ order.id }}</span>
          <span>{{ order.createdAt }}</span>
        </div>
        <span class="status" :class="order.status">{{ statusText(order.status) }}</span>
      </div>

      <div class="items">
        <div v-for="item in order.items" :key="item.id" class="item">
          <div class="thumb">{{ item.image }}</div>
          <div class="info">
            <p class="name">{{ item.name }}</p>
            <p class="sku">{{ item.skuName }} × {{ item.quantity }}</p>
          </div>
          <div class="price">¥{{ (item.discountPrice * item.quantity).toFixed(2) }}</div>
        </div>
      </div>

      <div class="amount">实付：¥{{ Number(order.payable).toFixed(2) }}</div>

      <div class="timeline">
        <div
          v-for="(step, index) in steps"
          :key="step"
          class="step"
          :class="{ done: index <= stepIndex(order.status) }"
        >
          <span class="dot">{{ index <= stepIndex(order.status) ? '●' : '○' }}</span>
          <span>{{ step }}</span>
        </div>
      </div>

      <div class="actions">
        <el-button v-if="order.status === 'shipped'" type="primary" @click="orderStore.confirmReceipt(order.id)">
          确认收货
        </el-button>
        <el-button
          v-if="order.status === 'pending'"
          type="primary"
          @click="$router.push({ path: '/order-result', query: { status: 'pending', orderId: order.id, amount: order.payable } })"
        >
          查看支付
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useOrderStore } from '../stores/order'

const orderStore = useOrderStore()
const steps = ['提交订单', '支付成功', '商家发货', '运输中', '已签收']

function statusText(status) {
  return {
    pending: '待支付',
    paid: '待发货',
    shipped: '运输中',
    delivered: '已签收'
  }[status] || status
}

function stepIndex(status) {
  return {
    pending: 0,
    paid: 1,
    shipped: 3,
    delivered: 4
  }[status] || 0
}
</script>

<style scoped>
h2 {
  margin: 0 0 20px;
}

.order-card {
  margin-bottom: 16px;
}

.order-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 14px;
  border-bottom: 1px solid #111;
}

.order-meta {
  display: flex;
  flex-direction: column;
  gap: 6px;
  color: #6b7280;
  font-size: 13px;
}

.status {
  font-weight: 700;
}

.status.pending {
  color: #dc2626;
}

.status.paid {
  color: #f59e0b;
}

.status.shipped {
  color: #2563eb;
}

.status.delivered {
  color: #16a34a;
}

.items {
  padding: 12px 0;
}

.item {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 10px 0;
}

.thumb {
  width: 52px;
  height: 52px;
  display: grid;
  place-items: center;
  font-size: 12px;
  font-weight: 700;
  line-height: 1.3;
  padding: 4px;
  text-align: center;
  word-break: break-all;
  background: #f3f4f6;
  border: 1px solid #111;
}

.info {
  flex: 1;
}

.name {
  margin: 0 0 6px;
  font-weight: 700;
}

.sku {
  margin: 0;
  color: #9ca3af;
  font-size: 13px;
}

.amount {
  text-align: right;
  font-weight: 700;
}

.timeline {
  display: flex;
  gap: 10px;
  margin: 18px 0 8px;
  overflow-x: auto;
  padding-bottom: 6px;
}

.step {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #9ca3af;
  white-space: nowrap;
}

.step.done {
  color: #111;
  font-weight: 700;
}

.dot {
  font-size: 12px;
}

.actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 12px;
}

.empty {
  text-align: center;
  padding: 100px 0;
}

.empty-icon {
  font-size: 64px;
}

.empty p {
  color: #6b7280;
}
</style>
