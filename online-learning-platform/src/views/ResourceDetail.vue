<template>
  <div class="detail">
    <template v-if="resource">
      <VideoPlayer :title="resource.title" :duration="resource.seconds" />

      <div class="card info">
        <div class="tags">
          <span class="tag">{{ resource.category }}</span>
          <span class="tag level">{{ resource.level }}</span>
        </div>
        <h1>{{ resource.title }}</h1>
        <p class="summary">{{ resource.summary }}</p>
        <div class="meta">
          <span>讲师：{{ resource.instructor }}</span>
          <span>时长：{{ resource.duration }}</span>
        </div>
      </div>

      <div class="card chapters">
        <h2>课程目录</h2>
        <ul>
          <li v-for="chapter in resource.chapters" :key="chapter.title">
            <span>{{ chapter.title }}</span>
            <span>{{ chapter.minutes }} 分钟</span>
          </li>
        </ul>
      </div>
    </template>

    <p v-else-if="loading" class="state">加载中...</p>
    <p v-else class="error card">资源不存在或已下线</p>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { getResourceDetailApi } from '../api'
import VideoPlayer from '../components/VideoPlayer.vue'

const route = useRoute()
const resource = ref(null)
const loading = ref(true)

onMounted(async () => {
  try {
    const data = await getResourceDetailApi(route.params.id)
    resource.value = data.resource
  } catch {
    resource.value = null
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.detail {
  display: flex;
  flex-direction: column;
  gap: 20px;
  max-width: 880px;
  margin: 0 auto;
}

.tags {
  display: flex;
  gap: 8px;
  margin-bottom: 14px;
}

.tag {
  display: inline-block;
  background: #eff6ff;
  color: #2563eb;
  border-radius: 999px;
  padding: 4px 12px;
  font-size: 13px;
}

.tag.level {
  background: #ecfdf5;
  color: #059669;
}

h1 {
  margin: 0 0 12px;
}

.summary {
  color: #64748b;
  line-height: 1.7;
}

.meta {
  display: flex;
  gap: 20px;
  color: #94a3b8;
  font-size: 14px;
}

.chapters h2 {
  margin: 0 0 16px;
}

.chapters ul {
  margin: 0;
  padding: 0;
  list-style: none;
}

.chapters li {
  display: flex;
  justify-content: space-between;
  padding: 12px 0;
  border-bottom: 1px solid #f1f5f9;
  color: #475569;
}

.state {
  color: #64748b;
  text-align: center;
  padding: 60px 0;
}

.error {
  color: #dc2626;
  text-align: center;
}
</style>
