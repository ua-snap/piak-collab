<template>
  <div id="app-container">
    <div id="header">
      <h2 class="title is-4 has-text-white">
        PI-AK Collaboration Rasdaman Demo
      </h2>
    </div>
    <div class="overview-map-wrapper">
      <div class="overview-map-panel">
        <h3 class="title is-3">
          Variation of 30 GCM models of Projected Precipitation across Hawaii
        </h3>
        <h4 class="title is-4 has-text-centered">
          CMIP6, Dry Season, 2070&ndash;2099, SSP3-7.0
        </h4>
        <div class="overview-map" ref="mapContainer0">
          <MapLoadingOverlay :loading="mapsLoading[0]" />
          <div class="legend">
            <div class="legend-item">
              <div
                class="legend-swatch"
                style="background-color: rgba(247, 247, 247, 1)"
              ></div>
              <span class="legend-value">&ge; 0, &lt; 2 &Delta; mm/day</span>
            </div>
            <div class="legend-item">
              <div
                class="legend-swatch"
                style="background-color: rgba(204, 204, 204, 1)"
              ></div>
              <span class="legend-value">&ge; 2, &lt; 4 &Delta; mm/day</span>
            </div>
            <div class="legend-item">
              <div
                class="legend-swatch"
                style="background-color: rgba(150, 150, 150, 1)"
              ></div>
              <span class="legend-value">&ge; 4, &lt; 6 &Delta; mm/day</span>
            </div>
            <div class="legend-item">
              <div
                class="legend-swatch"
                style="background-color: rgba(99, 99, 99, 1)"
              ></div>
              <span class="legend-value">&ge; 6, &lt; 8 &Delta; mm/day</span>
            </div>
            <div class="legend-item">
              <div
                class="legend-swatch"
                style="background-color: rgba(37, 37, 37, 1)"
              ></div>
              <span class="legend-value">&ge; 8 &Delta; mm/day</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="container">
      <div class="content is-size-5 mt-6">
        <p>
          The following controls allow you to select a model, scenario, era, and
          season. Click on any of the maps below to see a chart of the
          corresponding variable at that location. When the "aggregate models"
          mode is enabled, each map shows the range of values across all 30
          models (max - min), and the charts show box plots of the distribution
          of values across all models for each scenario.
        </p>
      </div>
    </div>
    <div id="controls-panel">
      <div class="controls">
        <div class="field">
          <label class="label" for="model">Model</label>
          <div class="control">
            <div class="select">
              <select
                id="model"
                v-model="selectedModel"
                @change="updateLayers"
                :disabled="aggregateView"
              >
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
          </div>
        </div>
        <div class="field">
          <label class="label" for="scenario">Scenario</label>
          <div class="control">
            <div class="select">
              <select
                id="scenario"
                v-model="selectedScenario"
                @change="updateLayers"
              >
                <option value="1">SSP1-2.6</option>
                <option value="2">SSP2-4.5</option>
                <option value="3">SSP3-7.0</option>
                <option value="4">SSP5-8.5</option>
              </select>
            </div>
          </div>
        </div>
        <div class="field">
          <label class="label" for="position">Era</label>
          <div class="control">
            <div class="select">
              <select
                id="position"
                v-model="selectedPosition"
                @change="updateLayers"
              >
                <option value="1">2040-2069</option>
                <option value="2">2070-2099</option>
              </select>
            </div>
          </div>
        </div>
        <div class="field">
          <label class="label" for="season">Season</label>
          <div class="control">
            <div class="select">
              <select
                id="season"
                v-model="selectedSeason"
                @change="updateLayers"
              >
                <option value="0">Annual</option>
                <option value="1">Dry</option>
                <option value="2">Wet</option>
              </select>
            </div>
          </div>
        </div>
        <div class="field switch-field">
          <div class="control">
            <label class="switch is-rounded is-info">
              <input
                id="aggregate-view"
                type="checkbox"
                v-model="aggregateView"
              />
              <span class="check"></span>
              <span class="control-label">Aggregate models</span>
            </label>
          </div>
        </div>
      </div>
    </div>
    <div class="maps-wrapper">
      <div class="map-panel">
        <h3 v-if="!aggregateView">Projected Precipitation (mm/day)</h3>
        <h3 v-else>Projected Precipitation, Model Range (&Delta; mm/day)</h3>
        <div class="map" ref="mapContainer1">
          <MapLoadingOverlay :loading="mapsLoading[1]" />
          <div class="legend" v-if="!aggregateView">
            <div class="legend-item">
              <div
                class="legend-swatch"
                style="background-color: rgba(237, 248, 233, 1)"
              ></div>
              <span class="legend-value">&ge; 0, &lt; 2</span>
            </div>
            <div class="legend-item">
              <div
                class="legend-swatch"
                style="background-color: rgba(186, 228, 179, 1)"
              ></div>
              <span class="legend-value">&ge; 2, &lt; 4</span>
            </div>
            <div class="legend-item">
              <div
                class="legend-swatch"
                style="background-color: rgba(116, 196, 118, 1)"
              ></div>
              <span class="legend-value">&ge; 4, &lt; 6</span>
            </div>
            <div class="legend-item">
              <div
                class="legend-swatch"
                style="background-color: rgba(49, 163, 84, 1)"
              ></div>
              <span class="legend-value">&ge; 6, &lt; 8</span>
            </div>
            <div class="legend-item">
              <div
                class="legend-swatch"
                style="background-color: rgba(0, 109, 44, 1)"
              ></div>
              <span class="legend-value">&ge; 8</span>
            </div>
          </div>
          <div class="legend" v-else>
            <div class="legend-item">
              <div
                class="legend-swatch"
                style="background-color: rgba(247, 247, 247, 1)"
              ></div>
              <span class="legend-value">&ge; 0, &lt; 2</span>
            </div>
            <div class="legend-item">
              <div
                class="legend-swatch"
                style="background-color: rgba(204, 204, 204, 1)"
              ></div>
              <span class="legend-value">&ge; 2, &lt; 4</span>
            </div>
            <div class="legend-item">
              <div
                class="legend-swatch"
                style="background-color: rgba(150, 150, 150, 1)"
              ></div>
              <span class="legend-value">&ge; 4, &lt; 6</span>
            </div>
            <div class="legend-item">
              <div
                class="legend-swatch"
                style="background-color: rgba(99, 99, 99, 1)"
              ></div>
              <span class="legend-value">&ge; 6, &lt; 8</span>
            </div>
            <div class="legend-item">
              <div
                class="legend-swatch"
                style="background-color: rgba(37, 37, 37, 1)"
              ></div>
              <span class="legend-value">&ge; 8</span>
            </div>
          </div>
        </div>
      </div>
      <div class="map-panel">
        <h3 v-if="!aggregateView">Delta From Historical (&Delta; mm/day)</h3>
        <h3 v-else>
          Delta From Historical, Model Range (&Delta;<sup>2</sup> mm/day)
        </h3>
        <div class="map" ref="mapContainer2">
          <MapLoadingOverlay :loading="mapsLoading[2]" />
          <div class="legend" v-if="!aggregateView">
            <div class="legend-item">
              <div
                class="legend-swatch"
                style="background-color: rgba(237, 248, 233, 1)"
              ></div>
              <span class="legend-value">&lt; 0</span>
            </div>
            <div class="legend-item">
              <div
                class="legend-swatch"
                style="background-color: rgba(186, 228, 179, 1)"
              ></div>
              <span class="legend-value">&ge; 0, &lt; 0.5</span>
            </div>
            <div class="legend-item">
              <div
                class="legend-swatch"
                style="background-color: rgba(116, 196, 118, 1)"
              ></div>
              <span class="legend-value">&ge; 0.5, &lt; 1</span>
            </div>
            <div class="legend-item">
              <div
                class="legend-swatch"
                style="background-color: rgba(49, 163, 84, 1)"
              ></div>
              <span class="legend-value">&ge; 1, &lt; 1.5</span>
            </div>
            <div class="legend-item">
              <div
                class="legend-swatch"
                style="background-color: rgba(0, 109, 44, 1)"
              ></div>
              <span class="legend-value">&ge; 1.5</span>
            </div>
          </div>
          <div class="legend" v-else>
            <div class="legend-item">
              <div
                class="legend-swatch"
                style="background-color: rgba(247, 247, 247, 1)"
              ></div>
              <span class="legend-value">&ge; 0, &lt; 1</span>
            </div>
            <div class="legend-item">
              <div
                class="legend-swatch"
                style="background-color: rgba(204, 204, 204, 1)"
              ></div>
              <span class="legend-value">&ge; 1, &lt; 2</span>
            </div>
            <div class="legend-item">
              <div
                class="legend-swatch"
                style="background-color: rgba(150, 150, 150, 1)"
              ></div>
              <span class="legend-value">&ge; 2, &lt; 3</span>
            </div>
            <div class="legend-item">
              <div
                class="legend-swatch"
                style="background-color: rgba(99, 99, 99, 1)"
              ></div>
              <span class="legend-value">&ge; 3, &lt; 4</span>
            </div>
            <div class="legend-item">
              <div
                class="legend-swatch"
                style="background-color: rgba(37, 37, 37, 1)"
              ></div>
              <span class="legend-value">&ge; 4</span>
            </div>
          </div>
        </div>
      </div>
      <div class="map-panel">
        <h3 v-if="!aggregateView">Delta From Historical (%)</h3>
        <h3 v-else>Delta From Historical, Model Range (&Delta;%)</h3>
        <div class="map" ref="mapContainer3">
          <MapLoadingOverlay :loading="mapsLoading[3]" />
          <div class="legend" v-if="!aggregateView">
            <div class="legend-item">
              <div
                class="legend-swatch"
                style="background-color: rgba(237, 248, 233, 1)"
              ></div>
              <span class="legend-value">&lt; 0</span>
            </div>
            <div class="legend-item">
              <div
                class="legend-swatch"
                style="background-color: rgba(186, 228, 179, 1)"
              ></div>
              <span class="legend-value">&ge; 0, &lt; 10</span>
            </div>
            <div class="legend-item">
              <div
                class="legend-swatch"
                style="background-color: rgba(116, 196, 118, 1)"
              ></div>
              <span class="legend-value">&ge; 10, &lt; 20</span>
            </div>
            <div class="legend-item">
              <div
                class="legend-swatch"
                style="background-color: rgba(49, 163, 84, 1)"
              ></div>
              <span class="legend-value">&ge; 20, &lt; 30</span>
            </div>
            <div class="legend-item">
              <div
                class="legend-swatch"
                style="background-color: rgba(0, 109, 44, 1)"
              ></div>
              <span class="legend-value">&ge; 30</span>
            </div>
          </div>
          <div class="legend" v-else>
            <div class="legend-item">
              <div
                class="legend-swatch"
                style="background-color: rgba(247, 247, 247, 1)"
              ></div>
              <span class="legend-value">&ge; 0, &lt; 15</span>
            </div>
            <div class="legend-item">
              <div
                class="legend-swatch"
                style="background-color: rgba(204, 204, 204, 1)"
              ></div>
              <span class="legend-value">&ge; 15, &lt; 30</span>
            </div>
            <div class="legend-item">
              <div
                class="legend-swatch"
                style="background-color: rgba(150, 150, 150, 1)"
              ></div>
              <span class="legend-value">&ge; 30, &lt; 45</span>
            </div>
            <div class="legend-item">
              <div
                class="legend-swatch"
                style="background-color: rgba(99, 99, 99, 1)"
              ></div>
              <span class="legend-value">&ge; 45, &lt; 60</span>
            </div>
            <div class="legend-item">
              <div
                class="legend-swatch"
                style="background-color: rgba(37, 37, 37, 1)"
              ></div>
              <span class="legend-value">&ge; 60</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div id="chart-container">
      <div v-show="isLoading" class="content is-size-5">
        <section class="section">
          <p>Loading chart data&hellip;</p>
          <progress class="progress is-info" />
        </section>
      </div>
      <div id="plotly-chart" ref="chartContainer"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick, watch } from "vue";
