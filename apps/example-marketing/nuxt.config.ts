export default defineNuxtConfig({
  extends: ['@loganrenz/nuxt-v4-template-layer'],

  components: [
    { path: '~/app/components/ui', pathPrefix: false },
  ],

  future: {
    compatibilityVersion: 4,
  },

  devServer: {
    port: 3013,
  },

  runtimeConfig: {
    public: {
      appUrl: process.env.SITE_URL || 'http://localhost:3013',
      appName: 'Marketing Example',
    },
  },

  site: {
    url: process.env.SITE_URL || 'http://localhost:3013',
    name: 'Marketing Example',
    description: 'Landing page components: hero, pricing, testimonials, and contact forms.',
    defaultLocale: 'en',
  },
})
