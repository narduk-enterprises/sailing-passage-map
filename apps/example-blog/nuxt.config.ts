const mdcOptimizeDepsPackages = [
  '@nuxtjs/mdc',
  'remark-gfm',
  'remark-emoji',
  'remark-mdc',
  'remark-rehype',
  'rehype-raw',
  'parse5',
  'unist-util-visit',
  'unified',
  'debug',
]

export default defineNuxtConfig({
  extends: ['@loganrenz/nuxt-v4-template-layer'],

  modules: ['@nuxt/content'],

  future: {
    compatibilityVersion: 4,
  },

  hooks: {
    // Strip MDC/remark/rehype from optimizeDeps.include so Vite doesn't try to pre-bundle
    // them (they're transitive deps that can fail to resolve in pnpm; content runs server-side).
    ready(nuxt) {
      const include = nuxt.options.vite?.optimizeDeps?.include as
        | string[]
        | undefined
      if (include?.length) {
        nuxt.options.vite!.optimizeDeps!.include = include.filter(
          (entry) =>
            !mdcOptimizeDepsPackages.some(
              (pkg) => entry === pkg || entry.startsWith(`${pkg}>`),
            ),
        )
      }
    },
  },

  vite: {
    optimizeDeps: {
      exclude: mdcOptimizeDepsPackages,
    },
  },

  devServer: {
    port: 3012,
  },

  runtimeConfig: {
    public: {
      appUrl: process.env.SITE_URL || 'http://localhost:3012',
      appName: 'Blog Example',
    },
  },

  site: {
    url: process.env.SITE_URL || 'http://localhost:3012',
    name: 'Blog Example',
    description: 'Content-driven blog powered by Nuxt Content v3.',
    defaultLocale: 'en',
  },
})
