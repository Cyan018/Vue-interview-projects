<template>
  <div class="page">
    <div class="toolbar">
      <el-input v-model="keyword" placeholder="搜索商品名称" clearable @input="onSearch" />
    </div>

    <p v-if="loading" class="state">加载中...</p>
    <div v-else class="grid">
      <ProductCard
        v-for="product in list"
        :key="product.id"
        :product="product"
        @buy="openSku(product, 'buy')"
        @add="openSku(product, 'cart')"
      />
    </div>

    <SkuDialog v-model="dialogVisible" :product="dialogProduct" @confirm="handleConfirm" />
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { getProductsApi } from '../api'
import ProductCard from '../components/ProductCard.vue'
import SkuDialog from '../components/SkuDialog.vue'
import { useCartStore } from '../stores/cart'
import { debounce } from '../utils/debounce'

const router = useRouter()
const cartStore = useCartStore()
const keyword = ref('')
const list = ref([])
const loading = ref(false)
const dialogVisible = ref(false)
const dialogProduct = ref(null)
const dialogMode = ref('cart')

async function load() {
  loading.value = true
  try {
    const data = await getProductsApi({ keyword: keyword.value })
    list.value = data.list
  } finally {
    loading.value = false
  }
}

const onSearch = debounce(load, 300)

function openSku(product, mode) {
  dialogProduct.value = product
  dialogMode.value = mode
  dialogVisible.value = true
}

function handleConfirm(product, sku, quantity) {
  if (dialogMode.value === 'buy') {
    cartStore.setBuyNow(product, sku, quantity)
    dialogVisible.value = false
    router.push('/checkout')
    return
  }
  cartStore.addToCart(product, sku, quantity)
  dialogVisible.value = false
  ElMessage.success(`${product.name} 已加入购物车`)
}

onMounted(load)
</script>

<style scoped>
.toolbar {
  margin-bottom: 20px;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 16px;
}

.state {
  color: #6b7280;
  text-align: center;
  padding: 60px 0;
}
</style>
