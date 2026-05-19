<template>
  <div id="app-container">
    <div id="controls-panel">
      <h2>PI-AK Collaboration Rasdaman Demo</h2>
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
        <label for="position">Year:</label>
        <select id="position" v-model="selectedPosition" @change="updateLayers">
          <option value="0">2069</option>
          <option value="1">2099</option>
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
        <h3>Mean Precipitation (mm/day)</h3>
        <div class="map" ref="mapContainer1">
          <div class="legend">
            <div class="legend-item">
              <div class="legend-swatch" style="background-color: rgba(237, 248, 233, 1);"></div>
              <span class="legend-value">&ge; 0, &lt; 2</span>
            </div>
            <div class="legend-item">
              <div class="legend-swatch" style="background-color: rgba(186, 228, 179, 1);"></div>
              <span class="legend-value">&ge; 2, &lt; 4</span>
            </div>
            <div class="legend-item">
              <div class="legend-swatch" style="background-color: rgba(116, 196, 118, 1);"></div>
              <span class="legend-value">&ge; 4, &lt; 6</span>
            </div>
            <div class="legend-item">
              <div class="legend-swatch" style="background-color: rgba(49, 163, 84, 1);"></div>
              <span class="legend-value">&ge; 6, &lt; 8</span>
            </div>
            <div class="legend-item">
              <div class="legend-swatch" style="background-color: rgba(0, 109, 44, 1);"></div>
              <span class="legend-value">&ge; 8</span>
            </div>
          </div>
        </div>
      </div>
      <div class="map-panel">
        <h3>Delta From Observed (&Delta; mm/day)</h3>
        <div class="map" ref="mapContainer2">
          <div class="legend">
            <div class="legend-item">
              <div class="legend-swatch" style="background-color: rgba(254, 229, 217, 1);"></div>
              <span class="legend-value">&ge; +0, &lt; +1</span>
            </div>
            <div class="legend-item">
              <div class="legend-swatch" style="background-color: rgba(252, 174, 145, 1);"></div>
              <span class="legend-value">&ge; +1, &lt; +2</span>
            </div>
            <div class="legend-item">
              <div class="legend-swatch" style="background-color: rgba(251, 106, 74, 1);"></div>
              <span class="legend-value">&ge; +2, &lt; +3</span>
            </div>
            <div class="legend-item">
              <div class="legend-swatch" style="background-color: rgba(222, 45, 38, 1);"></div>
              <span class="legend-value">&ge; +3, &lt; +4</span>
            </div>
            <div class="legend-item">
              <div class="legend-swatch" style="background-color: rgba(165, 15, 21, 1);"></div>
              <span class="legend-value">&ge; +4</span>
            </div>
          </div>
        </div>
      </div>
      <div class="map-panel">
        <h3>Mean for &gt;3 Deltas Only (mm/day)</h3>
        <div class="map" ref="mapContainer3">
          <div class="legend">
            <div class="legend-item">
              <div class="legend-swatch" style="background-color: rgba(237, 248, 233, 1);"></div>
              <span class="legend-value">&ge; 0, &lt; 2</span>
            </div>
            <div class="legend-item">
              <div class="legend-swatch" style="background-color: rgba(186, 228, 179, 1);"></div>
              <span class="legend-value">&ge; 2, &lt; 4</span>
            </div>
            <div class="legend-item">
              <div class="legend-swatch" style="background-color: rgba(116, 196, 118, 1);"></div>
              <span class="legend-value">&ge; 4, &lt; 6</span>
            </div>
            <div class="legend-item">
              <div class="legend-swatch" style="background-color: rgba(49, 163, 84, 1);"></div>
              <span class="legend-value">&ge; 6, &lt; 8</span>
            </div>
            <div class="legend-item">
              <div class="legend-swatch" style="background-color: rgba(0, 109, 44, 1);"></div>
              <span class="legend-value">&ge; 8</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'

const mapContainer1 = ref<HTMLElement | null>(null)
const mapContainer2 = ref<HTMLElement | null>(null)
const mapContainer3 = ref<HTMLElement | null>(null)
let map1: any = null
let map2: any = null
let map3: any = null
let wmsLayer1: any = null
let wmsLayer2: any = null
let wmsLayer3: any = null
let L: any = null

