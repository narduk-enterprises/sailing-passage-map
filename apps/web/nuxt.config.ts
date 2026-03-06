// deploy-trigger: 2026-03-04T20:40:25Z
import { fileURLToPath } from 'node:url'
import { resolve, dirname } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  // Extend the published Narduk Nuxt Layer
  extends: ['@narduk-enterprises/narduk-nuxt-template-layer'],

  // nitro-cloudflare-dev proxies D1 bindings to the local dev server
  modules: ['nitro-cloudflare-dev'],

  nitro: {
    cloudflareDev: {
      configPath: resolve(__dirname, 'wrangler.json'),
    },
  },

  future: {
    compatibilityVersion: 4,
  },

  css: ['~/assets/css/main.css'],

  runtimeConfig: {
    session: {
      password:
        process.env.NUXT_SESSION_PASSWORD ||
        (import.meta.dev ? 'sailing-passage-map-dev-session-min-32-chars' : ''),
    },
    // MapKit JWT signing
    mapkitDevToken: process.env.MAPKIT_DEV_TOKEN || '',
    mapkitProdToken: process.env.MAPKIT_PROD_TOKEN || '',
    // InfluxDB
    influxUrl: process.env.INFLUX_URL || 'http://influx.tideye.com:8086',
    influxToken: process.env.INFLUX_API_KEY || '',
    influxOrgId: process.env.INFLUX_ORG_ID || '',
    influxBucket: process.env.INFLUX_BUCKET_DEFAULT || 'Tideye',
    // R2 S3 API credentials (fallback when bindings aren't available)
    r2AccessKeyId: process.env.R2_ACCESS_KEY_ID || '',
    r2SecretAccessKey: process.env.R2_SECRET_ACCESS_KEY || '',
    // D2 API configuration (for external access)
    d2ApiUrl: process.env.D2_API_URL || '',
    d2ApiKey: process.env.D2_API_KEY || '',
    // Server-only (admin API routes, from layer)
    googleServiceAccountKey: process.env.GSC_SERVICE_ACCOUNT_JSON || '',
    posthogApiKey: process.env.POSTHOG_PERSONAL_API_KEY || '',
    gaPropertyId: process.env.GA_PROPERTY_ID || '',
    posthogProjectId: process.env.POSTHOG_PROJECT_ID || '',
    public: {
      appUrl: process.env.SITE_URL || 'https://tideye.com',
      appName: process.env.APP_NAME || 'Sailing Passage Map',
      // Analytics
      posthogPublicKey: process.env.POSTHOG_PUBLIC_KEY || '',
      posthogHost: process.env.POSTHOG_HOST || 'https://us.i.posthog.com',
      gaMeasurementId: process.env.GA_MEASUREMENT_ID || '',
      posthogProjectId: process.env.POSTHOG_PROJECT_ID || '',
      // IndexNow
      indexNowKey: process.env.INDEXNOW_KEY || '',
    },
  },

  site: {
    url: process.env.SITE_URL || 'https://tideye.com',
    name: 'Sailing Passage Map',
    description: 'Interactive sailing passage map with vessel tracking, AIS encounter data, and passage history visualization.',
    defaultLocale: 'en',
  },

  schemaOrg: {
    identity: {
      type: 'Organization',
      name: 'Sailing Passage Map',
      url: process.env.SITE_URL || 'https://tideye.com',
      logo: '/favicon.svg',
    },
  },

  image: {
    cloudflare: {
      baseURL: process.env.SITE_URL || 'https://tideye.com',
    },
  },

  app: {
    head: {
      title: 'Passage Map',
      htmlAttrs: { lang: 'en' },
      meta: [
        { name: 'theme-color', content: '#f8fafc' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1, maximum-scale=5, user-scalable=yes, viewport-fit=cover' },
        { name: 'apple-mobile-web-app-capable', content: 'yes' },
        { name: 'apple-mobile-web-app-status-bar-style', content: 'default' },
        { name: 'mobile-web-app-capable', content: 'yes' },
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
      ],
      script: [
        {
          src: 'https://cdn.apple-mapkit.com/mk/5.x.x/mapkit.js',
          defer: true,
          crossorigin: 'anonymous',
        },
      ],
    },
  },
})
