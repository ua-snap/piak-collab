<template>
  <div id="map-container">
    <div id="map" ref="mapContainer"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'

const mapContainer = ref<HTMLElement | null>(null)
let map: any = null

onMounted(async () => {
  // Only run on client side
  if (process.server) return
  
  await nextTick()
  
  console.log('Component mounted, mapContainer:', mapContainer.value)
  
  if (mapContainer.value) {
    try {
      // Dynamically import Leaflet only on client side
      const L = (await import('leaflet')).default
      console.log('Leaflet loaded:', L)

      // Initialize the map centered on Alaska
      map = L.map(mapContainer.value).setView([64.8, -147.0], 4)
      console.log('Map initialized:', map)

      // Add a base tile layer (OpenStreetMap)
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap contributors'
      }).addTo(map)
      console.log('Base layer added')

      // Add the WMS layer from SNAP's Rasdaman server
      L.tileLayer.wms('https://zeus.snap.uaf.edu/rasdaman/ows', {
        layers: 'piak_collab_means',
        format: 'image/png',
        transparent: true,
        version: '1.3.0',
        attribution: 'SNAP - University of Alaska Fairbanks'
      }).addTo(map)
      console.log('WMS layer added')

      // Fix for map tiles not loading properly
      setTimeout(() => {
        map.invalidateSize()
        console.log('Map invalidated and resized')
      }, 100)
    } catch (error) {
      console.error('Error initializing map:', error)
    }
  } else {
    console.error('Map container not found!')
  }
})
</script>

<style scoped>
#map-container {
  width: 100vw;
  height: 100vh;
  margin: 0;
  padding: 0;
  background-color: #f0f0f0;
  position: fixed;
  top: 0;
  left: 0;
}

#map {
  width: 100%;
  height: 100%;
  background-color: #e0e0e0;
}
</style>

<style>
html, body {
  margin: 0;
  padding: 0;
  height: 100%;
  overflow: hidden;
}
</style>
