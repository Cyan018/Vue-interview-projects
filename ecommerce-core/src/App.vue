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
  background: #fff;
}

.header {
  position: sticky;
  top: 0;
  z-index: 20;
  height: 60px;
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 0 24px;
  background: #111;
  color: #fff;
}

.icon-btn {
  border: 1px solid #fff;
  background: transparent;
  color: #fff;
  width: 34px;
  height: 34px;
  cursor: pointer;
}

.brand {
  color: #fff;
  font-weight: 700;
  letter-spacing: 1px;
}

.spacer {
  flex: 1;
}

.cart-link {
  color: #fff;
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
  background: #111;
  color: #fff;
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
}

.sidebar-nav {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.sidebar-nav a {
  color: #e5e7eb;
  font-size: 16px;
}

.mask {
  position: fixed;
  inset: 0;
  z-index: 30;
  background: rgba(0, 0, 0, 0.35);
}

.main {
  min-height: calc(100vh - 60px);
}
</style>
