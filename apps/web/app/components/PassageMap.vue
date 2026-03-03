<script setup lang="ts">
import { useMapKit } from '~/composables/map/useMapKit'
import { usePassageOverlays } from '~/composables/map/usePassageOverlays'
import { usePassageStore } from '~/stores/passage'
import { interpolatePosition } from '~/utils/mapHelpers'

const mapId = 'passage-map-container'
const mapKit = useMapKit()
const store = usePassageStore()

onMounted(async () => {
  await mapKit.initMapKit(mapId)
})

// Set up overlays when map is ready
const overlays = usePassageOverlays(mapKit.map)

// Watch for passage changes to draw track
watch(
  () => store.selectedPassage.value,
  (passage) => {
    if (!passage?.positions || !mapKit.isReady.value) return
    overlays.drawTrack(passage.positions)
  },
)

// Watch current time for boat position
watch(
  () => store.currentTime.value,
  (time) => {
    if (!time || !store.selectedPassage.value?.positions) return
    const pos = interpolatePosition(store.selectedPassage.value.positions, time)
    if (pos) {
      overlays.updateBoatPosition(pos.lat, pos.lon, pos.heading)
    }
  },
)
</script>

<template>
  <div class="pm-map-container">
    <div :id="mapId" style="width: 100%; height: 100%;" />

    <div v-if="!mapKit.isReady.value" class="pm-loading" style="position: absolute; inset: 0;">
      <div class="pm-loading-spinner" />
      <span>Loading map…</span>
    </div>

    <div v-if="mapKit.error.value" class="pm-loading" style="position: absolute; inset: 0;">
      <span style="color: var(--pm-danger);">{{ mapKit.error.value }}</span>
    </div>
  </div>
</template>
