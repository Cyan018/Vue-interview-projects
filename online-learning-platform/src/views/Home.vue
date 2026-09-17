<template>
  <section class="hero card">
    <h1>Vue 3 + Pinia 在线学习平台</h1>
    <p>这个项目演示登录鉴权、路由守卫、状态管理和 RESTful 接口交互。</p>
    <RouterLink class="btn" to="/resources">开始浏览资源</RouterLink>
  </section>
</template>

<script setup></script>

<style scoped>
.hero {
  text-align: center;
  padding: 64px 24px;
}

.hero h1 {
  margin: 0 0 12px;
}

.hero p {
  color: #64748b;
  margin-bottom: 24px;
}
</style>
