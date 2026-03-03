<script setup lang="ts">
import type { Passage, LocationInfo } from '~/types/passage'
import { formatDuration, formatDateRange } from '~/utils/dateHelpers'

const props = defineProps<{
  passage: Passage
}>()

const dateRangeDisplay = computed(() => formatDateRange(props.passage.startTime, props.passage.endTime))

function formatLocationArea(loc: LocationInfo): string {
  return [loc.administrativeArea, loc.country].filter(Boolean).join(', ')
}
</script>

<template>
  <div>
    <div class="pm-detail-card" style="margin-bottom: 1rem;">
      <h3>Passage Details</h3>
      <div class="pm-detail-grid">
        <div>
          <div class="pm-detail-value">{{ props.passage.distance.toFixed(1) }}</div>
          <div class="pm-detail-label">nm distance</div>
        </div>
        <div>
          <div class="pm-detail-value">{{ formatDuration(props.passage.duration) }}</div>
          <div class="pm-detail-label">duration</div>
        </div>
        <div>
          <div class="pm-detail-value">{{ props.passage.avgSpeed.toFixed(1) }}</div>
          <div class="pm-detail-label">avg speed (kn)</div>
        </div>
        <div>
          <div class="pm-detail-value">{{ props.passage.maxSpeed.toFixed(1) }}</div>
          <div class="pm-detail-label">max speed (kn)</div>
        </div>
      </div>
    </div>

    <div class="pm-detail-card" style="margin-bottom: 1rem;">
      <h3>Route</h3>
      <div style="font-size: 0.875rem; color: var(--pm-text-muted);">
        {{ props.passage.route || 'Route not available' }}
      </div>
      <div style="font-size: 0.8125rem; color: var(--pm-text-dim); margin-top: 0.5rem;">
        {{ dateRangeDisplay }}
      </div>
    </div>

    <div v-if="props.passage.locations && props.passage.locations.length > 0" class="pm-detail-card">
      <h3>Locations</h3>
      <div v-for="(loc, i) in props.passage.locations" :key="i" style="padding: 0.375rem 0; border-bottom: 1px solid var(--pm-border-subtle);">
        <div style="font-size: 0.875rem;">{{ loc.name || loc.locality || 'Unknown' }}</div>
        <div style="font-size: 0.75rem; color: var(--pm-text-dim);">
          {{ formatLocationArea(loc) }}
        </div>
      </div>
    </div>
  </div>
</template>
