<template>
  <div id="app-container">
    <div id="controls-panel">
      <h2>PI-AK Collaboration Rasdaman Demo</h2>
      <div class="controls">
        <div class="control-group">
          <label for="model">Model:</label>
          <select id="model" v-model="selectedModel" @change="updateLayers">
            <option value="0">ACCESS-CM2</option>
            <option value="1">ACCESS-ESM1-5</option>
            <option value="2">BCC-CSM2-MR</option>
            <option value="3">CanESM5</option>
            <option value="4">CMCC-ESM2</option>
            <option value="5">CNRM-CM6-1</option>
            <option value="6">CNRM-ESM2-1</option>
            <option value="7">EC-Earth3</option>
            <option value="8">EC-Earth3-Veg-LR</option>
            <option value="9">FGOALS-g3</option>
            <option value="10">GFDL-CM4</option>
            <option value="11">GFDL-ESM4</option>
            <option value="12">GISS-E2-1-G</option>
            <option value="13">HadGEM3-GC31-LL</option>
            <option value="14">HadGEM3-GC31-MM</option>
            <option value="15">INM-CM4-8</option>
            <option value="16">INM-CM5-0</option>
            <option value="17">IPSL-CM6A-LR</option>
            <option value="18">KACE-1-0-G</option>
            <option value="19">KIOST-ESM</option>
            <option value="20">MIROC6</option>
            <option value="21">MIROC-ES2L</option>
            <option value="22">MPI-ESM1-2-HR</option>
            <option value="23">MPI-ESM1-2-LR</option>
            <option value="24">MRI-ESM2-0</option>
            <option value="25">NESM3</option>
            <option value="26">NorESM2-LM</option>
            <option value="27">NorESM2-MM</option>
            <option value="28">TaiESM1</option>
            <option value="29">UKESM1-0-LL</option>
          </select>
        </div>
        <div class="control-group">
          <label for="scenario">Scenario:</label>
          <select id="scenario" v-model="selectedScenario" @change="updateLayers">
            <option value="1">SSP1-2.6</option>
            <option value="2">SSP2-4.5</option>
            <option value="3">SSP3-7.0</option>
            <option value="4">SSP5-8.5</option>
          </select>
        </div>
        <div class="control-group">
          <label for="position">Year:</label>
          <select id="position" v-model="selectedPosition" @change="updateLayers">
            <option value="1">2069</option>
            <option value="2">2099</option>
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
    </div>
    <div class="maps-wrapper">
      <div class="map-panel">
        <h3>Historical Precipitation (mm/day)</h3>
        <div class="map" ref="mapContainer0">
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
        <h3>Projected Precipitation (mm/day)</h3>
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
      </div>
      <div class="maps-wrapper">
        <div class="map-panel">
          <h3>Delta From Historical (&Delta; mm/day)</h3>
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
          <h3>Delta From Historical (%)</h3>
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
    <div id="chart-container">
      <div id="plotly-chart" ref="chartContainer"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'

const mapContainer0 = ref<HTMLElement | null>(null)
const mapContainer1 = ref<HTMLElement | null>(null)
const mapContainer2 = ref<HTMLElement | null>(null)
const mapContainer3 = ref<HTMLElement | null>(null)
const chartContainer = ref<HTMLElement | null>(null)
let map0: any = null
let map1: any = null
let map2: any = null
let map3: any = null
let wmsLayer0: any = null
let wmsLayer1: any = null
let wmsLayer2: any = null
let wmsLayer3: any = null
let L: any = null
let Plotly: any = null

// Markers for click locations
let marker0: any = null
let marker1: any = null
let marker2: any = null
let marker3: any = null

// Dimension selections
const selectedModel = ref('0')
const selectedScenario = ref('1')
const selectedPosition = ref('1')
const selectedSeason = ref('0')

