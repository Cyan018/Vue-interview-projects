<template>
  <el-dialog
    :model-value="visible"
    title="选择规格"
    width="420px"
    :close-on-click-modal="false"
    @update:model-value="$emit('update:visible', $event)"
  >
    <div v-if="product" class="sku-dialog">
      <div class="product">
        <div class="image">{{ product.image }}</div>
        <div>
          <h3>{{ product.name }}</h3>
          <p class="price">
            ¥{{ selectedSku ? selectedSku.discountPrice : product.discountPrice }}
            <span class="origin">¥{{ selectedSku ? selectedSku.price : product.price }}</span>
          </p>
        </div>
      </div>

      <p class="label">规格</p>
      <el-radio-group v-model="selectedSkuId" class="sku-list">
        <el-radio-button
          v-for="sku in product.skus"
          :key="sku.id"
          :value="sku.id"
          :disabled="sku.stock === 0"
        >
          {{ sku.name }}
        </el-radio-button>
      </el-radio-group>
      <p v-if="selectedSku" class="stock">
        库存 {{ selectedSku.stock }} 件
      </p>

      <div class="quantity">
        <span>数量</span>
        <el-input-number
          v-model="quantity"
          :min="1"
          :max="selectedSku ? selectedSku.stock : 1"
        />
      </div>
    </div>

    <template #footer>
      <el-button @click="$emit('update:visible', false)">取消</el-button>
      <el-button type="primary" :disabled="!selectedSku" @click="confirm">确认</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { computed, ref, watch } from 'vue'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  product: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['update:visible', 'confirm'])

const selectedSkuId = ref('')
const quantity = ref(1)

const selectedSku = computed(() =>
  props.product?.skus.find((sku) => sku.id === selectedSkuId.value)
)

watch(
  () => props.visible,
  (value) => {
    if (value) {
      selectedSkuId.value = ''
      quantity.value = 1
    }
  }
)

function confirm() {
  if (!selectedSku.value || selectedSku.value.stock === 0) {
    ElMessage.warning('请选择有库存的规格')
    return
  }
  emit('confirm', props.product, selectedSku.value, quantity.value)
}
</script>

<style scoped>
.sku-dialog {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.product {
  display: flex;
  gap: 14px;
  align-items: center;
}

.image {
  width: 72px;
  height: 72px;
  display: grid;
  place-items: center;
  font-size: 13px;
  font-weight: 700;
  line-height: 1.3;
  padding: 4px;
  text-align: center;
  word-break: break-all;
  background: rgba(255, 255, 255, 0.5);
  border: 1px solid var(--glass-border);
  border-radius: 10px;
}

h3 {
  margin: 0 0 8px;
  font-size: 16px;
}

.price {
  margin: 0;
  color: var(--text);
  font-weight: 700;
}

.origin {
  margin-left: 8px;
  color: var(--text-soft);
  font-weight: 400;
  text-decoration: line-through;
}

.label {
  color: var(--text);
  font-size: 14px;
}

.sku-list {
  display: flex;
  flex-wrap: wrap;
}

.stock {
  color: var(--text-soft);
  font-size: 13px;
}

.quantity {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>
