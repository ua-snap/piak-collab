<template>
  <div id="maps-wrapper">
    <div class="map-panel">
      <h3>Means</h3>
      <div class="map" ref="mapContainer1"></div>
    </div>
    <div class="map-panel">
      <h3>Deltas</h3>
      <div class="map" ref="mapContainer2"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'

const mapContainer1 = ref<HTMLElement | null>(null)
const mapContainer2 = ref<HTMLElement | null>(null)
let map1: any = null
let map2: any = null

onMounted(async () => {
  // Only run on client side
  if (process.server) return
  
  await nextTick()
  
  console.log('Components mounted:', mapContainer1.value, mapContainer2.value)
  
  try {
    // Dynamically import Leaflet only on client side
    const L = (await import('leaflet')).default
    console.log('Leaflet loaded:', L)

    const mapOptions = {
      crs: L.CRS.EPSG4326,
      center: [64.8, -147.0],
      zoom: 4
    }

    // Initialize first map (Means)
    if (mapContainer1.value) {
      map1 = L.map(mapContainer1.value, mapOptions)
      console.log('Map 1 initialized with EPSG:4326:', map1)

      // Add base tile layer
      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
        attribution: '© OpenStreetMap contributors',
        noWrap: true
      }).addTo(map1)

      // Add the piak_collab_means WMS layer
      L.tileLayer.wms('https://zeus.snap.uaf.edu/rasdaman/ows', {
        layers: 'piak_collab_means',
        format: 'image/png',
        transparent: true,
        version: '1.3.0',
        crs: L.CRS.EPSG4326,
        attribution: 'SNAP - University of Alaska Fairbanks'
      }).addTo(map1)
      console.log('WMS layer (means) added to map 1')
    }

    // Initialize second map (Deltas)
    if (mapContainer2.value) {
      map2 = L.map(mapContainer2.value, mapOptions)
      console.log('Map 2 initialized with EPSG:4326:', map2)

      // Add base tile layer
      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
        attribution: '© OpenStreetMap contributors',
        noWrap: true
      }).addTo(map2)

      // Add the piak_collab_deltas WMS layer
      L.tileLayer.wms('https://zeus.snap.uaf.edu/rasdaman/ows', {
        layers: 'piak_collab_deltas',
        format: 'image/png',
        transparent: true,
        version: '1.3.0',
        crs: L.CRS.EPSG4326,
        attribution: 'SNAP - University of Alaska Fairbanks'
      }).addTo(map2)
      console.log('WMS layer (deltas) added to map 2')
    }

    // Fix for map tiles not loading properly
    setTimeout(() => {
      if (map1) map1.invalidateSize()
      if (map2) map2.invalidateSize()
      console.log('Maps invalidated and resized')
    }, 100)
  } catch (error) {
    console.error('Error initializing maps:', error)
  }
})
</script>

<style scoped>
#maps-wrapper {
  display: flex;
  gap: 20px;
  padding: 20px;
  height: 100vh;
  width: 100vw;
  box-sizing: border-box;
  background-color: #f5f5f5;
}

.map-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  max-width: 50%;
}

.map-panel h3 {
  margin: 0 0 10px 0;
  padding: 10px;
  background-color: #333;
  color: white;
  text-align: center;
  font-family: Arial, sans-serif;
  border-radius: 4px;
}

.map {
  flex: 1;
  width: 100%;
  background-color: #e0e0e0;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}
</style>

<style>
html, body {
  margin: 0;
  padding: 0;
  height: 100%;
  font-family: Arial, sans-serif;
}
</style>
