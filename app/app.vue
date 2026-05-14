<template>
  <div id="app-container">
    <div id="controls-panel">
      <h2>Layer Controls</h2>
      <div class="control-group">
        <label for="model">Model:</label>
        <select id="model" v-model="selectedModel" @change="updateLayers">
          <option value="0">ACCESS-CM2</option>
        </select>
      </div>
      <div class="control-group">
        <label for="scenario">Scenario:</label>
        <select id="scenario" v-model="selectedScenario" @change="updateLayers">
          <option value="0">SSP1-2.6</option>
          <option value="1">SSP2-4.5</option>
          <option value="2">SSP3-7.0</option>
          <option value="3">SSP5-8.5</option>
        </select>
      </div>
      <div class="control-group">
        <label for="position">Position:</label>
        <select id="position" v-model="selectedPosition" @change="updateLayers">
          <option value="0">MID</option>
          <option value="1">END</option>
        </select>
      </div>
      <div class="control-group">
        <label for="season">Season:</label>
        <select id="season" v-model="selectedSeason" @change="updateLayers">
          <option value="0">ANNUAL</option>
          <option value="1">DRY</option>
          <option value="2">WET</option>
        </select>
      </div>
    </div>
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
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'

const mapContainer1 = ref<HTMLElement | null>(null)
const mapContainer2 = ref<HTMLElement | null>(null)
let map1: any = null
let map2: any = null
let wmsLayer1: any = null
let wmsLayer2: any = null
let L: any = null

// Dimension selections
const selectedModel = ref('0')
const selectedScenario = ref('0')
const selectedPosition = ref('0')
const selectedSeason = ref('0')

const updateLayers = () => {
  if (!L || !map1 || !map2) return

  // Remove existing WMS layers
  if (wmsLayer1) {
    map1.removeLayer(wmsLayer1)
  }
  if (wmsLayer2) {
    map2.removeLayer(wmsLayer2)
  }

  // Build dimension parameters
  const dimParams = `dim_model=${selectedModel.value}&dim_scenario=${selectedScenario.value}&dim_position=${selectedPosition.value}&dim_season=${selectedSeason.value}`

  // Add new WMS layer for means
  wmsLayer1 = L.tileLayer.wms('https://zeus.snap.uaf.edu/rasdaman/ows?' + dimParams, {
    layers: 'piak_collab',
    format: 'image/png',
    transparent: true,
    version: '1.3.0',
    crs: L.CRS.EPSG4326,
    styles: 'mean'
  }).addTo(map1)

  // Add new WMS layer for deltas
  wmsLayer2 = L.tileLayer.wms('https://zeus.snap.uaf.edu/rasdaman/ows?' + dimParams, {
    layers: 'piak_collab',
    format: 'image/png',
    transparent: true,
    version: '1.3.0',
    crs: L.CRS.EPSG4326,
    styles: 'delta'
  }).addTo(map2)

  console.log('Updated layers with dimensions:', dimParams)
}

onMounted(async () => {
  // Only run on client side
  if (process.server) return
  
  await nextTick()
  
  console.log('Components mounted:', mapContainer1.value, mapContainer2.value)
  
  try {
    // Dynamically import Leaflet only on client side
    L = (await import('leaflet')).default
    console.log('Leaflet loaded:', L)

    const mapOptions = {
      crs: L.CRS.EPSG4326,
      center: [20.25, -157.25],
      zoom: 6
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
    }

    // Fix for map tiles not loading properly
    setTimeout(() => {
      if (map1) map1.invalidateSize()
      if (map2) map2.invalidateSize()
      console.log('Maps invalidated and resized')
      
      // Load initial layers
      updateLayers()
    }, 100)
  } catch (error) {
    console.error('Error initializing maps:', error)
  }
})
</script>

<style scoped>
#app-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100vw;
}

#controls-panel {
  background-color: #2c3e50;
  color: white;
  padding: 20px;
  display: flex;
  gap: 20px;
  align-items: center;
  flex-wrap: wrap;
  box-shadow: 0 2px 8px rgba(0,0,0,0.2);
}

#controls-panel h2 {
  margin: 0;
  font-size: 1.2em;
  width: 100%;
  margin-bottom: 10px;
}

.control-group {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.control-group label {
  font-size: 0.9em;
  font-weight: bold;
}

.control-group select {
  padding: 8px 12px;
  border-radius: 4px;
  border: none;
  background-color: white;
  font-size: 0.95em;
  cursor: pointer;
  min-width: 150px;
}

.control-group select:focus {
  outline: 2px solid #3498db;
}

#maps-wrapper {
  display: flex;
  gap: 20px;
  padding: 20px;
  flex: 1;
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
