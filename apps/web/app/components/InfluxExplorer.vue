<template>
  <div>
    <!-- Query editor -->
    <div class="pm-query-editor" style="margin-bottom: 1.5rem;">
      <h2 style="font-size: 1rem; font-weight: 600; margin: 0 0 0.75rem 0;">Custom Query</h2>
      <textarea
        v-model="query"
        placeholder="Enter a Flux query..."
        spellcheck="false"
      />
      <div style="display: flex; gap: 0.5rem; margin-top: 0.75rem;">
        <button
          style="padding: 0.5rem 1rem; background: var(--pm-accent); color: white; border: none; border-radius: 0.5rem; cursor: pointer; font-weight: 600; font-size: 0.875rem;"
          :disabled="loading"
          @click="runQuery"
        >
          {{ loading ? 'Running…' : 'Run Query' }}
        </button>
        <button
          style="padding: 0.5rem 1rem; background: var(--pm-surface-raised); color: var(--pm-text-muted); border: 1px solid var(--pm-border); border-radius: 0.5rem; cursor: pointer; font-size: 0.875rem;"
          @click="loadSchema"
        >
          Explore Schema
        </button>
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
        <table class="pm-results-table">
          <thead>
            <tr>
              <th v-for="key in resultColumns" :key="key">{{ key }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(row, i) in results.slice(0, 100)" :key="i">
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

<script setup lang="ts">
const query = ref(`from(bucket: "Tideye")
  |> range(start: -7d)
  |> filter(fn: (r) => r["_measurement"] == "navigation.position")
  |> filter(fn: (r) => r["self"] == "t")
  |> limit(n: 10)`)

const loading = ref(false)
const error = ref<string | null>(null)
const results = ref<Record<string, unknown>[]>([])
const schema = ref<{ measurements: Array<{ name: string; fields: string[]; tagKeys: string[] }> } | null>(null)

const resultColumns = computed(() => {
  if (results.value.length === 0) return []
  const keys = new Set<string>()
  for (const row of results.value.slice(0, 10)) {
    for (const key of Object.keys(row)) {
      if (!key.startsWith('_') || key === '_time' || key === '_value' || key === '_measurement' || key === '_field') {
        keys.add(key)
      }
    }
  }
  return Array.from(keys)
})

async function runQuery() {
  loading.value = true
  error.value = null
  results.value = []

  try {
    const data = await $fetch<{ results: Record<string, unknown>[]; count: number }>('/api/influxdb/explore', {
      method: 'POST',
      body: { query: query.value },
    })
    results.value = data.results
  }
  catch (e) {
    error.value = e instanceof Error ? e.message : 'Query failed'
  }
  finally {
    loading.value = false
  }
}

async function loadSchema() {
  loading.value = true
  error.value = null

  try {
    schema.value = await $fetch('/api/influxdb/schema')
  }
  catch (e) {
    error.value = e instanceof Error ? e.message : 'Failed to load schema'
  }
  finally {
    loading.value = false
  }
}

function formatCell(value: unknown): string {
  if (value === null || value === undefined) return '–'
  if (typeof value === 'number') return value.toFixed(4)
  return String(value)
}
</script>
