<template>
  <div v-if="loading" class="map-loading-overlay" role="status" aria-live="polite">
    <div class="map-loading-box">
      <svg class="map-loading-spinner" viewBox="0 0 50 50" aria-hidden="true" focusable="false">
        <circle class="map-loading-track" cx="25" cy="25" r="20" fill="none" stroke-width="5" />
        <circle class="map-loading-arc" cx="25" cy="25" r="20" fill="none" stroke-width="5"
          stroke-linecap="round" stroke-dasharray="90 126" />
      </svg>
      <span class="map-loading-text">{{ label }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  loading: boolean
  label?: string
}>(), {
  label: 'Loading map...'
})
</script>

<style scoped>
.map-loading-overlay {
  position: absolute;
  inset: 0;
  z-index: 1100;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(224, 224, 224, 0.75);
  border-radius: 4px;
  /* Purely decorative: never intercept clicks meant for the map underneath. */
  pointer-events: none;
  animation: map-loading-fade-in 0.2s ease-out;
}

.map-loading-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: 16px 22px;
  background: rgba(254, 254, 254, 0.9);
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.map-loading-spinner {
  width: 44px;
  height: 44px;
  animation: map-loading-spin 1s linear infinite;
}

.map-loading-track {
  stroke: #cccccc;
}

.map-loading-arc {
  stroke: #555555;
}

.map-loading-text {
  color: #333333;
  font-family: Arial, sans-serif;
  font-size: 1.1em;
  font-weight: bold;
}

@keyframes map-loading-spin {
  to { transform: rotate(360deg); }
}

@keyframes map-loading-fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

@media (prefers-reduced-motion: reduce) {
  .map-loading-spinner {
    animation-duration: 3s;
  }

  .map-loading-overlay {
    animation: none;
  }
}
</style>
