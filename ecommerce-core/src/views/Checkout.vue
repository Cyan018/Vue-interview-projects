<template>
  <div class="page">
    <template v-if="items.length">
      <h2>确认订单</h2>

      <section class="card block">
        <h3>收货信息</h3>
        <el-form label-position="top">
          <el-form-item label="收货人">
            <el-input v-model.trim="form.name" placeholder="请输入收货人姓名" />
          </el-form-item>
          <el-form-item label="手机号">
            <el-input v-model.trim="form.phone" placeholder="请输入手机号" />
          </el-form-item>
          <el-form-item label="收货地址">
            <el-input v-model.trim="form.address" placeholder="请输入详细地址" />
          </el-form-item>
        </el-form>
      </section>

      <section class="card block">
        <h3>商品清单</h3>
        <div v-for="item in items" :key="item.id" class="order-item">
          <div class="image">{{ item.image }}</div>
          <div class="info">
            <p class="name">{{ item.name }}</p>
            <p class="sku">{{ item.skuName }} × {{ item.quantity }}</p>
          </div>
          <div class="price">¥{{ (item.discountPrice * item.quantity).toFixed(2) }}</div>
        </div>
      </section>

      <section class="card block">
        <h3>优惠券</h3>
        <el-radio-group v-model="selectedCouponId" class="coupon-list">
          <el-radio v-for="coupon in coupons" :key="coupon.id" :value="coupon.id" :disabled="coupon.minSpend > totalDiscount">
            {{ coupon.name }}
          </el-radio>
        </el-radio-group>
        <p class="hint">不选择则不使用优惠券</p>
      </section>

      <aside class="card summary">
        <div class="row">
          <span>商品原价</span>
          <span>¥{{ totalOriginal.toFixed(2) }}</span>
        </div>
        <div class="row">
          <span>商品优惠</span>
          <span>-¥{{ productSaved.toFixed(2) }}</span>
        </div>
        <div class="row">
          <span>优惠券</span>
          <span>-¥{{ couponDiscount.toFixed(2) }}</span>
        </div>
        <div class="row total">
          <span>应付金额</span>
          <span>¥{{ payable.toFixed(2) }}</span>
        </div>
        <el-button type="primary" size="large" class="submit-btn" @click="submitOrder">
          提交订单
        </el-button>
      </aside>

      <PaymentDialog v-model="paymentVisible" :amount="payable" @success="onPaid" @cancel="onCancelled" />
    </template>

    <div v-else class="empty">
      <div class="empty-icon">🧾</div>
      <p>没有需要结算的商品</p>
      <el-button type="primary" @click="$router.push('/')">去逛逛</el-button>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { getCouponsApi } from '../api'
import PaymentDialog from '../components/PaymentDialog.vue'
import { useCartStore } from '../stores/cart'
import { useOrderStore } from '../stores/order'

const router = useRouter()
const cartStore = useCartStore()
const orderStore = useOrderStore()

const form = reactive({
  name: '',
  phone: '',
  address: ''
})
const coupons = ref([])
const selectedCouponId = ref('')
const paymentVisible = ref(false)

const items = computed(() =>
  cartStore.buyNowItem ? [cartStore.buyNowItem] : cartStore.selectedItems
)

const totalOriginal = computed(() =>
  items.value.reduce((sum, item) => sum + item.price * item.quantity, 0)
)

const totalDiscount = computed(() =>
  items.value.reduce((sum, item) => sum + item.discountPrice * item.quantity, 0)
)

const productSaved = computed(() => totalOriginal.value - totalDiscount.value)

const selectedCoupon = computed(() =>
  coupons.value.find((coupon) => coupon.id === selectedCouponId.value)
)

const couponDiscount = computed(() => {
  const coupon = selectedCoupon.value
  if (!coupon || coupon.minSpend > totalDiscount.value) return 0
  if (coupon.type === 'fixed') return Math.min(coupon.amount, totalDiscount.value)
  if (coupon.type === 'percent') {
    return Number((totalDiscount.value * (1 - coupon.percent)).toFixed(2))
  }
  return 0
})

const payable = computed(() =>
  Math.max(0, totalDiscount.value - couponDiscount.value)
)

onMounted(async () => {
  const data = await getCouponsApi()
  coupons.value = data.list
})

async function submitOrder() {
  if (!form.name || !form.phone || !form.address) {
    ElMessage.warning('请填写完整收货信息')
    return
  }

  await orderStore.createOrder({
    items: items.value,
    shipping: { ...form },
    couponId: selectedCouponId.value,
    totalOriginal: totalOriginal.value,
    totalDiscount: totalDiscount.value,
    couponDiscount: couponDiscount.value,
    payable: payable.value
  })

  if (cartStore.buyNowItem) {
    cartStore.clearBuyNow()
  } else {
    cartStore.clearSelected()
  }

  paymentVisible.value = true
}

function onPaid() {
  router.push({
    path: '/order-result',
    query: { status: 'paid', orderId: orderStore.currentOrder.id, amount: payable.value }
  })
}

async function onCancelled() {
  await orderStore.cancel()
  router.push({
    path: '/order-result',
    query: { status: 'pending', orderId: orderStore.currentOrder.id, amount: payable.value }
  })
}
</script>

<style scoped>
.page {
  max-width: 860px;
  margin: 0 auto;
  padding: 24px;
}

h2 {
  margin: 0 0 20px;
}

.block {
  margin-bottom: 16px;
}

.block h3 {
  margin: 0 0 16px;
}

.order-item {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 12px 0;
  border-bottom: 1px solid var(--glass-border);
}

.image {
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
  background: rgba(255, 255, 255, 0.5);
  border: 1px solid var(--glass-border);
  border-radius: 8px;
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
  color: var(--text-soft);
  font-size: 13px;
}

.coupon-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.hint {
  color: var(--text-soft);
  font-size: 13px;
}

.summary {
  margin-top: 4px;
}

.row {
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
}

.row.total {
  border-top: 1px solid var(--glass-border);
  font-size: 18px;
  font-weight: 700;
}

.submit-btn {
  width: 100%;
  margin-top: 10px;
}

.empty {
  text-align: center;
  padding: 80px 0;
}

.empty-icon {
  font-size: 56px;
}
</style>