import "bulma/css/bulma.min.css";
import "bulma-switch-control/css/main.min.css";

// Constants
const MODEL_NAMES = [
  "ACCESS-CM2",
  "ACCESS-ESM1-5",
  "BCC-CSM2-MR",
  "CanESM5",
  "CMCC-ESM2",
  "CNRM-CM6-1",
  "CNRM-ESM2-1",
  "EC-Earth3",
  "EC-Earth3-Veg-LR",
  "FGOALS-g3",
  "GFDL-CM4",
  "GFDL-ESM4",
  "GISS-E2-1-G",
  "HadGEM3-GC31-LL",
  "HadGEM3-GC31-MM",
  "INM-CM4-8",
  "INM-CM5-0",
  "IPSL-CM6A-LR",
  "KACE-1-0-G",
  "KIOST-ESM",
  "MIROC6",
  "MIROC-ES2L",
  "MPI-ESM1-2-HR",
  "MPI-ESM1-2-LR",
  "MRI-ESM2-0",
  "NESM3",
  "NorESM2-LM",
  "NorESM2-MM",
  "TaiESM1",
  "UKESM1-0-LL",
];

const VARIABLE_NAMES_SINGLE: Record<string, string> = {
  mean: "Mean Precipitation",
  delta_abs: "Absolute Change from Historical Precipitation",
  delta_pct: "Percent Change from Historical Precipitation",
};

