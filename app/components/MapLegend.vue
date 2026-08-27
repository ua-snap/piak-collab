<template>
  <div class="legend">
    <div class="legend-item" v-for="item in items" :key="item.label">
      <div class="legend-swatch" :style="{ backgroundColor: item.color }"></div>
      <span class="legend-value">{{ item.label }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  items: { color: string; label: string }[];
}>();
</script>

<style scoped>
.legend {
  position: absolute;
  bottom: 10px;
  left: 10px;
  background: #fefefe;
  padding: 10px;
  z-index: 1000;
  font-size: 1.2em;
}

.legend-item {
  display: flex;
  align-items: center;
  margin-bottom: 5px;
}

.legend-item:last-child {
  margin-bottom: 0;
}

.legend-swatch {
  width: 15px;
  height: 15px;
  margin-right: 8px;
  border: 1px solid #333;
}

.legend-value {
  color: #333;
}
</style>
