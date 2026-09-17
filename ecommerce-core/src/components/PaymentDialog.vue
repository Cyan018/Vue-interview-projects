<template>
  <el-dialog
    :model-value="visible"
    title="模拟支付"
    width="420px"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    @update:model-value="handleVisibleChange"
  >
    <div class="pay-dialog">
      <p class="pay-amount">¥{{ amount.toFixed(2) }}</p>
      <p class="label">选择支付方式</p>
      <el-radio-group v-model="method" class="pay-methods">
        <el-radio value="wechat">微信支付</el-radio>
        <el-radio value="alipay">支付宝</el-radio>
        <el-radio value="card">银行卡</el-radio>
      </el-radio-group>

      <div v-if="paying" class="paying-mask">
        <span>支付处理中...</span>
      </div>
    </div>

    <template #footer>
      <el-button :disabled="paying" @click="handleCancel">取消支付</el-button>
      <el-button type="primary" :disabled="paying" @click="handleConfirm">确认支付</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { onBeforeUnmount, ref } from 'vue'
import { useOrderStore } from '../stores/order'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  amount: {
    type: Number,
    default: 0
  }
})

const emit = defineEmits(['update:visible', 'success', 'cancel'])

const orderStore = useOrderStore()
const method = ref('wechat')
const paying = ref(false)
let timer = null

function handleVisibleChange(value) {
  if (!paying.value) {
    emit('update:visible', value)
  }
}

async function handleConfirm() {
  paying.value = true
  timer = setTimeout(async () => {
    try {
      await orderStore.pay(method.value)
      paying.value = false
      emit('update:visible', false)
      emit('success')
    } finally {
      paying.value = false
    }
  }, 1200)
}

function handleCancel() {
  if (paying.value) return
  emit('update:visible', false)
  emit('cancel')
}

onBeforeUnmount(() => {
  clearTimeout(timer)
})
</script>

<style scoped>
.pay-dialog {
  position: relative;
}

.pay-amount {
  margin: 0 0 20px;
  font-size: 30px;
  font-weight: 700;
  text-align: center;
}

.label {
  color: #111;
  font-size: 14px;
}

.pay-methods {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.paying-mask {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  background: rgba(255, 255, 255, 0.92);
  color: #111;
  font-weight: 700;
}
</style>
