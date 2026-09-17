<template>
  <div class="lottery card">
    <h2>营销抽奖</h2>
    <p class="note">前端只负责展示，中奖结果由接口返回，避免前端自行决定中奖。</p>

    <div class="grid">
      <div
        v-for="prize in lotteryStore.prizes"
        :key="prize.id"
        class="prize"
        :class="{ active: activeId === prize.id }"
      >
        {{ prize.name }}
      </div>
    </div>

    <el-button type="primary" size="large" :loading="lotteryStore.drawing" @click="handleDraw">
      立即抽奖
    </el-button>

    <div class="history">
      <h3>抽奖记录</h3>
      <p v-if="lotteryStore.history.length === 0">暂无记录</p>
      <p v-for="item in lotteryStore.history" :key="item.orderId">
        {{ item.time }} 获得：{{ item.name }}（{{ item.orderId }}）
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useLotteryStore } from '../stores/lottery'

const lotteryStore = useLotteryStore()
const activeId = ref(null)

async function handleDraw() {
  const data = await lotteryStore.draw()
  activeId.value = data.prize.id
  ElMessage.success(`恭喜获得：${data.prize.name}`)
}
</script>

<style scoped>
.lottery {
  text-align: center;
}

.note {
  color: #94a3b8;
  font-size: 13px;
}

.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin: 24px 0;
}

.prize {
  background: #f1f5f9;
  border: 2px solid transparent;
  border-radius: 12px;
  padding: 20px 8px;
  color: #475569;
}

.prize.active {
  background: #fff7ed;
  border-color: #f97316;
  color: #c2410c;
}

.history {
  margin-top: 28px;
  text-align: left;
}

.history p {
  color: #64748b;
}
</style>
