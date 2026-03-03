<template>
  <div>
    <div
      v-for="passage in passages"
      :key="passage.id"
      class="pm-passage-item"
      :class="{ active: store.selectedPassage.value?.id === passage.id }"
      @click="$emit('select', passage)"
    >
      <div class="pm-passage-name">{{ passage.name || 'Unnamed Passage' }}</div>
      <div class="pm-passage-meta">
        <span class="pm-passage-stat">📅 {{ formatDate(passage.startTime) }}</span>
        <span class="pm-passage-stat">📏 {{ passage.distance.toFixed(1) }} nm</span>
        <span class="pm-passage-stat">⏱ {{ formatDuration(passage.duration) }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Passage } from '~/types/passage'
import { formatDate, formatDuration } from '~/utils/dateHelpers'

defineProps<{
  passages: Passage[]
}>()

defineEmits<{
  select: [passage: Passage]
}>()

const store = usePassageStore()
</script>