const VARIABLE_NAMES_AGGREGATE: Record<string, string> = {
  mean: "Mean Precipitation",
  delta_abs: "Absolute Change from Historical Precipitation",
  delta_pct: "Percent Change from Historical Precipitation",
};

const Y_AXIS_TITLES: Record<string, string> = {
  mean: "Precipitation (mm/day)",
  delta_abs: "Change from historical (Δ mm/day)",
  delta_pct: "Change from historical (%)",
};

const ERA_NAMES: Record<string, string> = {
  "1": "2040-2069",
  "2": "2070-2099",
};
const SEASON_NAMES: Record<string, string> = {
  "0": "Annual",
  "1": "Dry Season",
  "2": "Wet Season",
};
const SCENARIO_NAMES = ["SSP1-2.6", "SSP2-4.5", "SSP3-7.0", "SSP5-8.5"];
const RASDAMAN_BASE_URL = "https://zeus.snap.uaf.edu/rasdaman/ows";
const WCS_BASE_URL = `${RASDAMAN_BASE_URL}?&SERVICE=WCS&VERSION=2.0.1&REQUEST=GetCoverage&COVERAGEID=piak_collab`;
// Hawaii land outline, from https://github.com/glynnbird/usstatesgeojson
const LAND_GEOJSON_URL = "/hawaii.geojson";

