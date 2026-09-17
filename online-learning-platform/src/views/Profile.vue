<template>
  <div class="profile card">
    <h2>个人中心</h2>
    <div v-if="userStore.userInfo">
      <form @submit.prevent="handleSave">
        <label>用户名</label>
        <input class="input" type="text" :value="userStore.userInfo.username" disabled />
        <label>昵称</label>
        <input v-model.trim="form.name" class="input" type="text" />
        <label>邮箱</label>
        <input v-model.trim="form.email" class="input" type="email" />
        <button class="btn" type="submit" :disabled="saving">
          {{ saving ? '保存中...' : '保存修改' }}
        </button>
      </form>
      <p v-if="message" class="message">{{ message }}</p>
    </div>
    <p v-else class="state">加载中...</p>
  </div>
</template>

<script setup>
import { onMounted, reactive, ref, watch } from 'vue'
import { useUserStore } from '../stores/user'

const userStore = useUserStore()
const saving = ref(false)
const message = ref('')
const form = reactive({
  name: '',
  email: ''
})

watch(
  () => userStore.userInfo,
  (info) => {
    if (info) {
      form.name = info.name
      form.email = info.email
    }
  },
  { immediate: true }
)

onMounted(async () => {
  if (!userStore.userInfo) {
    await userStore.fetchUserInfo()
  }
})

async function handleSave() {
  saving.value = true
  message.value = ''
  try {
    await userStore.updateUserInfo(form)
    message.value = '保存成功'
  } finally {
    saving.value = false
  }
}
</script>

<style scoped>
.profile {
  width: min(480px, 92vw);
  margin: 32px auto;
}

form {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

label {
  color: #475569;
  font-size: 14px;
}

.message {
  color: #16a34a;
}

.state {
  color: #64748b;
  text-align: center;
}
</style>
