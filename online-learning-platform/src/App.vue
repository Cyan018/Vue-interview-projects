<template>
  <div class="app">
    <AppHeader />
    <main class="container">
      <RouterView />
    </main>
  </div>
</template>

<script setup>
import AppHeader from './components/AppHeader.vue'
</script>