// Refs
const mapContainer0 = ref<HTMLElement | null>(null);
const mapContainer1 = ref<HTMLElement | null>(null);
const mapContainer2 = ref<HTMLElement | null>(null);
const mapContainer3 = ref<HTMLElement | null>(null);
const chartContainer = ref<HTMLElement | null>(null);

// State
let map0: any = null;
let map1: any = null;
let map2: any = null;
let map3: any = null;
let wmsLayers: any[] = [null, null, null, null];
let L: any = null;
let Plotly: any = null;
let landGeoJson: any = null;
let landGeometry: any = null;

const markers = new Map<any, any>();
const selectedModel = ref("0");
const selectedScenario = ref("1");
const selectedPosition = ref("1");
const selectedSeason = ref("0");
const aggregateView = ref(false);
const isLoading = ref(false);
// One flag per map, true while that map has WMS requests in flight
const mapsLoading = ref([true, true, true, true]);
const lastClickedLat = ref<number | null>(null);
const lastClickedLng = ref<number | null>(null);
const lastClickedVariable = ref<string | null>(null);

// Watch aggregateView and update layers when it changes
watch(aggregateView, () => {
  // Clear all markers when view changes
  markers.forEach((marker, map) => map.removeLayer(marker));
  markers.clear();
  // Clear the chart
  if (chartContainer.value && Plotly) {
    Plotly.purge(chartContainer.value);
  }
  // Clear stored location
  lastClickedLat.value = null;
  lastClickedLng.value = null;
  lastClickedVariable.value = null;
  updateLayers();
});

