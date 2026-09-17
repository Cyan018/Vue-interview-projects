<template>
  <div class="video-player">
    <div class="screen">
      <div class="cover">
        <span v-if="!playing" class="course-title">{{ title }}</span>
        <span v-else class="playing-text">正在播放...</span>
        <button class="play-btn" type="button" :aria-label="playing ? '暂停' : '播放'" @click="togglePlay">
          {{ playing ? '❚❚' : '▶' }}
        </button>
      </div>
      <span class="demo-badge">演示视频占位</span>
    </div>

    <div class="controls">
      <button class="control-btn" type="button" @click="togglePlay">
        {{ playing ? '暂停' : '播放' }}
      </button>
      <div class="progress">
        <div class="progress-bar" :style="{ width: progress + '%' }"></div>
      </div>
      <span class="time">{{ formatTime(currentTime) }} / {{ formatTime(duration) }}</span>
    </div>
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, ref } from 'vue'

const props = defineProps({
  title: {
    type: String,
    default: '课程视频'
  },
  duration: {
    type: Number,
    default: 0
  }
})

const playing = ref(false)
const progress = ref(0)
let timer = null

const currentTime = computed(() => Math.round((props.duration * progress.value) / 100))

function togglePlay() {
  playing.value = !playing.value
  if (playing.value) {
    start()
  } else {
    stop()
  }
}

function start() {
  if (timer) return
  timer = setInterval(() => {
    if (progress.value >= 100) {
      progress.value = 100
      playing.value = false
      stop()
      return
    }
    progress.value = Math.min(100, progress.value + 0.5)
  }, 100)
}

function stop() {
  clearInterval(timer)
  timer = null
}

function formatTime(seconds) {
  const total = Number(seconds) || 0
  const minutes = Math.floor(total / 60)
  const rest = Math.floor(total % 60)
  return `${String(minutes).padStart(2, '0')}:${String(rest).padStart(2, '0')}`
}

onBeforeUnmount(stop)
</script>

<style scoped>
.video-player {
  border-radius: 14px;
  overflow: hidden;
  background: #111827;
}

.screen {
  position: relative;
  aspect-ratio: 16 / 9;
}

.cover {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  background: radial-gradient(circle at 30% 20%, #2563eb, #111827 70%);
}

.course-title {
  max-width: 80%;
  color: #fff;
  font-size: 20px;
  font-weight: 700;
  text-align: center;
}

.playing-text {
  color: #93c5fd;
}

.play-btn {
  width: 64px;
  height: 64px;
  border: 0;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.92);
  color: #1d4ed8;
  font-size: 24px;
  cursor: pointer;
  transition: transform 0.15s ease;
}

.play-btn:hover {
  transform: scale(1.06);
}

.demo-badge {
  position: absolute;
  top: 12px;
  right: 12px;
  padding: 4px 10px;
  border-radius: 999px;
  background: rgba(0, 0, 0, 0.45);
  color: #e5e7eb;
  font-size: 12px;
}

.controls {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  color: #e5e7eb;
}

.control-btn {
  border: 1px solid #374151;
  border-radius: 8px;
  background: #1f2937;
  color: #f9fafb;
  padding: 6px 12px;
  cursor: pointer;
}

.progress {
  flex: 1;
  height: 6px;
  border-radius: 999px;
  background: #374151;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  background: #3b82f6;
}

.time {
  color: #d1d5db;
  font-size: 13px;
  white-space: nowrap;
}
</style>
