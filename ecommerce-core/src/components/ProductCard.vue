<template>
  <article class="product-card">
    <div class="image">{{ product.image }}</div>
    <h3>{{ product.name }}</h3>
    <div class="price-row">
      <span class="price">¥{{ product.discountPrice }}</span>
      <span class="origin">¥{{ product.price }}</span>
    </div>
    <div class="actions">
      <el-button plain @click="$emit('buy', product)">直接购买</el-button>
      <el-button type="primary" @click="$emit('add', product)">加入购物车</el-button>
    </div>
  </article>
</template>

<script setup>
defineProps({
  product: {
    type: Object,
    required: true
  }
})

defineEmits(['buy', 'add'])
</script>

<style scoped>
.product-card {
  border: 1px solid #111;
  padding: 16px;
  background: #fff;
  transition: transform 0.15s ease;
}

.product-card:hover {
  transform: translateY(-3px);
}

.image {
  aspect-ratio: 1;
  display: grid;
  place-items: center;
  font-size: 64px;
  background: #f3f4f6;
  margin-bottom: 14px;
}

h3 {
  margin: 0 0 10px;
  font-size: 16px;
}

.price-row {
  display: flex;
  align-items: baseline;
  gap: 8px;
  margin-bottom: 14px;
}

.price {
  color: #111;
  font-weight: 700;
  font-size: 18px;
}

.origin {
  color: #9ca3af;
  text-decoration: line-through;
}

.actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}
</style>