// Dimension selections
const selectedModel = ref('0')
const selectedScenario = ref('0')
const selectedPosition = ref('0')
const selectedSeason = ref('0')

const updateLayers = () => {
  if (!L || !map1 || !map2 || !map3) return

  // Remove existing WMS layers
  if (wmsLayer1) {
    map1.removeLayer(wmsLayer1)
  }
  if (wmsLayer2) {
    map2.removeLayer(wmsLayer2)
  }
  if (wmsLayer3) {
    map3.removeLayer(wmsLayer3)
  }

  // Add new WMS layer for means
  wmsLayer1 = L.tileLayer.wms('https://zeus.snap.uaf.edu/rasdaman/ows', {
    layers: 'piak_collab',
    format: 'image/png',
    transparent: true,
    version: '1.3.0',
    crs: L.CRS.EPSG4326,
    styles: 'mean',
    dim_model: selectedModel.value,
    dim_scenario: selectedScenario.value,
    dim_position: selectedPosition.value,
    dim_season: selectedSeason.value
  }).addTo(map1)

  // Add new WMS layer for deltas
  wmsLayer2 = L.tileLayer.wms('https://zeus.snap.uaf.edu/rasdaman/ows', {
    layers: 'piak_collab',
    format: 'image/png',
    transparent: true,
    version: '1.3.0',
    crs: L.CRS.EPSG4326,
    styles: 'delta',
    dim_model: selectedModel.value,
    dim_scenario: selectedScenario.value,
    dim_position: selectedPosition.value,
    dim_season: selectedSeason.value
  }).addTo(map2)

  // Add new WMS layer for experiment
  wmsLayer3 = L.tileLayer.wms('https://zeus.snap.uaf.edu/rasdaman/ows', {
    layers: 'piak_collab',
    format: 'image/png',
    transparent: true,
    version: '1.3.0',
    crs: L.CRS.EPSG4326,
    styles: 'mean_for_large_deltas',
    dim_model: selectedModel.value,
    dim_scenario: selectedScenario.value,
    dim_position: selectedPosition.value,
    dim_season: selectedSeason.value
  }).addTo(map3)

  console.log('Updated layers with dimensions:', {
    dim_model: selectedModel.value,
    dim_scenario: selectedScenario.value,
    dim_position: selectedPosition.value,
    dim_season: selectedSeason.value
  })
}

onMounted(async () => {
  // Only run on client side
  if (process.server) return
  
  await nextTick()
  
  console.log('Components mounted:', mapContainer1.value, mapContainer2.value, mapContainer3.value)
  
  try {
    // Dynamically import Leaflet only on client side
    L = (await import('leaflet')).default
    console.log('Leaflet loaded:', L)

    const mapOptions = {
      crs: L.CRS.EPSG4326,
      center: [20.25, -156.55],
      zoom: 6,
      zoomSnap: 0.1,
      zoomControl: false
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

    // Initialize third map (Experiment)
    if (mapContainer3.value) {
      map3 = L.map(mapContainer3.value, mapOptions)
      console.log('Map 3 initialized with EPSG:4326:', map3)

      // Add base tile layer
      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
        attribution: '© OpenStreetMap contributors',
        noWrap: true
      }).addTo(map3)
    }

    // Fix for map tiles not loading properly
    setTimeout(() => {
      if (map1) map1.invalidateSize()
      if (map2) map2.invalidateSize()
      if (map3) map3.invalidateSize()
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
  max-width: 33.333%;
}

.map-panel h3 {
  margin: 0 0 10px 0;
  padding: 10px;
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
  position: relative;
}

.legend {
  position: absolute;
  bottom: 10px;
  left: 10px;
  background: #fefefe;
  padding: 10px;
  /* border-radius: 4px; */
  /* box-shadow: 0 2px 4px rgba(0,0,0,0.3); */
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
  /* border-radius: 2px; */
}

.legend-value {
  /* font-weight: 500; */
  color: #333;
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
