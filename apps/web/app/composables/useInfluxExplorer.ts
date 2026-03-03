/**
 * Composable for InfluxDB query execution and schema exploration
 */
export function useInfluxExplorer() {
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

    const displayedResults = computed(() => results.value.slice(0, 100))

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

    return {
        query,
        loading: readonly(loading),
        error: readonly(error),
        results,
        schema,
        resultColumns,
        displayedResults,
        runQuery,
        loadSchema,
        formatCell,
    }
}
