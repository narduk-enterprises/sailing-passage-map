import { fileURLToPath } from 'node:url'

export default defineNuxtConfig({
  alias: {
    '#layer': fileURLToPath(new URL('./', import.meta.url))
  },

  modules: [
    '@nuxt/ui',
    '@nuxt/fonts',
    '@nuxt/image',
    '@nuxtjs/seo',
    '@nuxt/eslint',
  ],
  css: [fileURLToPath(new URL('./app/assets/css/main.css', import.meta.url))],

  compatibilityDate: '2025-07-15',

  hooks: {
    // Workaround for nuxt/ui#6118: @nuxt/ui@4.5.0 auto-import scanner
    // incorrectly registers 'options' (a parameter name) as an export from useResizable.js
    'imports:extend'(imports) {
      for (let i = imports.length - 1; i >= 0; i--) {
        const entry = imports[i]
        if (
          entry?.name === 'options'
          && typeof entry.from === 'string'
          && entry.from.includes('useResizable')
        ) {
          imports.splice(i, 1)
        }
      }
    },
  },

  future: {
    compatibilityVersion: 4
  },

  ui: {
    colorMode: true
  },

  colorMode: {
    preference: 'system'
  },

  ogImage: {
    defaults: {
      component: 'OgImageDefaultTakumi',
    },
  },
  
  image: {
    provider: 'cloudflare',
  },

  nitro: {
    preset: 'cloudflare-module',
    esbuild: {
      options: {
        target: 'esnext'
      }
    },
    externals: {
      inline: ['drizzle-orm']
    },
  },

  // Expose the layer configurations and files to consumers
  components: [
    { path: '~/components', pathPrefix: false }
  ]
})
