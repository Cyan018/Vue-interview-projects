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

    <el-button type="primary" size="large" :loading="spinning" @click="handleDraw">
      {{ spinning ? '抽奖中...' : '立即抽奖' }}
    </el-button>

    <div class="history">
      <h3>抽奖记录</h3>
      <p v-if="lotteryStore.history.length === 0">暂无记录</p>
      <p v-for="item in lotteryStore.history" :key="item.orderId">
        {{ item.time }} 获得：{{ item.name }}（{{ item.orderId }}）
      </p>
    </div>

    <el-dialog v-model="dialogVisible" title="抽奖结果" width="360px" align-center>
      <div class="result">
        <div class="result-icon">{{ resultPrize?.id === 6 ? '🎁' : '🎟️' }}</div>
        <p class="result-name">{{ resultPrize?.name }}</p>
        <p class="result-tip">奖励已放入账户，感谢参与</p>
      </div>
      <template #footer>
        <el-button type="primary" @click="dialogVisible = false">收下奖励</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useLotteryStore } from '../stores/lottery'

const lotteryStore = useLotteryStore()
const activeId = ref(null)
const spinning = ref(false)
const dialogVisible = ref(false)
const resultPrize = ref(null)

async function handleDraw() {
  if (spinning.value) return
  spinning.value = true
  activeId.value = null
  try {
    const data = await lotteryStore.draw()
    await runSpin(data.prize.id)
    lotteryStore.recordResult(data)
    activeId.value = data.prize.id
    resultPrize.value = data.prize
    dialogVisible.value = true
  } finally {
    spinning.value = false
  }
}

function runSpin(finalId) {
  return new Promise((resolve) => {
    let ticks = 18 + Math.floor(Math.random() * 8)
    let index = 0
    const timer = setInterval(() => {
      index = (index + 1) % lotteryStore.prizes.length
      activeId.value = lotteryStore.prizes[index].id
      ticks -= 1
      if (ticks <= 0) {
        clearInterval(timer)
        activeId.value = finalId
        setTimeout(resolve, 300)
      }
    }, 85)
  })
}
</script>

<style scoped>
.lottery {
  text-align: center;
}

.note {
  color: var(--text-soft);
  font-size: 13px;
}

.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin: 24px 0;
}

.prize {
  background: rgba(255, 255, 255, 0.42);
  border: 2px solid transparent;
  border-radius: 12px;
  padding: 20px 8px;
  color: var(--text-soft);
  transition: background 0.12s ease, border-color 0.12s ease, transform 0.12s ease;
}

.prize.active {
  background: rgba(125, 154, 143, 0.18);
  border-color: var(--accent);
  color: var(--accent-dark);
  transform: scale(1.04);
}

.history {
  margin-top: 28px;
  text-align: left;
}

.history p {
  color: var(--text-soft);
}

.result {
  text-align: center;
}

.result-icon {
  font-size: 56px;
}

.result-name {
  margin: 14px 0 6px;
  font-size: 20px;
  font-weight: 700;
}

.result-tip {
  color: var(--text-soft);
}
</style>
