<template>
  <div id="app-container">
    <div id="header">
      <h2 class="title is-4 has-text-white">
        Downscaled CMIP6 Precipitation for Hawai&lsquo;i &mdash; Pacific Islands
        + Alaska CASC Tech Proof-Of-Concept
      </h2>
    </div>
    <div class="overview-map-wrapper">
      <div class="overview-map-panel">
        <h3 class="title is-3">
          Range of Variation across 30 GCM models (NASA NEX), Projected
          Precipitation across Hawaii, 250m
        </h3>
        <h4 class="title is-4">
          CMIP6 (NASA NEX), Dry Season (May-October), 2070&ndash;2099, SSP3-7.0
        </h4>
        <p class="content is-size-4">
          Darker shaded regions show larger range of variation between models:
          <b>less model agreement</b>.
        </p>
        <div class="overview-map" ref="mapContainer0">
          <MapLoadingOverlay :loading="mapsLoading[0]" />
          <MapLegend :items="OVERVIEW_LEGEND" />
        </div>
      </div>
    </div>
    <!-- Explore Model Spread: compare the range across all 30 models against
         the range across a smaller ensemble, side by side. -->
    <section id="model-spread">
      <div class="container">
        <div class="content is-size-5 mt-6">
          <h3 class="title is-3">Explore Model Spread</h3>
          <ul>
            <li>
              The top row shows the range of variation across all 30 models.
            </li>
            <li>
              The bottom row shows the same range across a smaller ensemble, so
              the two can be compared directly.
            </li>
            <li>Darker colors show less model agreement.</li>
          </ul>
        </div>
      </div>
      <div class="spread-controls-panel">
        <div class="controls">
          <div class="field">
            <label class="label" for="spread-scenario">Scenario</label>
            <div class="control">
              <div class="select">
                <select id="spread-scenario" v-model="spreadScenario">
                  <option
                    v-for="option in SCENARIO_OPTIONS"
                    :key="option.value"
                    :value="option.value"
                  >
                    {{ option.label }}
                  </option>
                </select>
              </div>
            </div>
          </div>
          <div class="field">
            <label class="label" for="spread-position">Horizon</label>
            <div class="control">
              <div class="select">
                <select id="spread-position" v-model="spreadPosition">
                  <option
                    v-for="option in HORIZON_OPTIONS"
                    :key="option.value"
                    :value="option.value"
                  >
                    {{ option.label }}
                  </option>
                </select>
              </div>
            </div>
          </div>
          <div class="field">
            <label class="label" for="spread-season">Season</label>
            <div class="control">
              <div class="select">
                <select id="spread-season" v-model="spreadSeason">
                  <option
                    v-for="option in SEASON_OPTIONS"
                    :key="option.value"
                    :value="option.value"
                  >
                    {{ option.label }}
                  </option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="container spread-ensemble-panel">
        <p v-if="!activeEnsemble.length" class="ensemble-empty">
          Select at least one model below to draw the ensemble maps.
        </p>
      </div>
      <div class="spread-maps">
        <h4 class="spread-row-title">All 30 models</h4>
        <div class="spread-map-row">
          <div class="map-panel">
            <h3>
              Delta From Historical, Model Spread (&Delta;<sup>2</sup> mm/day)
            </h3>
            <div class="map spread-map" :ref="spreadContainerRef[0]">
              <MapLoadingOverlay :loading="spreadLoading[0]" />
              <MapLegend :items="RANGE_LEGENDS.delta_abs" />
            </div>
          </div>
          <div class="map-panel">
            <h3>Delta From Historical, Model Spread (&Delta;%)</h3>
            <div class="map spread-map" :ref="spreadContainerRef[1]">
              <MapLoadingOverlay :loading="spreadLoading[1]" />
              <MapLegend :items="RANGE_LEGENDS.delta_pct" />
            </div>
          </div>
        </div>

        <h3 class="spread-row-title">
          <template v-if="isDefaultEnsemble"
            >Hand-selected ensemble &mdash; {{ activeEnsemble.length }}
            high-performing models</template
          >
          <template v-else
            >Custom ensemble &mdash; {{ activeEnsemble.length }}
            {{ activeEnsemble.length === 1 ? "model" : "models" }}</template
          >
        </h3>
        <p class="spread-ensemble-list my-3">
          <button
            v-for="(name, idx) in MODEL_NAMES"
            :key="name"
            type="button"
            class="ensemble-model"
            :class="{ 'is-included': activeEnsemble.includes(idx) }"
            :aria-pressed="activeEnsemble.includes(idx)"
            @click="toggleCustomModel(idx)"
            >{{ name }}</button
          >
        </p>
        <div class="spread-map-row">
          <div class="map-panel">
            <h3>
              Delta From Historical, Model Spread (&Delta;<sup>2</sup> mm/day)
            </h3>
            <div class="map spread-map" :ref="spreadContainerRef[2]">
              <MapLoadingOverlay :loading="spreadLoading[2]" />
              <MapLegend :items="RANGE_LEGENDS.delta_abs" />
            </div>
          </div>
          <div class="map-panel">
            <h3>Delta From Historical, Model Spread (&Delta;%)</h3>
            <div class="map spread-map" :ref="spreadContainerRef[3]">
              <MapLoadingOverlay :loading="spreadLoading[3]" />
              <MapLegend :items="RANGE_LEGENDS.delta_pct" />
            </div>
          </div>
        </div>
      </div>
      <div class="spread-chart-container">
        <div v-show="spreadChartLoading" class="content is-size-5">
          <section class="section">
            <p>Loading chart data&hellip;</p>
            <progress class="progress is-info" />
          </section>
        </div>
        <p v-if="!spreadClick" class="spread-chart-hint">
          <img src="/marker-icon.png" alt="" class="chart-hint-icon" />
          Click on the maps above to chart data values.
        </p>
        <div
          v-show="spreadClick"
          ref="spreadChartContainer"
          class="spread-chart"
        ></div>
      </div>
    </section>
    <div class="container">
      <div class="content is-size-5 mt-6">
        <h3 class="title is-3">Model outputs</h3>
        <ul>
          <li>
            Pick a model, scenario, horizon and season to show data for any
            combination on the maps below.
          </li>
          <li>Clicking on land will load charts of data values.</li>
        </ul>
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
          <label class="label" for="position">Horizon</label>
          <div class="control">
            <div class="select">
              <select
                id="position"
                v-model="selectedPosition"
                @change="updateLayers"
              >
                <option value="1">Mid-Century (2040-2069)</option>
                <option value="2">Late-Century (2070-2099)</option>
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
      </div>
    </div>
    <div class="maps-wrapper">
      <div class="map-panel">
        <h3>Delta From Historical (&Delta; mm/day)</h3>
        <div class="map" ref="mapContainer1">
          <MapLoadingOverlay :loading="mapsLoading[1]" />
          <MapLegend :items="DELTA_LEGENDS.delta_abs" />
        </div>
      </div>
      <div class="map-panel">
        <h3>Delta From Historical (%)</h3>
        <div class="map" ref="mapContainer2">
          <MapLoadingOverlay :loading="mapsLoading[2]" />
          <MapLegend :items="DELTA_LEGENDS.delta_pct" />
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
      <p v-if="lastClickedLat === null" class="chart-hint">
        <img src="/marker-icon.png" alt="" class="chart-hint-icon" />
        Click on the maps above to chart data values.
      </p>
      <div v-show="lastClickedLat !== null" id="plotly-chart" ref="chartContainer"></div>
    </div>
    <Footer />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick, watch } from "vue";
