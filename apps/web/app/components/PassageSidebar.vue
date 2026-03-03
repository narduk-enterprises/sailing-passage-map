<script setup lang="ts">
import { usePassages } from '~/composables/passages/usePassages'

const { passages, selectedPassage, loading, error, fetchPassages, selectPassage, clearSelection } = usePassages()

onMounted(() => {
  fetchPassages()
})
</script>

<template>
  <div>
    <div class="pm-sidebar-header">
      <h1>⛵ Passage Map</h1>
    </div>

    <div class="pm-sidebar-body">
      <!-- Loading state -->
      <div v-if="loading" class="pm-loading" style="min-height: 200px;">
        <div class="pm-loading-spinner" />
        <span>Loading passages…</span>
      </div>

      <!-- Error state -->
      <div v-else-if="error" class="pm-empty" style="min-height: 200px;">
        <span style="color: var(--pm-danger);">{{ error }}</span>
        <UButton variant="outline" @click="fetchPassages">
          Retry
        </UButton>
      </div>

      <!-- Passage details when selected -->
      <div v-else-if="selectedPassage">
        <PassageInfo :passage="selectedPassage" />
        <UButton variant="outline" class="w-full mt-4" @click="clearSelection">
          ← Back to List
        </UButton>
      </div>

      <!-- Empty state -->
      <div v-else-if="passages.length === 0" class="pm-empty" style="min-height: 200px;">
        <span>No passages found</span>
        <span style="font-size: 0.8125rem;">Generate a passage from the InfluxDB explorer</span>
      </div>

      <!-- Passage list -->
      <div v-else>
        <PassageList :passages="passages" @select="selectPassage" />
      </div>
    </div>
  </div>
</template>
