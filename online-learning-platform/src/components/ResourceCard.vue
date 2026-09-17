<template>
  <RouterLink class="resource card" :to="`/resources/${resource.id}`">
    <div class="tags">
      <span class="tag">{{ resource.category }}</span>
      <span class="tag level">{{ resource.level }}</span>
    </div>
    <h3>{{ resource.title }}</h3>
    <p>{{ resource.summary }}</p>
    <div class="meta">{{ resource.duration }} · {{ resource.instructor }}</div>
  </RouterLink>
</template>

<script setup>
defineProps({
  resource: {
    type: Object,
    required: true
  }
})
</script>

<style scoped>
.resource {
  display: block;
  color: inherit;
  transition: transform 0.15s ease;
}

.resource:hover {
  transform: translateY(-3px);
}

.tags {
  display: flex;
  gap: 8px;
}

.tag {
  display: inline-block;
  background: #eff6ff;
  color: #2563eb;
  border-radius: 999px;
  padding: 3px 10px;
  font-size: 12px;
}

.tag.level {
  background: #ecfdf5;
  color: #059669;
}

h3 {
  margin: 14px 0 8px;
}

p {
  color: #64748b;
  font-size: 14px;
  margin: 0 0 14px;
}

.meta {
  color: #94a3b8;
  font-size: 13px;
}
</style>