import "bulma/css/bulma.min.css";

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

// Hand-selected ensemble: the models that perform best over this region.
const HIGH_PERFORMING_MODELS = [
  "FGOALS-g3",
  "GFDL-CM4",
  "GFDL-ESM4",
  "CNRM-ESM2-1",
  "EC-Earth3",
  "KIOST-ESM",
  "IPSL-CM6A-LR",
  "CNRM-CM6-1",
];
const HIGH_PERFORMING_MODEL_INDICES = HIGH_PERFORMING_MODELS.map((name) =>
  MODEL_NAMES.indexOf(name),
);
// Same format as activeEnsembleKey, so the two can be compared directly
const DEFAULT_ENSEMBLE_KEY = [...HIGH_PERFORMING_MODEL_INDICES]
  .sort((a, b) => a - b)
  .join(",");
const ALL_MODEL_INDICES = MODEL_NAMES.map((_, idx) => idx);

// Grays shared by every model-range map, matching the server-side *_range styles
const RANGE_GRAYS = [
  "rgba(247, 247, 247, 1)",
  "rgba(204, 204, 204, 1)",
  "rgba(150, 150, 150, 1)",
  "rgba(99, 99, 99, 1)",
  "rgba(37, 37, 37, 1)",
];

// Greens for the single-model delta maps, light to dark
const DELTA_GREENS = [
  "rgba(237, 248, 233, 1)",
  "rgba(186, 228, 179, 1)",
  "rgba(116, 196, 118, 1)",
  "rgba(49, 163, 84, 1)",
  "rgba(0, 109, 44, 1)",
];

// The overview map is a range map like the spread maps, but on its own
// coarser scale, so it does not share RANGE_LEGENDS.
const OVERVIEW_LEGEND = [
  "\u2265 0, < 2 \u0394 mm/day",
  "\u2265 2, < 4 \u0394 mm/day",
  "\u2265 4, < 6 \u0394 mm/day",
  "\u2265 6, < 8 \u0394 mm/day",
  "\u2265 8 \u0394 mm/day",
].map((label, idx) => ({ color: RANGE_GRAYS[idx]!, label }));

