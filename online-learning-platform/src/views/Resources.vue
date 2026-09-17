<template>
  <section>
    <div class="toolbar card">
      <input v-model="keyword" class="input search" type="text" placeholder="搜索资源名称" />
      <select v-model="category" class="input select">
        <option value="">全部分类</option>
        <option value="Vue 核心">Vue 核心</option>
        <option value="路由">路由</option>
        <option value="状态管理">状态管理</option>
        <option value="工程化">工程化</option>
      </select>
    </div>

    <p v-if="loading" class="state">加载中...</p>
    <p v-else-if="list.length === 0" class="state">暂无匹配资源</p>
    <div v-else class="grid">
      <ResourceCard v-for="item in list" :key="item.id" :resource="item" />
    </div>
  </section>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue'
import { getResourcesApi } from '../api'
import ResourceCard from '../components/ResourceCard.vue'

const keyword = ref('')
const category = ref('')
const list = ref([])
const loading = ref(false)
let timer = null

async function load() {
  loading.value = true
  try {
    const data = await getResourcesApi({ keyword: keyword.value, category: category.value })
    list.value = data.list
  } finally {
    loading.value = false
  }
}

watch([keyword, category], () => {
  clearTimeout(timer)
  timer = setTimeout(load, 300)
})

onMounted(load)
</script>

<style scoped>
.toolbar {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
}

.search {
  flex: 1;
}

.select {
  width: 160px;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 16px;
}

.state {
  color: #64748b;
  text-align: center;
  padding: 40px 0;
}
</style>
