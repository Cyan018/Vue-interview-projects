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
  border: 1px solid var(--glass-border);
  padding: 18px;
  background: var(--surface);
  border-radius: 16px;
  box-shadow: var(--shadow-soft);
  backdrop-filter: blur(18px) saturate(1.12);
  -webkit-backdrop-filter: blur(18px) saturate(1.12);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.product-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-hover);
}

.image {
  aspect-ratio: 1;
  display: grid;
  place-items: center;
  font-size: 16px;
  font-weight: 700;
  line-height: 1.4;
  padding: 10px;
  text-align: center;
  word-break: break-all;
  background: rgba(255, 255, 255, 0.5);
  border-radius: 12px;
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
  color: var(--text);
  font-weight: 700;
  font-size: 18px;
}

.origin {
  color: var(--text-soft);
  text-decoration: line-through;
}

.actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}
</style>