const updateLayers = () => {
  if (!L || !map0 || !map1 || !map2 || !map3) return

  // Remove existing WMS layers
  if (wmsLayer0) {
    map0.removeLayer(wmsLayer0)
  }
  if (wmsLayer1) {
    map1.removeLayer(wmsLayer1)
  }
  if (wmsLayer2) {
    map2.removeLayer(wmsLayer2)
  }
  if (wmsLayer3) {
    map3.removeLayer(wmsLayer3)
  }

  // Add new WMS layer for historical means
  wmsLayer0 = L.tileLayer.wms('https://zeus.snap.uaf.edu/rasdaman/ows', {
    layers: 'piak_collab',
    format: 'image/png',
    transparent: true,
    version: '1.3.0',
    crs: L.CRS.EPSG4326,
    styles: 'mean',
    dim_model: selectedModel.value,
    dim_scenario: 0,
    dim_position: 0,
    dim_season: selectedSeason.value
  }).addTo(map0)

  // Add new WMS layer for projected means
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

  // Add new WMS layer for absolute deltas
  wmsLayer2 = L.tileLayer.wms('https://zeus.snap.uaf.edu/rasdaman/ows', {
    layers: 'piak_collab',
    format: 'image/png',
    transparent: true,
    version: '1.3.0',
    crs: L.CRS.EPSG4326,
    styles: 'delta_abs',
    dim_model: selectedModel.value,
    dim_scenario: selectedScenario.value,
    dim_position: selectedPosition.value,
    dim_season: selectedSeason.value
  }).addTo(map2)

  // Add new WMS layer for percent deltas
  wmsLayer3 = L.tileLayer.wms('https://zeus.snap.uaf.edu/rasdaman/ows', {
    layers: 'piak_collab',
    format: 'image/png',
    transparent: true,
    version: '1.3.0',
    crs: L.CRS.EPSG4326,
    styles: 'delta_pct',
    dim_model: selectedModel.value,
    dim_scenario: selectedScenario.value,
    dim_position: selectedPosition.value,
    dim_season: selectedSeason.value
  }).addTo(map3)
}

const handleMapClick = async (e: any) => {
  if (!L || !Plotly) return

  const lat = e.latlng.lat
  const lng = e.latlng.lng

  // Remove existing markers from all maps
  if (marker0) map0.removeLayer(marker0)
  if (marker1) map1.removeLayer(marker1)
  if (marker2) map2.removeLayer(marker2)
  if (marker3) map3.removeLayer(marker3)

  // Add new markers to all maps at the same location
  marker0 = L.marker([lat, lng]).addTo(map0)
  marker1 = L.marker([lat, lng]).addTo(map1)
  marker2 = L.marker([lat, lng]).addTo(map2)
  marker3 = L.marker([lat, lng]).addTo(map3)

  // Fetch WCS data and create chart
  await fetchDataAndCreateChart(lat, lng)
}

const fetchDataAndCreateChart = async (lat: number, lng: number) => {
  try {
    const model = selectedModel.value
    const position = selectedPosition.value
    const season = selectedSeason.value

    // Fetch historical data (scenario 0, position 0)
    const historicalUrl = `https://zeus.snap.uaf.edu/rasdaman/ows?&SERVICE=WCS&VERSION=2.0.1&REQUEST=GetCoverage&COVERAGEID=piak_collab&SUBSET=Lon(${lng})&SUBSET=Lat(${lat})&SUBSET=model(${model})&SUBSET=scenario(0)&SUBSET=position(0)&SUBSET=season(${season})&RANGESUBSET=mean&FORMAT=application/json`
    const historicalResponse = await fetch(historicalUrl)
    const historicalMean = await historicalResponse.json()

    // Fetch projected data for all 4 scenarios
    const scenarioNames = ['SSP1-2.6', 'SSP2-4.5', 'SSP3-7.0', 'SSP5-8.5']
    const projectedUrl = `https://zeus.snap.uaf.edu/rasdaman/ows?&SERVICE=WCS&VERSION=2.0.1&REQUEST=GetCoverage&COVERAGEID=piak_collab&SUBSET=Lon(${lng})&SUBSET=Lat(${lat})&SUBSET=model(${model})&SUBSET=position(${position})&SUBSET=season(${season})&RANGESUBSET=mean&FORMAT=application/json`
    const projectedResponse = await fetch(projectedUrl)
    const projectedMeans = await projectedResponse.json()

    // Remove the first (null historical) element from projectedData
    projectedMeans.shift()

    // Create Plotly chart
    const xLabels = ['Historical', ...scenarioNames]
    const yValues = [historicalMean, ...projectedMeans]

    const trace = {
      x: xLabels,
      y: yValues,
      mode: 'markers',
      type: 'scatter',
      marker: {
        color: ['#4a90e2', '#e27a4a', '#e2c44a', '#e24a4a', '#a14ae2'],
        size: 10
      }
    }

    const layout = {
      title: `Precipitation at (${lat.toFixed(2)}, ${lng.toFixed(2)})`,
      xaxis: {
        title: 'Scenario'
      },
      yaxis: {
        title: 'Mean Precipitation (mm/day)'
      },
      margin: { t: 50, b: 80, l: 60, r: 30 }
    }

    if (chartContainer.value) {
      Plotly.newPlot(chartContainer.value, [trace], layout)
    }
  } catch (error) {
    console.error('Error fetching WCS data or creating chart:', error)
  }
}

