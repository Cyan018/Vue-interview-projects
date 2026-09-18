<template>
  <div class="page">
    <template v-if="cartStore.items.length">
      <div class="toolbar">
        <el-checkbox :model-value="cartStore.allSelected" @change="cartStore.toggleAll">
          全选
        </el-checkbox>
        <span>已选 {{ cartStore.checkedCount }} 件</span>
        <el-button text type="danger" @click="cartStore.clearSelected">删除已选</el-button>
      </div>

      <div class="list">
        <CartItem
          v-for="item in cartStore.items"
          :key="item.id"
          :item="item"
          @toggle="cartStore.toggleSelected"
          @change-quantity="cartStore.updateQuantity"
          @remove="cartStore.removeItem"
        />
      </div>

      <div class="checkout-bar">
        <el-checkbox :model-value="cartStore.allSelected" @change="cartStore.toggleAll">
          全选
        </el-checkbox>
        <div class="amount">
          <span class="origin">原价 ¥{{ cartStore.totalOriginalPrice.toFixed(2) }}</span>
          <span class="saved">已省 ¥{{ cartStore.savedAmount.toFixed(2) }}</span>
          <span class="total">合计 ¥{{ cartStore.totalDiscountPrice.toFixed(2) }}</span>
        </div>
        <el-button
          type="primary"
          size="large"
          :disabled="cartStore.selectedItems.length === 0"
          @click="goCheckout"
        >
          去结算
        </el-button>
      </div>
    </template>

    <div v-else class="empty">
      <div class="empty-icon">🛍️</div>
      <p>购物车还是空的</p>
      <el-button type="primary" @click="$router.push('/')">去逛逛</el-button>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import CartItem from '../components/CartItem.vue'
import { useCartStore } from '../stores/cart'

const router = useRouter()
const cartStore = useCartStore()

function goCheckout() {
  if (cartStore.selectedItems.length === 0) return
  router.push('/checkout')
}
</script>

<style scoped>
.toolbar {
  display: flex;
  align-items: center;
  gap: 18px;
  padding: 12px 0;
  border-bottom: 1px solid var(--glass-border);
}

.list {
  margin-bottom: 80px;
}

.checkout-bar {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 15;
  height: 76px;
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 0 max(24px, calc((100vw - 1080px) / 2));
  background: rgba(255, 255, 255, 0.72);
  color: var(--text);
  border-top: 1px solid var(--glass-border);
  backdrop-filter: blur(20px) saturate(1.12);
  -webkit-backdrop-filter: blur(20px) saturate(1.12);
}

.amount {
  flex: 1;
  display: flex;
  align-items: baseline;
  justify-content: flex-end;
  gap: 16px;
}

.origin {
  color: var(--text-soft);
  text-decoration: line-through;
}

.saved {
  color: var(--accent-dark);
}

.total {
  font-size: 22px;
  font-weight: 700;
}

.empty {
  text-align: center;
  padding: 100px 0;
}

.empty-icon {
  font-size: 64px;
}

.empty p {
  color: var(--text-soft);
}
</style>
