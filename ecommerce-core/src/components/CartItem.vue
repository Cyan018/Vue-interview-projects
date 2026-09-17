<template>
  <div class="cart-item">
    <el-checkbox :model-value="item.selected" @change="$emit('toggle', item.id)" />
    <div class="thumb">{{ item.image }}</div>
    <div class="info">
      <h3>{{ item.name }}</h3>
      <p class="sku">{{ item.skuName }}</p>
      <div class="price">
        ¥{{ item.discountPrice }}
        <span class="origin">¥{{ item.price }}</span>
      </div>
    </div>
    <el-input-number
      :model-value="item.quantity"
      :min="1"
      :max="item.stock"
      @change="(value) => $emit('change-quantity', item.id, value)"
    />
    <div class="subtotal">¥{{ (item.discountPrice * item.quantity).toFixed(2) }}</div>
    <el-button text type="danger" @click="$emit('remove', item.id)">删除</el-button>
  </div>
</template>

<script setup>
defineProps({
  item: {
    type: Object,
    required: true
  }
})

defineEmits(['toggle', 'change-quantity', 'remove'])
</script>

<style scoped>
.cart-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px 0;
  border-bottom: 1px solid #f3f4f6;
}

.thumb {
  width: 64px;
  height: 64px;
  display: grid;
  place-items: center;
  font-size: 13px;
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

h3 {
  margin: 0 0 6px;
  font-size: 16px;
}

.sku {
  margin: 0 0 6px;
  color: #9ca3af;
  font-size: 13px;
}

.price {
  font-weight: 700;
}

.origin {
  margin-left: 6px;
  color: #9ca3af;
  font-weight: 400;
  text-decoration: line-through;
}

.subtotal {
  width: 90px;
  text-align: right;
  font-weight: 700;
}
</style>