const DELTA_LEGENDS: Record<string, { color: string; label: string }[]> = {
  delta_abs: [
    "< 0",
    "\u2265 0, < 0.5",
    "\u2265 0.5, < 1",
    "\u2265 1, < 1.5",
    "\u2265 1.5",
  ].map((label, idx) => ({ color: DELTA_GREENS[idx]!, label })),
  delta_pct: [
    "< 0",
    "\u2265 0, < 10",
    "\u2265 10, < 20",
    "\u2265 20, < 30",
    "\u2265 30",
  ].map((label, idx) => ({ color: DELTA_GREENS[idx]!, label })),
};

const RANGE_LEGENDS: Record<string, { color: string; label: string }[]> = {
  delta_abs: [
    "\u2265 0, < 1",
    "\u2265 1, < 2",
    "\u2265 2, < 3",
    "\u2265 3, < 4",
    "\u2265 4",
  ].map((label, idx) => ({ color: RANGE_GRAYS[idx]!, label })),
  delta_pct: [
    "\u2265 0, < 15",
    "\u2265 15, < 30",
    "\u2265 30, < 45",
    "\u2265 45, < 60",
    "\u2265 60",
  ].map((label, idx) => ({ color: RANGE_GRAYS[idx]!, label })),
};

// Break points of the *_range styles, reused when a range is computed
// client-side over a subset of models.
const RANGE_COLOR_TABLES: Record<string, Record<string, number[]>> = {
  delta_abs: {
    "0": [247, 247, 247, 255],
    "1": [204, 204, 204, 255],
    "2": [150, 150, 150, 255],
    "3": [99, 99, 99, 255],
    "4": [37, 37, 37, 255],
  },
  delta_pct: {
    "0": [247, 247, 247, 255],
    "15": [204, 204, 204, 255],
    "30": [150, 150, 150, 255],
    "45": [99, 99, 99, 255],
    "60": [37, 37, 37, 255],
  },
};

const VARIABLE_NAMES: Record<string, string> = {
  mean: "Mean Precipitation",
  delta_abs: "Absolute Change from Historical Precipitation",
  delta_pct: "Percent Change from Historical Precipitation",
};

const Y_AXIS_TITLES: Record<string, string> = {
  mean: "Precipitation (mm/day)",
  delta_abs: "Change from historical (Δ mm/day)",
  delta_pct: "Change from historical (%)",
};

const HORIZON_NAMES: Record<string, string> = {
  "1": "Mid-Century (2040-2069)",
  "2": "Late-Century (2070-2099)",
};
const SEASON_NAMES: Record<string, string> = {
  "0": "Annual",
  "1": "Dry Season",
  "2": "Wet Season",
};
const SCENARIO_NAMES = ["SSP1-2.6", "SSP2-4.5", "SSP3-7.0", "SSP5-8.5"];

// Option lists for the Explore Model Spread controls, derived from the names
// above so the two stay in step. Season labels are kept short to match the
// Model outputs control.
const SCENARIO_OPTIONS = SCENARIO_NAMES.map((label, idx) => ({
  value: String(idx + 1),
  label,
}));
const HORIZON_OPTIONS = Object.entries(HORIZON_NAMES).map(([value, label]) => ({
  value,
  label,
}));
const SEASON_OPTIONS = [
  { value: "0", label: "Annual" },
  { value: "1", label: "Dry" },
  { value: "2", label: "Wet" },
];
const RASDAMAN_BASE_URL = "https://zeus.snap.uaf.edu/rasdaman/ows";
// USGS National Map basemap, served from the ArcGIS tile cache (note {y}/{x}
// order). The cache is Web Mercator, so the maps run in EPSG:3857.
const USGS_BASEMAP_URL =
  "https://basemap.nationalmap.gov/arcgis/rest/services/USGSTopo/MapServer/tile/{z}/{y}/{x}";
const WCS_BASE_URL = `${RASDAMAN_BASE_URL}?&SERVICE=WCS&VERSION=2.0.1&REQUEST=GetCoverage&COVERAGEID=piak_collab`;
const WCPS_BASE_URL = `${RASDAMAN_BASE_URL}?service=WCS&version=2.0.1&request=ProcessCoverages`;

