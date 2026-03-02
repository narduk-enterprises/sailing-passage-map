export default defineNuxtConfig({
  extends: ['@loganrenz/nuxt-v4-template-layer'],

  future: {
    compatibilityVersion: 4,
  },

  devServer: {
    port: 3016,
  },

  runtimeConfig: {
    public: {
      appUrl: process.env.SITE_URL || 'http://localhost:3016',
      appName: 'Apple Maps Example',
      appleMapkitToken:
        process.env.APPLE_MAPKIT_TOKEN ||
        'eyJraWQiOiI0OVdRVFo0OTRTIiwidHlwIjoiSldUIiwiYWxnIjoiRVMyNTYifQ.eyJpc3MiOiJGVlNZN0NGQzNTIiwiaWF0IjoxNzcyMTUyNDIwLCJleHAiOjE3NzI3ODM5OTl9.zoFgOLvq8H54AkAV7Oh9WcJQtYA0EwB3s6IF_dj5YdNnSnzKHbBLfE8oxi2qjW2AuuEWGiRSJLqS6dQzpzDtoA',
    },
  },

  site: {
    url: process.env.SITE_URL || 'http://localhost:3016',
    name: 'Apple Maps Example',
    description: 'Apple MapKit JS integration on Nuxt 4 and Cloudflare Workers.',
    defaultLocale: 'en',
  },
})
