<template>
  <header class="header">
    <div class="header-inner">
      <RouterLink class="brand" to="/">在线学习平台</RouterLink>
      <nav class="nav">
        <RouterLink to="/">首页</RouterLink>
        <RouterLink to="/resources">资源浏览</RouterLink>
        <RouterLink to="/profile">个人中心</RouterLink>
      </nav>
      <div class="user">
        <template v-if="userStore.isLogin">
          <span>{{ userStore.displayName }}</span>
          <button class="link-btn" type="button" @click="handleLogout">退出</button>
        </template>
        <RouterLink v-else to="/login">登录</RouterLink>
      </div>
    </div>
  </header>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/user'

const router = useRouter()
const userStore = useUserStore()

function handleLogout() {
  userStore.logout()
  router.push('/login')
}
</script>

<style scoped>
.header {
  background: #fff;
  border-bottom: 1px solid #e5e7eb;
}

.header-inner {
  width: min(1080px, 92vw);
  margin: 0 auto;
  display: flex;
  align-items: center;
  gap: 28px;
  height: 60px;
}

.brand {
  font-weight: 700;
  color: #111827;
}

.nav {
  display: flex;
  gap: 18px;
  flex: 1;
}

.nav a {
  color: #4b5563;
}

.user {
  display: flex;
  align-items: center;
  gap: 12px;
}

.link-btn {
  border: 0;
  background: transparent;
  color: #2563eb;
  cursor: pointer;
}
</style>
