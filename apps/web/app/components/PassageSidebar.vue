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
        <button class="pm-play-btn" style="width: auto; border-radius: var(--pm-radius); padding: 0.5rem 1rem;" @click="fetchPassages">
          Retry
        </button>
      </div>

      <!-- Passage details when selected -->
      <div v-else-if="selectedPassage">
        <PassageInfo :passage="selectedPassage" />
        <button
          style="width: 100%; margin-top: 1rem; padding: 0.5rem; background: var(--pm-surface-raised); border: 1px solid var(--pm-border); border-radius: var(--pm-radius); color: var(--pm-text-muted); cursor: pointer;"
          @click="clearSelection"
        >
          ← Back to List
        </button>
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

<script setup lang="ts">
import { usePassages } from '~/composables/passages/usePassages'

const { passages, selectedPassage, loading, error, fetchPassages, selectPassage, clearSelection } = usePassages()

onMounted(() => {
  fetchPassages()
})
</script>
