export default defineNuxtConfig({
  extends: ['@loganrenz/nuxt-v4-template-layer'],

  future: {
    compatibilityVersion: 4,
  },

  devServer: {
    port: 3014,
  },

  runtimeConfig: {
    public: {
      appUrl: process.env.SITE_URL || 'http://localhost:3014',
      appName: 'Dashboard Example',
      authAppUrl: process.env.EXAMPLE_AUTH_URL || 'http://localhost:3011',
    },
  },

  site: {
    url: process.env.SITE_URL || 'http://localhost:3014',
    name: 'Dashboard Example',
    description: 'Protected dashboard with sidebar navigation.',
    defaultLocale: 'en',
  },
})