// Invisible bounding box encompassing all major Hawaiian islands (Ni'ihau
// through Hawai'i Island); every map on the page is fit to this same box so
// they all show the same extent, centered on the same spot.
const MAP_BOUNDS = {
  latMin: 18.7,
  latMax: 22.4,
  lonMin: -159.97,
  lonMax: -154.64,
};
// The coverage's own geo bounds, from its WCS description. MAP_BOUNDS is
// wider (so every map frames the same, slightly padded, view), but a WCPS
// subset outside these bounds fails with an InvalidSubsetting error, which
// renders as a broken image — so queries and their image overlays are kept
// clamped to this narrower box instead.
const COVERAGE_BOUNDS = {
  latMin: 18.849,
  latMax: 22.269,
  lonMin: -159.816,
  lonMax: -154.668,
};
// Requested extent intersected with what the coverage actually has data for
const QUERY_BOUNDS = {
  latMin: Math.max(MAP_BOUNDS.latMin, COVERAGE_BOUNDS.latMin),
  latMax: Math.min(MAP_BOUNDS.latMax, COVERAGE_BOUNDS.latMax),
  lonMin: Math.max(MAP_BOUNDS.lonMin, COVERAGE_BOUNDS.lonMin),
  lonMax: Math.min(MAP_BOUNDS.lonMax, COVERAGE_BOUNDS.lonMax),
};
// Pixel grid the range images are rendered at. The native grid is 2288x1520,
// more than these maps display, so it is scaled down server-side; this is still
// comfortably above the on-screen size at 2x pixel density.
const WCPS_IMAGE_HEIGHT = 768;
const WCPS_IMAGE_WIDTH = 1152;
// Hawaii land outline, from https://github.com/glynnbird/usstatesgeojson
const LAND_GEOJSON_URL = "/hawaii.geojson";

const BBOX: [[number, number], [number, number]] = [
  [MAP_BOUNDS.latMin, MAP_BOUNDS.lonMin],
  [MAP_BOUNDS.latMax, MAP_BOUNDS.lonMax],
];

// Refs
const mapContainer0 = ref<HTMLElement | null>(null);
const mapContainer1 = ref<HTMLElement | null>(null);
const mapContainer2 = ref<HTMLElement | null>(null);
const chartContainer = ref<HTMLElement | null>(null);

// State
let map0: any = null;
let map1: any = null;
let map2: any = null;
let wmsLayers: any[] = [null, null, null];
let L: any = null;
let Plotly: any = null;
let landGeoJson: any = null;
let landGeometry: any = null;

const markers = new Map<any, any>();
const selectedModel = ref("0");
const selectedScenario = ref("3");
const selectedPosition = ref("1");
const selectedSeason = ref("0");
const isLoading = ref(false);
// One flag per map, true while that map has WMS requests in flight
const mapsLoading = ref([true, true, true]);
// Explore Model Spread: 0/1 are the all-30 maps, 2/3 the ensemble maps
const spreadContainers: any[] = [null, null, null, null];
// Stable ref callbacks: an inline arrow would be a new function every render,
// which makes Vue unset and re-set the entry on each patch.
const spreadContainerRef = spreadContainers.map((_, idx) => (el: any) => {
  if (el) spreadContainers[idx] = el;
});
let spreadMaps: any[] = [null, null, null, null];
let spreadLayers: any[] = [null, null, null, null];
const spreadLoading = ref([true, true, true, true]);
const spreadScenario = ref("3");
const spreadPosition = ref("2");
const spreadSeason = ref("1");
// Model tags double as toggles: clicking one adds/removes it from the
// ensemble maps and chart, starting from the hand-picked high performers.
const customModelIndices = ref<number[]>([...HIGH_PERFORMING_MODEL_INDICES]);
const toggleCustomModel = (idx: number) => {
  customModelIndices.value = customModelIndices.value.includes(idx)
    ? customModelIndices.value.filter((m) => m !== idx)
    : [...customModelIndices.value, idx];
};

const activeEnsemble = computed(() =>
  [...customModelIndices.value].sort((a, b) => a - b),
);
// True only while the selection still matches the hand-picked default, so
// the heading can call it out by name instead of just a count.
const isDefaultEnsemble = computed(
  () => activeEnsembleKey.value === DEFAULT_ENSEMBLE_KEY,
);
// Compared instead of the array itself, so re-selecting back to the same set
// does not refetch identical images.
const activeEnsembleKey = computed(() => activeEnsemble.value.join(","));

const spreadChartContainer = ref<HTMLElement | null>(null);
const spreadChartLoading = ref(false);
const spreadClick = ref<{
  lat: number;
  lng: number;
  variable: string;
} | null>(null);
// Values at the clicked point, indexed [model][scenario]. Scenario 0 is
// historical; the four SSPs are 1-4. Held so that changing the ensemble
// redraws from the same data instead of refetching it.
let spreadModelValues: (number | null)[][] = [];
// Guards against an earlier click's response landing after a later one
let spreadChartRequest = 0;
const spreadMarkers = new Map<any, any>();
const lastClickedLat = ref<number | null>(null);
const lastClickedLng = ref<number | null>(null);
const lastClickedVariable = ref<string | null>(null);


