<template>
  <div class="result page">
    <div class="icon">{{ status === 'paid' ? '✅' : '🕓' }}</div>
    <h2>{{ status === 'paid' ? '支付成功' : '订单待支付' }}</h2>
    <p>订单号：{{ orderId || '--' }}</p>
    <p>实付金额：¥{{ formatAmount }}</p>
    <el-button type="primary" @click="$router.push('/')">继续购物</el-button>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const status = computed(() => route.query.status || 'pending')
const orderId = computed(() => route.query.orderId || '')
const formatAmount = computed(() => Number(route.query.amount || 0).toFixed(2))
</script>

<style scoped>
.page {
  max-width: 480px;
  margin: 0 auto;
  padding: 80px 24px;
  text-align: center;
}

.icon {
  font-size: 64px;
}

h2 {
  margin: 20px 0 10px;
}

p {
  color: #4b5563;
}
</style>
