<script setup lang="ts">
import { usePassageStore } from '~/stores/passage'
import type { Passage } from '~/types/passage'
import { formatDate, formatDuration } from '~/utils/dateHelpers'

defineProps<{
  passages: Passage[]
}>()

const emit = defineEmits<{
  select: [passage: Passage]
}>()

const store = usePassageStore()

function isActive(passageId: string): boolean {
  return store.selectedPassage.value?.id === passageId
}

function onSelect(passage: Passage) {
  emit('select', passage)
}

function formatDistance(distance: number): string {
  return distance.toFixed(1)
}
</script>

<template>
  <div>
    <div
      v-for="passage in passages"
      :key="passage.id"
      class="pm-passage-item"
      :class="{ active: isActive(passage.id) }"
      @click="onSelect(passage)"
    >
      <div class="pm-passage-name">{{ passage.name || 'Unnamed Passage' }}</div>
      <div class="pm-passage-meta">
        <span class="pm-passage-stat">📅 {{ formatDate(passage.startTime) }}</span>
        <span class="pm-passage-stat">📏 {{ formatDistance(passage.distance) }} nm</span>
        <span class="pm-passage-stat">⏱ {{ formatDuration(passage.duration) }}</span>
      </div>
    </div>
  </div>
</template>