onMounted(async () => {
  // Only run on client side
  if (process.server) return

  await nextTick()

  try {
    // Dynamically import Leaflet and Plotly only on client side
    L = (await import('leaflet')).default
    Plotly = (await import('plotly.js-dist-min')).default

    const mapOptions = {
      crs: L.CRS.EPSG4326,
      center: [20.4, -157.3],
      zoom: 6,
      zoomSnap: 0.1,
      zoomControl: false,
      dragging: false,
      scrollWheelZoom: false,
      doubleClickZoom: false,
      touchZoom: false,
      boxZoom: false
    }

    // Initialize first map (Means)
    if (mapContainer0.value) {
      map0 = L.map(mapContainer0.value, mapOptions)

      // Add base tile layer
      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
        attribution: '© OpenStreetMap contributors',
        noWrap: true
      }).addTo(map0)

      // Add click handler
      map0.on('click', handleMapClick)
    }

    // Initialize first map (Means)
    if (mapContainer1.value) {
      map1 = L.map(mapContainer1.value, mapOptions)

      // Add base tile layer
      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
        attribution: '© OpenStreetMap contributors',
        noWrap: true
      }).addTo(map1)

      // Add click handler
      map1.on('click', handleMapClick)
    }

    // Initialize second map (Delta from Observed)
    if (mapContainer2.value) {
      map2 = L.map(mapContainer2.value, mapOptions)

      // Add base tile layer
      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
        attribution: '© OpenStreetMap contributors',
        noWrap: true
      }).addTo(map2)

      // Add click handler
      map2.on('click', handleMapClick)
    }

    // Initialize third map (Percent Delta from Observed)
    if (mapContainer3.value) {
      map3 = L.map(mapContainer3.value, mapOptions)

      // Add base tile layer
      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
        attribution: '© OpenStreetMap contributors',
        noWrap: true
      }).addTo(map3)

      // Add click handler
      map3.on('click', handleMapClick)
    }

    // Fix for map tiles not loading properly
    setTimeout(() => {
      if (map0) map0.invalidateSize()
      if (map1) map1.invalidateSize()
      if (map2) map2.invalidateSize()
      if (map3) map3.invalidateSize()

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
  margin-bottom: 200px;
}

.controls {
  margin: 0 auto;
  display: flex;
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
  text-align: center;
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
  margin: 0 15px;
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

.maps-wrapper {
  display: flex;
  gap: 20px;
  padding: 20px;
  flex: 1;
  box-sizing: border-box;
  margin: 0 auto;
}

.map-panel {
  width: 500px;
}

.map-panel h3 {
  margin: 0 0 10px 0;
  padding: 10px;
  text-align: center;
  font-family: Arial, sans-serif;
  border-radius: 4px;
}

.map {
  width: 500px;
  height: 400px;
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

.leaflet-container {
    cursor: pointer;
}

#chart-container {
  margin: 20px auto;
  padding: 20px;
  width: 1020px;
  background-color: white;
}

#chart-container h3 {
  margin: 0 0 20px 0;
  text-align: center;
  font-family: Arial, sans-serif;
  color: #2c3e50;
}

#plotly-chart {
  width: 100%;
  min-height: 400px;
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
