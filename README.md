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

- Build the chart for the Explore Model Spread section; its maps are not
  clickable and carry no land mask.
- Cut cold-load time. Every request goes to one host, so the browser's
  per-host connection cap leaves the WCPS images queued behind the Model
  outputs tiles.
- Debounce the scenario / horizon / season controls, and cancel superseded
  image requests.
- Size the WCPS render grid to the map rather than a fixed 1152x768.
- De-duplicate the legend markup; rows that share a scale could share a legend.
- Remove `aggregateView` and the aggregate chart branch, or restore a control
  that reaches them.
- Test below desktop widths.
