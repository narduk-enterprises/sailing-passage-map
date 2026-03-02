export default defineNuxtConfig({
  extends: ['@loganrenz/nuxt-v4-template-layer'],

  future: {
    compatibilityVersion: 4,
  },

  devServer: {
    port: 3010,
  },

  runtimeConfig: {
    public: {
      appUrl: process.env.SITE_URL || 'http://localhost:3010',
      appName: process.env.APP_NAME || 'Nuxt 4 Showcase',
      exampleAuthUrl: process.env.EXAMPLE_AUTH_URL || 'http://localhost:3011',
      exampleBlogUrl: process.env.EXAMPLE_BLOG_URL || 'http://localhost:3012',
      exampleMarketingUrl: process.env.EXAMPLE_MARKETING_URL || 'http://localhost:3013',
      exampleDashboardUrl: process.env.EXAMPLE_DASHBOARD_URL || 'http://localhost:3014',
      exampleOgImageUrl: process.env.EXAMPLE_OG_IMAGE_URL || 'http://localhost:3015',
      exampleAppleMapsUrl: process.env.EXAMPLE_APPLE_MAPS_URL || 'http://localhost:3016',
    },
  },

  site: {
    url: process.env.SITE_URL || 'https://showcase.nuxt-v4-template.workers.dev',
    name: 'Nuxt 4 Showcase',
    description: 'Interactive examples showcasing Nuxt 4 + Nuxt UI 4 + Cloudflare Workers patterns.',
    defaultLocale: 'en',
  },

  schemaOrg: {
    identity: {
      type: 'Organization',
      name: 'Nuxt 4 Showcase',
      url: process.env.SITE_URL || 'https://showcase.nuxt-v4-template.workers.dev',
      logo: '/favicon.svg',
    },
  },
})
