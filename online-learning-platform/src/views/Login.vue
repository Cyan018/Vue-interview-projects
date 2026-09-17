<template>
  <div class="login card">
    <h2>登录</h2>
    <p class="hint">演示账号：admin，密码：123456</p>
    <form @submit.prevent="handleSubmit">
      <label>用户名</label>
      <input v-model.trim="form.username" class="input" type="text" placeholder="请输入用户名" />
      <label>密码</label>
      <input v-model.trim="form.password" class="input" type="password" placeholder="请输入密码" />
      <p v-if="error" class="error">{{ error }}</p>
      <button class="btn" type="submit" :disabled="loading">
        {{ loading ? '登录中...' : '登录' }}
      </button>
    </form>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '../stores/user'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const loading = ref(false)
const error = ref('')
const form = reactive({
  username: 'admin',
  password: '123456'
})

async function handleSubmit() {
  if (!form.username || !form.password) {
    error.value = '请输入用户名和密码'
    return
  }
  loading.value = true
  error.value = ''
  try {
    await userStore.login(form)
    await userStore.fetchUserInfo()
    router.replace(route.query.redirect || '/')
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login {
  width: min(400px, 92vw);
  margin: 48px auto;
}

form {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

label {
  font-size: 14px;
  color: #475569;
}

.hint {
  color: #94a3b8;
  font-size: 13px;
}
</style>