// Every spread control funnels through here, so working through the model
// checklist or flipping between scenarios collapses into one round of
// requests instead of firing on each change. Work accumulates across the
// wait: whichever maps any pending change touched are redrawn together.
const SPREAD_DEBOUNCE_MS = 200;
let spreadRefreshTimer: ReturnType<typeof setTimeout> | null = null;
let pendingSpreadMaps = new Set<number>();
let pendingChartReload = false;

const scheduleSpreadRefresh = (
  mapIndices: number[],
  { reloadChart = false } = {},
) => {
  mapIndices.forEach((index) => pendingSpreadMaps.add(index));
  pendingChartReload = pendingChartReload || reloadChart;

  if (spreadRefreshTimer) clearTimeout(spreadRefreshTimer);
  spreadRefreshTimer = setTimeout(() => {
    spreadRefreshTimer = null;
    const indices = [...pendingSpreadMaps].sort((a, b) => a - b);
    const reloadChartData = pendingChartReload;
    pendingSpreadMaps = new Set();
    pendingChartReload = false;

    if (indices.length) updateSpreadLayers(indices);
    if (!spreadClick.value) return;
    // Horizon and season change the values behind the chart. Scenario only
    // re-marks the selected tick, and the ensemble group is a subset of data
    // already in hand, so both of those redraw without refetching.
    if (reloadChartData) loadSpreadChart();
    else renderSpreadChart();
  }, SPREAD_DEBOUNCE_MS);
};

