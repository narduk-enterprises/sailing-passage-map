<script setup lang="ts">
useSeo({
  title: 'Apple Maps Example',
  description: 'Apple MapKit JS integration on Nuxt 4 and Cloudflare Workers.',
  ogImage: {
    title: 'Apple Maps Example',
    description: 'MapKit JS in Nuxt 4',
    icon: '🗺️',
  },
})

useWebPageSchema({
  name: 'Apple Maps Example',
  description: 'Apple MapKit JS integration on Nuxt 4 and Cloudflare Workers.',
})

const config = useRuntimeConfig()
const mapContainerRef = ref<HTMLElement | null>(null)
const mapReady = ref(false)
const mapError = ref<string | null>(null)

function loadMapKit(): Promise<void> {
  if (typeof window === 'undefined') return Promise.resolve()
  if ((window as unknown as { mapkit?: { loadedLibraries?: string[] } }).mapkit?.loadedLibraries?.length) {
    return Promise.resolve()
  }
  return new Promise((resolve, reject) => {
    ;(window as unknown as { initMapKit?: () => void }).initMapKit = () => {
      delete (window as unknown as { initMapKit?: () => void }).initMapKit
      resolve()
    }
    const token = (config.public as { appleMapkitToken?: string }).appleMapkitToken
    if (!token) {
      reject(new Error('APPLE_MAPKIT_TOKEN is not set'))
      return
    }
    const script = document.createElement('script')
    script.src = 'https://cdn.apple-mapkit.com/mk/5.x.x/mapkit.core.js'
    script.crossOrigin = 'anonymous'
    script.async = true
    script.dataset.callback = 'initMapKit'
    script.dataset.libraries = 'map'
    script.dataset.token = token
    script.onerror = () => reject(new Error('Failed to load MapKit JS'))
    document.head.appendChild(script)
  })
}

function initMap() {
  if (typeof window === 'undefined' || !mapContainerRef.value || !(window as unknown as { mapkit?: unknown }).mapkit) return
  const mapkit = (window as unknown as { mapkit: { Map: new (id: string) => { region: unknown }; CoordinateRegion: new (coord: unknown, span: unknown) => unknown; Coordinate: new (lat: number, lng: number) => unknown; CoordinateSpan: new (latDelta: number, lngDelta: number) => unknown } }).mapkit
  const region = new mapkit.CoordinateRegion(
    new mapkit.Coordinate(48.2082, 16.3738),
    new mapkit.CoordinateSpan(0.05, 0.05),
  )
  const map = new mapkit.Map('apple-map-container')
  map.region = region
}

onMounted(async () => {
  try {
    await loadMapKit()
    await nextTick()
    initMap()
    mapReady.value = true
  } catch (e) {
    mapError.value = e instanceof Error ? e.message : 'Failed to load map'
  }
})
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <header class="border-b border-default bg-default/80 backdrop-blur-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
        <NuxtLink to="/" class="font-display font-bold text-lg">
          <span class="text-primary">Apple Maps</span> Example
        </NuxtLink>
      </div>
    </header>

    <main class="flex-1 flex flex-col p-4">
      <div class="max-w-4xl mx-auto w-full space-y-4">
        <p class="text-muted text-sm">
          MapKit JS 5.x on Nuxt 4. Token is provided via <code class="rounded bg-elevated px-1">APPLE_MAPKIT_TOKEN</code> or default in this example.
        </p>
        <div class="rounded-xl overflow-hidden border border-default shadow-card min-h-[400px] bg-muted/30 relative">
          <div
            v-if="mapError"
            class="flex items-center justify-center min-h-[400px] text-destructive"
          >
            {{ mapError }}
          </div>
          <template v-else>
            <div
              id="apple-map-container"
              ref="mapContainerRef"
              class="w-full h-[400px]"
              data-testid="apple-map"
            />
            <div
              v-if="!mapReady"
              class="absolute inset-0 flex items-center justify-center bg-muted/50 text-muted"
            >
              Loading map…
            </div>
          </template>
        </div>
      </div>
    </main>
  </div>
</template>
