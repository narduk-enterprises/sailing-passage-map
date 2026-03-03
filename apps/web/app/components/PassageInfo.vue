<template>
  <div>
    <div class="pm-detail-card" style="margin-bottom: 1rem;">
      <h3>Passage Details</h3>
      <div class="pm-detail-grid">
        <div>
          <div class="pm-detail-value">{{ passage.distance.toFixed(1) }}</div>
          <div class="pm-detail-label">nm distance</div>
        </div>
        <div>
          <div class="pm-detail-value">{{ formatDuration(passage.duration) }}</div>
          <div class="pm-detail-label">duration</div>
        </div>
        <div>
          <div class="pm-detail-value">{{ passage.avgSpeed.toFixed(1) }}</div>
          <div class="pm-detail-label">avg speed (kn)</div>
        </div>
        <div>
          <div class="pm-detail-value">{{ passage.maxSpeed.toFixed(1) }}</div>
          <div class="pm-detail-label">max speed (kn)</div>
        </div>
      </div>
    </div>

    <div class="pm-detail-card" style="margin-bottom: 1rem;">
      <h3>Route</h3>
      <div style="font-size: 0.875rem; color: var(--pm-text-muted);">
        {{ passage.route || 'Route not available' }}
      </div>
      <div style="font-size: 0.8125rem; color: var(--pm-text-dim); margin-top: 0.5rem;">
        {{ formatDateRange(passage.startTime, passage.endTime) }}
      </div>
    </div>

    <div v-if="passage.locations && passage.locations.length > 0" class="pm-detail-card">
      <h3>Locations</h3>
      <div v-for="(loc, i) in passage.locations" :key="i" style="padding: 0.375rem 0; border-bottom: 1px solid var(--pm-border-subtle);">
        <div style="font-size: 0.875rem;">{{ loc.name || loc.locality || 'Unknown' }}</div>
        <div style="font-size: 0.75rem; color: var(--pm-text-dim);">
          {{ [loc.administrativeArea, loc.country].filter(Boolean).join(', ') }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Passage } from '~/types/passage'
import { formatDuration, formatDateRange } from '~/utils/dateHelpers'

defineProps<{
  passage: Passage
}>()
</script>