watch([spreadScenario, spreadPosition, spreadSeason], () => {
  scheduleSpreadRefresh(ALL_SPREAD_MAP_INDICES);
});
watch([spreadPosition, spreadSeason], () => {
  scheduleSpreadRefresh([], { reloadChart: true });
});
watch(activeEnsembleKey, () => {
  scheduleSpreadRefresh(ENSEMBLE_MAP_INDICES);
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
    // Kept at EPSG:4326 even though the map is EPSG:3857: Rasdaman transposes
    // the axes when asked for 3857, so it is served in 4326 and Leaflet
    // requests the 4326 bbox of each Mercator tile.
    crs: L.CRS.EPSG4326,
    opacity: 0.85,
    styles: style,
    dim_scenario: overrides?.scenario ?? selectedScenario.value,
    dim_position: overrides?.position ?? selectedPosition.value,
    dim_season: overrides?.season ?? selectedSeason.value,
  };

  options.dim_model = overrides?.model ?? selectedModel.value;

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

// Range across an arbitrary set of models, computed by the server. The stored
// *_range WMS styles hardcode model(0:29), so a subset has to go through WCPS.
const ensembleRangeUrl = (variable: string, models: number[]) => {
  const { latMin, latMax, lonMin, lonMax } = QUERY_BOUNDS;
  const selected = models.map((m) => `$m=${m}`).join(" or ");
  const slice =
    `scenario(${spreadScenario.value}),position(${spreadPosition.value}),` +
    `season(${spreadSeason.value}),Lat(${latMin}:${latMax}),Lon(${lonMin}:${lonMax})`;
  const colorMap = JSON.stringify({
    colorMap: { type: "intervals", colorTable: RANGE_COLOR_TABLES[variable] },
  }).replace(/"/g, '\\"');
  // scale() has to sit inside the let clause: applied to the condensed result
  // it is resolved against the source coverage's axes and errors out.
  const query =
    `for $c in (piak_collab) ` +
    `let $s := scale($c.${variable}[${slice}], ` +
    `{Lat:"CRS:1"(0:${WCPS_IMAGE_HEIGHT - 1}), Lon:"CRS:1"(0:${WCPS_IMAGE_WIDTH - 1})}) ` +
    `return encode(` +
    `(condense max over $m model(0:29) where ${selected} using $s[model($m)]) - ` +
    `(condense min over $m model(0:29) where ${selected} using $s[model($m)])` +
    `, "image/png", "${colorMap}")`;
  return `${WCPS_BASE_URL}&query=${encodeURIComponent(query)}`;
};

// Same overlay wiring as createWMSLayer, against the spread maps' own arrays
const trackSpreadLoading = (layer: any, index: number) => {
  const clear = () => {
    if (spreadLayers[index] === layer) spreadLoading.value[index] = false;
  };
  layer.on("loading", () => {
    if (spreadLayers[index] === layer) spreadLoading.value[index] = true;
  });
  layer.on("load", clear);
  layer.on("error", clear);
  return layer;
};

// One image for the whole coverage rather than tiles: WCPS has no tiling, and
// over this small a latitude span the Mercator stretch is well under a pixel.
// Both rows go through here, including the all-30 row that the stored *_range
// WMS styles could also serve, so the two are rendered identically and can be
// compared without resampling differences between them.
const createEnsembleRangeLayer = (
  variable: string,
  models: number[],
  index: number,
) =>
  trackSpreadLoading(
    L.imageOverlay(
      ensembleRangeUrl(variable, models),
      [
        [QUERY_BOUNDS.latMin, QUERY_BOUNDS.lonMin],
        [QUERY_BOUNDS.latMax, QUERY_BOUNDS.lonMax],
      ],
      { opacity: 0.85 },
    ),
    index,
  );

const SPREAD_GROUP_COLORS = { all: "#7f7f7f", ensemble: "#8c3ac9" };

// One box per scenario per group, with every model drawn as a point beside it
const spreadBoxTrace = (name: string, models: number[], color: string) => {
  const x: string[] = [];
  const y: number[] = [];
  const text: string[] = [];

  SCENARIO_NAMES.forEach((scenario, scenarioIdx) => {
    models.forEach((model) => {
      // Scenario 0 is historical, so the SSPs start one along
      const value = spreadModelValues[model]?.[scenarioIdx + 1];
      if (value === null || value === undefined || value <= -9998) return;
      x.push(scenario);
      y.push(value);
      text.push(MODEL_NAMES[model]!);
    });
  });

  return {
    type: "box",
    name,
    x,
    y,
    text,
    marker: { color, size: 5, opacity: 0.7 },
    line: { color },
    fillcolor: "rgba(0, 0, 0, 0)",
    boxpoints: "all",
    jitter: 0.5,
    pointpos: 0,
    hoveron: "boxes+points",
    hovertemplate: `%{text}<br>%{y:.2f}<extra>${name}</extra>`,
  };
};

const renderSpreadChart = () => {
  const click = spreadClick.value;
  if (!click || !Plotly || !spreadChartContainer.value) return;

  const ensembleLabel = `Custom ensemble (${activeEnsemble.value.length})`;

  const traces = [
    spreadBoxTrace("All 30 models", ALL_MODEL_INDICES, SPREAD_GROUP_COLORS.all),
  ];
  if (activeEnsemble.value.length) {
    traces.push(
      spreadBoxTrace(
        ensembleLabel,
        activeEnsemble.value,
        SPREAD_GROUP_COLORS.ensemble,
      ),
    );
  }

  const selectedScenarioIdx = parseInt(spreadScenario.value) - 1;
  const tickText = SCENARIO_NAMES.map((label, idx) =>
    idx === selectedScenarioIdx ? `<b>${label}</b>` : label,
  );

  const titleText =
    `${VARIABLE_NAMES[click.variable]} ` +
    `(${click.lat.toFixed(2)}°, ${click.lng.toFixed(2)}°)<br />` +
    `Horizon: ${HORIZON_NAMES[spreadPosition.value]}, ` +
    `Season: ${SEASON_NAMES[spreadSeason.value]}`;

  const layout = {
    title: { text: titleText, font: { size: 16 } },
    boxmode: "group",
    xaxis: {
      title: { text: "Scenario" },
      tickvals: SCENARIO_NAMES,
      ticktext: tickText,
      automargin: true,
    },
    yaxis: {
      title: { text: Y_AXIS_TITLES[click.variable] },
      automargin: true,
    },
    margin: { t: 100, b: 80, l: 80, r: 30 },
    showlegend: true,
    legend: { orientation: "h", x: 0.5, xanchor: "center", y: -0.2 },
  };

  Plotly.newPlot(spreadChartContainer.value, traces, layout, {
    responsive: true,
    displayModeBar: false,
    displaylogo: false,
  });
  setTimeout(() => window.dispatchEvent(new Event("resize")), 0);
};

// One request covers both groups: it returns every model at the clicked point,
// and the ensemble is a subset of those same values.
const loadSpreadChart = async () => {
  const click = spreadClick.value;
  if (!click || !Plotly) return;

  const request = ++spreadChartRequest;
  spreadChartLoading.value = true;

  const url =
    `${WCS_BASE_URL}&SUBSET=Lon(${click.lng})&SUBSET=Lat(${click.lat})` +
    `&SUBSET=position(${spreadPosition.value})&SUBSET=season(${spreadSeason.value})` +
    `&RANGESUBSET=${click.variable}&FORMAT=application/json`;

  try {
    const values = await fetch(url).then((response) => response.json());
    if (request !== spreadChartRequest) return;
    spreadModelValues = values;
    renderSpreadChart();
  } catch (error) {
    console.error("Error loading model spread chart:", error);
  } finally {
    if (request === spreadChartRequest) spreadChartLoading.value = false;
  }
};

const handleSpreadMapClick = async (event: any) => {
  if (!L || !Plotly) return;

  const { lat, lng } = event.latlng;
  // Only land has data behind it; ignore clicks in the ocean
  if (!isOnLand(lat, lng)) return;

  const index = spreadMaps.indexOf(event.target);
  if (index === -1) return;

  Plotly.purge(spreadChartContainer.value);

  spreadMarkers.forEach((marker, map) => map.removeLayer(marker));
  spreadMarkers.clear();
  // Indices 0/2 and 1/3 chart the same variable (all-30 vs ensemble row), so
  // marking both keeps the two maps in sync at the same point.
  const pairedIndex = index < 2 ? index + 2 : index - 2;
  [index, pairedIndex].forEach((idx) => {
    const map = spreadMaps[idx];
    if (map) spreadMarkers.set(map, L.marker([lat, lng]).addTo(map));
  });

  // Left column charts mm/day, right column percent
  spreadClick.value = {
    lat,
    lng,
    variable: SPREAD_MAP_SPECS[index]!.variable,
  };

  await loadSpreadChart();
};

// Which models and which variable each of the four maps draws. Indices 0/1 are
// the all-30 row, 2/3 the ensemble row.
const SPREAD_MAP_SPECS: { variable: string; models: () => number[] }[] = [
  { variable: "delta_abs", models: () => ALL_MODEL_INDICES },
  { variable: "delta_pct", models: () => ALL_MODEL_INDICES },
  { variable: "delta_abs", models: () => activeEnsemble.value },
  { variable: "delta_pct", models: () => activeEnsemble.value },
];
const ENSEMBLE_MAP_INDICES = [2, 3];
const ALL_SPREAD_MAP_INDICES = [0, 1, 2, 3];

// Only the maps named in `indices` are redrawn: an ensemble change leaves the
// all-30 row alone rather than refetching two images that cannot have changed.
const updateSpreadLayers = (indices: number[] = ALL_SPREAD_MAP_INDICES) => {
  if (!L || spreadMaps.some((map) => !map)) return;

  indices.forEach((idx) => {
    const existing = spreadLayers[idx];
    if (existing) spreadMaps[idx].removeLayer(existing);

    const spec = SPREAD_MAP_SPECS[idx]!;
    const models = spec.models();
    // A range needs something to range over, and an empty `where` clause is
    // not a valid query.
    if (!models.length) {
      spreadLayers[idx] = null;
      spreadLoading.value[idx] = false;
      return;
    }

    spreadLoading.value[idx] = true;
    const layer = createEnsembleRangeLayer(spec.variable, models, idx);
    spreadLayers[idx] = layer;
    layer.addTo(spreadMaps[idx]);
  });
};

const updateLayers = () => {
  if (!L || !map0 || !map1 || !map2) return;

  const maps = [map0, map1, map2];

  // Remove existing WMS layers
  wmsLayers.forEach((layer, idx) => {
    if (layer) maps[idx].removeLayer(layer);
  });

  // Cover the maps up front: the new tiles are requested below, and the layers
  // only clear their own flag once every tile has come back.
  mapsLoading.value = [true, true, true];
  // First map always shows the mean_range style (spread across all models),
  // fixed to SSP3-7.0, Dry season, Late-Century, regardless of the controls.
  wmsLayers = [
    createWMSLayer("mean_range", 0, {
      scenario: "3",
      season: "1",
      position: "2",
    }),
    ...["delta_abs", "delta_pct"].map((style, idx) =>
      createWMSLayer(style, idx + 1),
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
  const wcsVariable = e.target === map1 ? "delta_abs" : "delta_pct";

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
  const titleText = `${VARIABLE_NAMES[wcsVariable]} (${lat.toFixed(2)}°, ${lng.toFixed(2)}°)<br />Model: ${modelName}, Horizon: ${HORIZON_NAMES[position]}, Season: ${SEASON_NAMES[season]}`;

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
  isLoading.value = false;
};

onMounted(async () => {
  await nextTick();

  try {
    // Dynamically import Leaflet and Plotly
    L = (await import("leaflet")).default;
    Plotly = (await import("plotly.js-dist-min")).default;

    // Fix Leaflet marker icons for production builds
    // Point to local marker images in public folder
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: "/marker-icon-2x.png",
      iconUrl: "/marker-icon.png",
      shadowUrl: "/marker-shadow.png",
    });

    try {
      await loadLandMask();
    } catch (error) {
      console.error("Error loading land mask:", error);
    }

    const mapOptionsBase = {
      crs: L.CRS.EPSG3857,
      zoomSnap: 0.01,
      zoomControl: false,
      dragging: false,
      scrollWheelZoom: false,
    };

    const baseTileOptions = {
      maxZoom: 18,
      attribution: "USGS The National Map",
      noWrap: true,
    };

    // Initialize maps
    const mapContainers = [mapContainer0, mapContainer1, mapContainer2];
    const maps = [null, null, null];

    mapContainers.forEach((container, idx) => {
      if (container.value) {
        // Overview map (idx 0) is pannable/zoomable, but only via the zoom control buttons
        const mapOptions =
          idx === 0
            ? {
                ...mapOptionsBase,
                // Each zoom control click jumps 1 level, even though
                // zoomSnap stays fine-grained for fitBounds.
                zoomDelta: 1,
                // Added manually below so it can sit at the top-right
                zoomControl: false,
                dragging: true,
                scrollWheelZoom: false,
              }
            : mapOptionsBase;
        const map = L.map(container.value, mapOptions);
        L.tileLayer(USGS_BASEMAP_URL, baseTileOptions).addTo(map);
        if (idx === 0) {
          L.control.zoom({ position: "topright" }).addTo(map);
        }
        // Only add land mask to interactive maps (not overview map)
        if (idx !== 0) {
          addLandMask(map);
        }
        map.on("click", handleMapClick);
        maps[idx] = map;
      }
    });
    [map0, map1, map2] = maps;

    // Explore Model Spread maps: same non-interactive treatment as the model
    // output maps.
    spreadMaps = spreadContainers.map((container) => {
      if (!container) return null;
      const map = L.map(container, mapOptionsBase);
      L.tileLayer(USGS_BASEMAP_URL, baseTileOptions).addTo(map);
      addLandMask(map);
      map.on("click", handleSpreadMapClick);
      return map;
    });

    // Initialize layers after maps are ready. Fit every map to the same
    // bounding box so they all show the same extent, centered on the same
    // spot, regardless of each map's on-screen size.
    setTimeout(() => {
      [...maps, ...spreadMaps].forEach((map) => {
        map?.invalidateSize();
        map?.fitBounds(BBOX);
      });
      updateLayers();
      updateSpreadLayers();
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

#model-spread {
  margin-bottom: 60px;
}

.spread-controls-panel {
  margin-top: 20px;
  padding: 20px;
}

.spread-ensemble-panel {
  padding: 0 20px;
}

.ensemble-empty {
  margin-top: 0.75rem;
  text-align: center;
  font-weight: bold;
  color: #b03a2e;
}

/* Every model is listed, so the ensemble reads as a selection out of the
   full set rather than a list with no denominator. */
.spread-ensemble-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 5px;
  margin: 0 auto;
  padding: 0 20px;
  max-width: 75em;
}

.ensemble-model {
  padding: 2px 8px;
  border: 1px solid #dbdbdb;
  border-radius: 3px;
  background-color: #f5f5f5;
  color: #999;
  font-size: 0.8em;
  line-height: 1.6;
  cursor: pointer;
  font-family: inherit;
  transition: none;
}

.ensemble-model:hover {
  border-color: #2c3e50;
}

.ensemble-model.is-included {
  border-color: #2c3e50;
  background-color: #2c3e50;
  color: #fff;
  font-weight: bold;
}

.spread-maps {
  padding: 20px;
  box-sizing: border-box;
  width: 100%;
}

.spread-map-row {
  display: flex;
  gap: 20px;
  width: 100%;
}

.spread-row-title {
  margin: 0 0 10px 0;
  padding: 10px;
  text-align: center;
  font-family: Arial, sans-serif;
  font-weight: bold;
  font-size: 1.25em;
}

.spread-map-row + .spread-row-title {
  margin-top: 30px;
}

.spread-chart-hint {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 20px;
  text-align: center;
  font-size: 1.1em;
  color: #555;
}

.chart-hint-icon {
  width: 20px;
  height: 32px;
  position: relative;
  top: -2px;
}

.spread-chart {
  width: 100%;
  min-height: 500px;
}

.spread-chart-container {
  margin: 20px auto;
  padding: 20px;
  width: 100%;
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
  font-family: Arial, sans-serif;
  border-radius: 4px;
}

.overview-map {
  margin: 1.5rem 5rem;
  aspect-ratio: 1.35;
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
  background-color: #e0e0e0;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  position: relative;
  aspect-ratio: 1.35;
}

/* Closer to the shape of the coverage than the Model outputs maps, so the
   islands fill more of a two-per-row layout. */
.spread-map {
  aspect-ratio: 1.35;
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

.chart-hint {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 20px;
  text-align: center;
  font-size: 1.1em;
  color: #555;
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

/* Overview map pans and zooms, so it keeps the normal Leaflet cursors */
.overview-map .leaflet-container {
  cursor: grab;
}

.overview-map .leaflet-container:active {
  cursor: grabbing;
}

.overview-map .leaflet-control-zoom a {
  cursor: pointer;
}
</style>
