// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  css: [
    'leaflet/dist/leaflet.css'
  ],
  app: {
    head: {
      title: 'Downscaled CMIP6 Precipitation for Hawai\u02bbi',
      link: [
        { rel: 'stylesheet', href: 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css' }
      ]
    }
  },
  devServer: {
    port: 3000
  }
})
