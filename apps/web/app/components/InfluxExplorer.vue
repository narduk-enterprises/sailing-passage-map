<script setup lang="ts">
import { useInfluxExplorer } from '~/composables/useInfluxExplorer'

const {
  query,
  loading,
  error,
  results,
  schema,
  resultColumns,
  displayedResults,
  runQuery,
  loadSchema,
  formatCell,
} = useInfluxExplorer()
</script>

<template>
  <div>
    <!-- Query editor -->
    <div class="pm-query-editor" style="margin-bottom: 1.5rem;">
      <h2 style="font-size: 1rem; font-weight: 600; margin: 0 0 0.75rem 0;">Custom Query</h2>
      <UTextarea
        v-model="query"
        placeholder="Enter a Flux query..."
        :spellcheck="false"
        autoresize
        :rows="5"
      />
      <div style="display: flex; gap: 0.5rem; margin-top: 0.75rem;">
        <UButton :loading="loading" @click="runQuery">
          Run Query
        </UButton>
        <UButton variant="outline" @click="loadSchema">
          Explore Schema
        </UButton>
      </div>
    </div>

    <!-- Error -->
    <div v-if="error" style="background: rgba(239, 68, 68, 0.1); border: 1px solid var(--pm-danger); border-radius: var(--pm-radius); padding: 1rem; margin-bottom: 1rem; color: var(--pm-danger); font-size: 0.875rem;">
      {{ error }}
    </div>

    <!-- Schema results -->
    <div v-if="schema" class="pm-detail-card" style="margin-bottom: 1.5rem;">
      <h3>Schema</h3>
      <div v-for="m in schema.measurements" :key="m.name" style="margin-bottom: 0.75rem;">
        <div style="font-weight: 600; font-size: 0.875rem; color: var(--pm-ocean);">{{ m.name }}</div>
        <div style="font-size: 0.8125rem; color: var(--pm-text-dim);">
          Fields: {{ m.fields.join(', ') || 'none' }}
        </div>
        <div style="font-size: 0.8125rem; color: var(--pm-text-dim);">
          Tags: {{ m.tagKeys.join(', ') || 'none' }}
        </div>
      </div>
    </div>

    <!-- Query results -->
    <div v-if="results.length > 0" class="pm-detail-card">
      <h3>Results ({{ results.length }} rows)</h3>
      <div style="overflow-x: auto;">
        <!-- eslint-disable-next-line atx/no-native-table -- Dynamic columns from query results, UTable requires static column config -->
        <table class="pm-results-table">
          <thead>
            <tr>
              <th v-for="key in resultColumns" :key="key">{{ key }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(row, i) in displayedResults" :key="i">
              <td v-for="key in resultColumns" :key="key">{{ formatCell(row[key]) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-if="results.length > 100" style="padding-top: 0.75rem; font-size: 0.8125rem; color: var(--pm-text-dim);">
        Showing first 100 of {{ results.length }} rows
      </div>
    </div>
  </div>
</template>
