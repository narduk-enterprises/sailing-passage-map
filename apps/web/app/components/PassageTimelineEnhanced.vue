<script setup lang="ts">
import { usePlayback } from '~/composables/usePlayback'
import { usePassageStore } from '~/stores/passage'
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

const currentSpeedDisplay = computed(() => {
  if (!interpolatedPosition.value) return ''
  return formatSpeed(interpolatedPosition.value.speed || 0)
})

const currentCoordDisplay = computed(() => {
  if (!interpolatedPosition.value) return ''
  return formatCoordinate(interpolatedPosition.value.lat, interpolatedPosition.value.lon)
})

function onTrackClick(e: MouseEvent) {
  const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
  const pct = (e.clientX - rect.left) / rect.width
  seekToProgress(pct)
}

function isActiveSpeed(speed: number): boolean {
  return playbackSpeed.value === speed
}
</script>

<template>
  <div class="pm-timeline">
    <div v-if="!store.selectedPassage.value" class="pm-empty" style="font-size: 0.875rem;">
      <span>Select a passage to view the timeline</span>
    </div>

    <template v-else>
      <!-- Controls row -->
      <div class="pm-timeline-controls">
        <UButton
          :icon="isPlaying ? 'i-lucide-pause' : 'i-lucide-play'"
          size="sm"
          color="primary"
          variant="solid"
          class="rounded-full"
          @click="togglePlayback"
        />

        <!-- Speed selector -->
        <span
          v-for="speed in speeds"
          :key="speed"
          class="pm-speed-badge"
          :class="{ active: isActiveSpeed(speed) }"
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
          {{ currentSpeedDisplay }} · {{ currentCoordDisplay }}
        </span>
        <span>{{ endDisplay }}</span>
      </div>
    </template>
  </div>
</template>