// Watch for changes to model, era, or season and refresh chart
watch(
  [selectedModel, selectedScenario, selectedPosition, selectedSeason],
  () => {
    if (
      lastClickedLat.value !== null &&
      lastClickedLng.value !== null &&
      lastClickedVariable.value !== null
    ) {
      Plotly.purge(chartContainer.value);
      fetchDataAndCreateChart(
        lastClickedLat.value,
        lastClickedLng.value,
        lastClickedVariable.value,
      );
    }
  },
);

// Load the Hawaii land outline used to mask out clicks in the ocean
const loadLandMask = async () => {
  const response = await fetch(LAND_GEOJSON_URL);
  if (!response.ok)
    throw new Error(`Failed to load land mask: ${response.status}`);
  landGeoJson = await response.json();
  landGeometry =
    landGeoJson.type === "Feature" ? landGeoJson.geometry : landGeoJson;
};

// Transparent overlay drawn over the islands: it carries no visual weight, but
// gives the pointer something to hit so land reads as clickable and ocean does not.
const addLandMask = (map: any) => {
  if (!L || !map || !landGeoJson) return;
  L.geoJSON(landGeoJson, {
    interactive: true,
    style: () => ({
      stroke: false,
      weight: 0,
      fill: true,
      fillColor: "#000000",
      fillOpacity: 0,
      className: "land-mask",
    }),
  }).addTo(map);
};

// Ray casting: is (lng, lat) inside this ring of [lng, lat] pairs?
const pointInRing = (lng: number, lat: number, ring: number[][]) => {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i] as [number, number];
    const [xj, yj] = ring[j] as [number, number];
    const crosses =
      yi > lat !== yj > lat && lng < ((xj - xi) * (lat - yi)) / (yj - yi) + xi;
    if (crosses) inside = !inside;
  }
  return inside;
};

// First ring is the outline, any remaining rings are holes
const pointInPolygon = (lng: number, lat: number, rings: number[][][]) => {
  if (!rings.length || !pointInRing(lng, lat, rings[0]!)) return false;
  return rings.slice(1).every((hole) => !pointInRing(lng, lat, hole));
};

const isOnLand = (lat: number, lng: number) => {
  // Without the mask loaded, don't lock the user out of the maps
  if (!landGeometry) return true;
  const normalizedLng = ((((lng + 180) % 360) + 360) % 360) - 180;
  const polygons =
    landGeometry.type === "MultiPolygon"
      ? landGeometry.coordinates
      : [landGeometry.coordinates];
  return polygons.some((rings: number[][][]) =>
    pointInPolygon(normalizedLng, lat, rings),
  );
};

// Helper to create WMS layer
const createWMSLayer = (
  style: string,
  isAggregate: boolean,
  index: number,
  overrides?: {
    model?: string;
    scenario?: string;
    position?: string;
    season?: string;
  },
) => {
  const options: any = {
    layers: "piak_collab",
    format: "image/png",
    transparent: true,
    version: "1.3.0",
    crs: L.CRS.EPSG4326,
    styles: isAggregate ? `${style}_range` : style,
    dim_scenario: overrides?.scenario ?? selectedScenario.value,
    dim_position: overrides?.position ?? selectedPosition.value,
    dim_season: overrides?.season ?? selectedSeason.value,
  };

  if (!isAggregate) {
    options.dim_model = overrides?.model ?? selectedModel.value;
  }

  const layer = L.tileLayer.wms(RASDAMAN_BASE_URL, options);

  // Drive the overlay from the layer's own in-flight WMS requests. Events from a
  // layer that has already been replaced are ignored so they can't clear the
  // overlay of the layer that succeeded it.
  layer.on("loading", () => {
    if (wmsLayers[index] === layer) mapsLoading.value[index] = true;
  });
  layer.on("load", () => {
    if (wmsLayers[index] === layer) mapsLoading.value[index] = false;
  });

  return layer;
};

