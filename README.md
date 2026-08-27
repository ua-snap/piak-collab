# piak-collab

Downscaled CMIP6 precipitation for Hawai&#699;i. Pacific Islands + Alaska CASC
technical proof-of-concept.

## Running in dev mode

```
nvm use lts/jod
npm install
npm run dev
```

Serves on http://localhost:3000.

## External dependencies

- **Rasdaman** at `zeus.snap.uaf.edu` — serves the `piak_collab` coverage over
  WMS (single-model and all-30 range maps) and WCS/WCPS (chart values, and
  range maps over a chosen subset of models). No API key. The app is unusable
  if it is down.
- **USGS National Map** basemap tiles, from the ArcGIS tile cache.

Everything else is npm: Nuxt, Vue, Leaflet, Plotly, Bulma.

## Further work

- Cut cold-load time. Every request goes to one host, so the browser's
  per-host connection cap leaves the WCPS images queued behind the Model
  outputs tiles.
- Cancel superseded image requests.
- Size the WCPS render grid to the map rather than a fixed 1152x768.
- Surface how many models are behind each box in the spread chart. Some
  model/scenario combinations have no data at a given point, so a box can hold
  fewer points than its group size implies.
- Clicks landing exactly on a coastline are ignored: the rendered land mask
  extends slightly past the polygon the click is tested against. Affects both
  map sections.
- Test below desktop widths.
