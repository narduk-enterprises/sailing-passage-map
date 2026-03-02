export default defineNuxtConfig({
  extends: ['@loganrenz/nuxt-v4-template-layer'],

  future: {
    compatibilityVersion: 4,
  },

  devServer: {
    port: 3015,
  },

  runtimeConfig: {
    public: {
      appUrl: process.env.SITE_URL || 'http://localhost:3015',
      appName: 'OG Image Example',
    },
  },

  site: {
    url: process.env.SITE_URL || 'http://localhost:3015',
    name: 'OG Image Example',
    description: 'Dynamic Open Graph image generation on Cloudflare Workers with nuxt-og-image v6 beta.',
    defaultLocale: 'en',
  },

  ogImage: {
    defaults: {
      component: 'OgPlaygroundTakumi',
      cacheMaxAgeSeconds: 60 * 10,
    },
    runtimeCacheStorage: {
      driver: 'memory',
    },
  },

  image: {
    provider: 'cloudflare',
    providers: {
      // Use raw URLs for OG previews in this demo app to avoid /cdn-cgi/image
      // transforms during local development.
      oglocal: {
        provider: 'none',
      },
    },
  },
})