const updateLayers = () => {
  if (!L || !map0 || !map1 || !map2 || !map3) return;

  const maps = [map0, map1, map2, map3];

  // Remove existing WMS layers
  wmsLayers.forEach((layer, idx) => {
    if (layer) maps[idx].removeLayer(layer);
  });

  const isAggregate = aggregateView.value;
  // Cover the maps up front: the new tiles are requested below, and the layers
  // only clear their own flag once every tile has come back.
  mapsLoading.value = [true, true, true, true];
  // First map always shows mean for model 21, scenario 3, season 1, position 1
  wmsLayers = [
    createWMSLayer("mean_range", false, 0, {
      scenario: "3",
      season: "1",
      position: "2",
    }),
    ...["mean", "delta_abs", "delta_pct"].map((style, idx) =>
      createWMSLayer(style, isAggregate, idx + 1),
    ),
  ];
  wmsLayers.forEach((layer, idx) => layer.addTo(maps[idx]));
};

const handleMapClick = async (e: any) => {
  if (!L || !Plotly) return;

  const lat = e.latlng.lat;
  const lng = e.latlng.lng;

  // Only land has data behind it; ignore clicks in the ocean
  if (!isOnLand(lat, lng)) return;

  // Overview map (map0) is not interactive for charts
  if (e.target === map0) return;

  Plotly.purge(chartContainer.value);

  // Remove existing markers and add new one to clicked map
  markers.forEach((marker, map) => map.removeLayer(marker));
  markers.set(e.target, L.marker([lat, lng]).addTo(e.target));

  // Determine variable based on clicked map
  const wcsVariable =
    e.target === map1 ? "mean" : e.target === map2 ? "delta_abs" : "delta_pct";

  // Store location for chart refresh
  lastClickedLat.value = lat;
  lastClickedLng.value = lng;
  lastClickedVariable.value = wcsVariable;

  await fetchDataAndCreateChart(lat, lng, wcsVariable);
};

