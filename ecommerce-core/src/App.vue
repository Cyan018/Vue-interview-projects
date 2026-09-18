<template>
  <div class="app">
    <header class="header">
      <button class="icon-btn" type="button" @click="drawerOpen = true">☰</button>
      <RouterLink class="brand" to="/">Cyan 的商城</RouterLink>
      <div class="spacer"></div>
      <RouterLink class="cart-link" to="/cart">
        <el-badge :value="cartStore.totalCount" :hidden="cartStore.totalCount === 0">
          <span class="cart-icon">🛒</span>
        </el-badge>
      </RouterLink>
    </header>

    <aside class="sidebar" :class="{ open: drawerOpen }">
      <div class="sidebar-head">Cyan 的商城</div>
      <nav class="sidebar-nav">
        <RouterLink to="/" @click="drawerOpen = false">商品首页</RouterLink>
        <RouterLink to="/cart" @click="drawerOpen = false">购物车</RouterLink>
        <RouterLink to="/orders" @click="drawerOpen = false">我的订单</RouterLink>
        <RouterLink to="/lottery" @click="drawerOpen = false">营销抽奖</RouterLink>
      </nav>
    </aside>
    <div v-if="drawerOpen" class="mask" @click="drawerOpen = false"></div>

    <main class="main">
      <RouterView />
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useCartStore } from './stores/cart'

const cartStore = useCartStore()
const drawerOpen = ref(false)
</script>

<style scoped>
.app {
  min-height: 100vh;
  background: transparent;
}

.header {
  position: sticky;
  top: 0;
  z-index: 20;
  height: 64px;
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 0 24px;
  background: rgba(255, 255, 255, 0.58);
  color: var(--text);
  border-bottom: 1px solid var(--glass-border);
  backdrop-filter: blur(20px) saturate(1.12);
  -webkit-backdrop-filter: blur(20px) saturate(1.12);
}

.icon-btn {
  border: 1px solid rgba(63, 64, 62, 0.35);
  background: transparent;
  color: var(--text);
  width: 34px;
  height: 34px;
  border-radius: 8px;
  cursor: pointer;
}

.brand {
  color: var(--text);
  font-weight: 700;
  letter-spacing: 1px;
}

.spacer {
  flex: 1;
}

.cart-link {
  color: var(--text);
}

.cart-icon {
  font-size: 24px;
}

.sidebar {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 40;
  width: 260px;
  height: 100vh;
  padding: 24px;
  background: rgba(255, 255, 255, 0.78);
  color: var(--text);
  border-right: 1px solid var(--glass-border);
  backdrop-filter: blur(24px) saturate(1.15);
  -webkit-backdrop-filter: blur(24px) saturate(1.15);
  transform: translateX(-100%);
  transition: transform 0.25s ease;
}

.sidebar.open {
  transform: translateX(0);
}

.sidebar-head {
  margin-bottom: 30px;
  font-size: 20px;
  font-weight: 700;
  color: var(--text);
}

.sidebar-nav {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.sidebar-nav a {
  color: var(--text);
  font-size: 16px;
}

.mask {
  position: fixed;
  inset: 0;
  z-index: 30;
  background: rgba(60, 60, 55, 0.18);
}

.main {
  min-height: calc(100vh - 64px);
}
</style>
