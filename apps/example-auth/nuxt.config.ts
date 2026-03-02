import { fileURLToPath } from 'node:url'
import { resolve, dirname } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))

export default defineNuxtConfig({
  extends: ['@loganrenz/nuxt-v4-template-layer'],

  modules: ['nitro-cloudflare-dev', 'nuxt-auth-utils'],

  nitro: {
    cloudflareDev: {
      configPath: resolve(__dirname, 'wrangler.json'),
    },
  },

  future: {
    compatibilityVersion: 4,
  },

  devServer: {
    port: 3011,
  },

  runtimeConfig: {
    public: {
      appName: 'Auth Example',
    },
  },

  site: {
    url: 'http://localhost:3011',
    name: 'Auth Example',
    description: 'Authentication example using Web Crypto PBKDF2 and D1 sessions.',
    defaultLocale: 'en',
  },
})