const fetchDataAndCreateChart = async (
  lat: number,
  lng: number,
  wcsVariable: string,
) => {
  isLoading.value = true;
  const position = selectedPosition.value;
  const season = selectedSeason.value;

  const chartConfig = {
    responsive: true,
    displayModeBar: false,
    displaylogo: false,
  };

  if (aggregateView.value) {
    // Aggregate view: fetch data for all 30 models across all scenarios
    let scenarioNames = ["Historical", ...SCENARIO_NAMES];

    // Fetch historical and projected data
    const historicalUrl = `${WCS_BASE_URL}&SUBSET=Lon(${lng})&SUBSET=Lat(${lat})&SUBSET=scenario(0)&SUBSET=position(0)&SUBSET=season(${season})&RANGESUBSET=${wcsVariable}&FORMAT=application/json`;
    const projectedUrl = `${WCS_BASE_URL}&SUBSET=Lon(${lng})&SUBSET=Lat(${lat})&SUBSET=position(${position})&SUBSET=season(${season})&RANGESUBSET=${wcsVariable}&FORMAT=application/json`;

    const [historicalJson, projectedJson] = await Promise.all([
      fetch(historicalUrl).then((r) => r.json()),
      fetch(projectedUrl).then((r) => r.json()),
    ]);

    // Transpose projected data: group by scenario
    const scenarioData: any[][] = [];
    projectedJson.forEach((modelData: any) => {
      modelData.forEach((scenarioValue: any, idx: number) => {
        if (!scenarioData[idx]) scenarioData[idx] = [];
        scenarioData[idx].push(scenarioValue);
      });
    });

    // Build traces
    const traces: any[] = [];
    let xTickLabels = scenarioNames;

    if (wcsVariable === "mean") {
      scenarioData[0] = historicalJson;
    } else {
      scenarioData.shift();
      xTickLabels.shift();
    }

    const scenarioInt = parseInt(selectedScenario.value);
    const selectedScenarioIdx =
      wcsVariable === "mean" ? scenarioInt : scenarioInt - 1;

    xTickLabels.forEach((name, idx) => {
      const color =
        wcsVariable === "mean" && idx === 0
          ? "#333333"
          : idx === selectedScenarioIdx
            ? "#8c3ac9"
            : "#a892cc";
      traces.push({
        y: scenarioData[idx] || [],
        name,
        type: "box",
        marker: { color },
      });
    });

    const tickLabels = xTickLabels.map((label, idx) =>
      idx === selectedScenarioIdx ? `<b>${label}</b>` : label,
    );

    const titleText = `${VARIABLE_NAMES_AGGREGATE[wcsVariable]} (${lat.toFixed(2)}°, ${lng.toFixed(2)}°)<br />Era: ${ERA_NAMES[position]}, Season: ${SEASON_NAMES[season]}`;

    const layout = {
      title: { text: titleText, font: { size: 16 } },
      xaxis: {
        title: "Scenario",
        tickvals: xTickLabels.map((_, i) => i),
        ticktext: tickLabels,
      },
      yaxis: { title: { text: Y_AXIS_TITLES[wcsVariable] } },
      margin: { t: 100, b: 80, l: 80, r: 30 },
      hovermode: false,
      showlegend: false,
    };

    if (chartContainer.value) {
      Plotly.newPlot(chartContainer.value, traces, layout, chartConfig);
    }
  } else {
    // Single model view
    const model = selectedModel.value;

    const historicalUrl = `${WCS_BASE_URL}&SUBSET=Lon(${lng})&SUBSET=Lat(${lat})&SUBSET=model(${model})&SUBSET=scenario(0)&SUBSET=position(0)&SUBSET=season(${season})&RANGESUBSET=${wcsVariable}&FORMAT=application/json`;
    const projectedUrl = `${WCS_BASE_URL}&SUBSET=Lon(${lng})&SUBSET=Lat(${lat})&SUBSET=model(${model})&SUBSET=position(${position})&SUBSET=season(${season})&RANGESUBSET=${wcsVariable}&FORMAT=application/json`;

    const [historicalMean, projectedMeans] = await Promise.all([
      fetch(historicalUrl).then((r) => r.json()),
      fetch(projectedUrl).then((r) => r.json()),
    ]);

    projectedMeans.shift();

    const xLabels =
      wcsVariable === "mean"
        ? ["Historical", ...SCENARIO_NAMES]
        : SCENARIO_NAMES;
    const yValues =
      wcsVariable === "mean"
        ? [historicalMean, ...projectedMeans]
        : projectedMeans;
    const selectedScenarioIdx = parseInt(selectedScenario.value) - 1;

    const scenarioColors = SCENARIO_NAMES.map((_, idx) =>
      idx === selectedScenarioIdx ? "#8c3ac9" : "#a892cc",
    );
    const colors =
      wcsVariable === "mean" ? ["#333333", ...scenarioColors] : scenarioColors;

    const tickLabels = xLabels.map((label, idx) => {
      const scenarioIdx = wcsVariable === "mean" ? idx - 1 : idx;
      return scenarioIdx === selectedScenarioIdx ? `<b>${label}</b>` : label;
    });

    const symbols =
      wcsVariable === "mean"
        ? ["diamond", "circle", "circle", "circle", "circle"]
        : ["circle", "circle", "circle", "circle"];

    const trace = {
      x: xLabels,
      y: yValues,
      mode: "markers",
      type: "scatter",
      marker: { color: colors, size: 10, symbol: symbols },
    };

    const modelName = MODEL_NAMES[parseInt(selectedModel.value)];
    const titleText = `${VARIABLE_NAMES_SINGLE[wcsVariable]} (${lat.toFixed(2)}°, ${lng.toFixed(2)}°)<br />Model: ${modelName}, Era: ${ERA_NAMES[position]}, Season: ${SEASON_NAMES[season]}`;

    const layout = {
      title: { text: titleText, font: { size: 16 } },
      xaxis: {
        tickvals: xLabels.map((_, i) => i),
        ticktext: tickLabels,
        automargin: true,
      },
      yaxis: { title: { text: Y_AXIS_TITLES[wcsVariable] }, automargin: true },
      margin: { t: 100, b: 80, l: 80, r: 30 },
      showlegend: false,
    };

    if (chartContainer.value) {
      Plotly.newPlot(chartContainer.value, [trace], layout, chartConfig);
      setTimeout(() => window.dispatchEvent(new Event("resize")), 0);
    }
  }
  isLoading.value = false;
};

