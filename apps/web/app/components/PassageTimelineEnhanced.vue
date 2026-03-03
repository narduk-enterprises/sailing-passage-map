<template>
  <div class="pm-timeline">
    <div v-if="!store.selectedPassage.value" class="pm-empty" style="font-size: 0.875rem;">
      <span>Select a passage to view the timeline</span>
    </div>

    <template v-else>
      <!-- Controls row -->
      <div class="pm-timeline-controls">
        <button class="pm-play-btn" @click="togglePlayback">
          <span v-if="isPlaying">⏸</span>
          <span v-else>▶</span>
        </button>

        <!-- Speed selector -->
        <span
          v-for="speed in speeds"
          :key="speed"
          class="pm-speed-badge"
          :style="{ background: playbackSpeed === speed ? 'var(--pm-accent)' : '', color: playbackSpeed === speed ? 'white' : '', borderColor: playbackSpeed === speed ? 'var(--pm-accent)' : '' }"
          @click="setSpeed(speed)"
        >
          {{ speed }}×
        </span>

        <!-- Time display -->
        <span style="margin-left: auto; font-size: 0.8125rem; color: var(--pm-text-muted); font-variant-numeric: tabular-nums;">
          {{ currentTimeDisplay }}
        </span>
      </div>

      <!-- Progress bar -->
      <div class="pm-timeline-track" @click="onTrackClick">
        <div class="pm-timeline-progress" :style="{ width: `${progress * 100}%` }" />
      </div>

      <!-- Info row -->
      <div class="pm-timeline-info">
        <span>{{ startDisplay }}</span>
        <span v-if="interpolatedPosition" style="color: var(--pm-ocean);">
          {{ formatSpeed(interpolatedPosition.speed || 0) }} · {{ formatCoordinate(interpolatedPosition.lat, interpolatedPosition.lon) }}
        </span>
        <span>{{ endDisplay }}</span>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { usePlayback } from '~/composables/usePlayback'
import { interpolatePosition, formatSpeed, formatCoordinate } from '~/utils/mapHelpers'
import { formatTime } from '~/utils/dateHelpers'

const store = usePassageStore()
const { isPlaying, playbackSpeed, currentTime, progress, togglePlayback, setSpeed, seekToProgress } = usePlayback()

const speeds = [1, 2, 5, 10, 50]

const currentTimeDisplay = computed(() => {
  if (!currentTime.value) return '--:--:--'
  return formatTime(currentTime.value)
})

const startDisplay = computed(() => {
  if (!store.selectedPassage.value) return ''
  return formatTime(store.selectedPassage.value.startTime)
})

const endDisplay = computed(() => {
  if (!store.selectedPassage.value) return ''
  return formatTime(store.selectedPassage.value.endTime)
})

const interpolatedPosition = computed(() => {
  if (!store.selectedPassage.value?.positions || !currentTime.value) return null
  return interpolatePosition(store.selectedPassage.value.positions, currentTime.value)
})

function onTrackClick(e: MouseEvent) {
  const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
  const pct = (e.clientX - rect.left) / rect.width
  seekToProgress(pct)
}
</script>