onMounted(async () => {
  await nextTick();

  try {
    // Dynamically import Leaflet and Plotly
    L = (await import("leaflet")).default;
    Plotly = (await import("plotly.js-dist-min")).default;

    try {
      await loadLandMask();
    } catch (error) {
      console.error("Error loading land mask:", error);
    }

    const mapOptionsBase = {
      crs: L.CRS.EPSG4326,
      center: [20.25, -156.55],
      zoomSnap: 0.1,
      zoomControl: false,
      dragging: false,
      scrollWheelZoom: false,
      doubleClickZoom: false,
      touchZoom: false,
      boxZoom: false,
    };

    const baseTileOptions = {
      maxZoom: 18,
      attribution: "© OpenStreetMap contributors",
      noWrap: true,
    };

    // Initialize maps
    const mapContainers = [
      mapContainer0,
      mapContainer1,
      mapContainer2,
      mapContainer3,
    ];
    const maps = [null, null, null, null];

    mapContainers.forEach((container, idx) => {
      if (container.value) {
        // Overview map (idx 0) gets higher zoom level and centered more west
        const mapOptions =
          idx === 0
            ? { ...mapOptionsBase, zoom: 7, center: [20.5, -157.5] }
            : { ...mapOptionsBase, zoom: 6 };
        const map = L.map(container.value, mapOptions);
        L.tileLayer(
          "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
          baseTileOptions,
        ).addTo(map);
        // Only add land mask to interactive maps (not overview map)
        if (idx !== 0) {
          addLandMask(map);
        }
        map.on("click", handleMapClick);
        maps[idx] = map;
      }
    });
    [map0, map1, map2, map3] = maps;

    // Initialize layers after maps are ready
    setTimeout(() => {
      maps.forEach((map) => map?.invalidateSize());
      updateLayers();
    }, 100);
  } catch (error) {
    console.error("Error initializing maps:", error);
  }
});
</script>

<style scoped>
#app-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100vw;
  margin-bottom: 200px;
}

#header {
  background-color: #2c3e50;
  color: white;
  padding: 20px;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

#header .title {
  margin: 0;
}

#controls-panel {
  margin-top: 60px;
  padding: 20px;
}

.controls {
  margin: 0 auto;
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
  justify-content: center;
  align-items: flex-end;
}

.controls .field {
  margin: 0;
}

.controls .switch-field {
  margin-bottom: 0;
  font-weight: bold;
}

.overview-map-wrapper {
  padding: 20px 20px 0 20px;
  width: 100%;
  box-sizing: border-box;
}

.overview-map-panel {
  width: 100%;
  margin: 0 auto;
}

.overview-map-panel h3 {
  margin: 0 0 10px 0;
  padding: 10px;
  text-align: center;
  font-family: Arial, sans-serif;
  border-radius: 4px;
}

.overview-map {
  width: 100%;
  aspect-ratio: 3 / 2;
  background-color: #e0e0e0;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  position: relative;
}

.maps-wrapper {
  display: flex;
  gap: 20px;
  padding: 20px;
  flex: 1;
  box-sizing: border-box;
  margin: 0 auto;
  width: 100%;
}

.map-panel {
  width: 100%;
}

.map-panel h3 {
  margin: 0 0 10px 0;
  padding: 10px;
  text-align: center;
  font-family: Arial, sans-serif;
  border-radius: 4px;
  line-height: 1.5;
  min-height: 3em;
}

.map {
  aspect-ratio: 400 / 350;
  background-color: #e0e0e0;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
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

#chart-container {
  margin: 20px auto;
  padding: 20px;
  width: 100%;
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
  min-height: 500px;
}
</style>

<style>
html,
body {
  margin: 0;
  padding: 0;
  height: 100%;
  font-family: Arial, sans-serif;
}

/* Ocean is not clickable; the transparent land mask is */
.leaflet-container {
  cursor: not-allowed;
}

.leaflet-container .land-mask,
.leaflet-container .leaflet-marker-icon {
  cursor: pointer;
  pointer-events: auto;
}

/* Overview map has no land mask, so entire map shows not-allowed cursor */
.overview-map .leaflet-container {
  cursor: not-allowed;
}
</style>
