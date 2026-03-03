import type { VesselEncounter } from '~/types/vessel-encounter'
import { useVesselStore } from '~/stores/vessel'
import { usePassageStore } from '~/stores/passage'
import { loadVesselEncounters } from '~/utils/passageLoader'

/**
 * Composable for managing vessel encounter data
 */
export function useVesselEncounters() {
    const store = useVesselStore()
    const passageStore = usePassageStore()
    const loading = ref(false)

    /**
     * Fetch vessel encounters for the current passage
     */
    async function fetchEncounters() {
        const passage = passageStore.selectedPassage.value
        if (!passage?.encountersFilename) {
            store.setEncounters([])
            return
        }

        loading.value = true
        try {
            const data = await loadVesselEncounters(passage.encountersFilename)
            if (data) {
                store.setEncounters(data.vessels)
            }
        }
        catch (e) {
            console.error('Error loading encounters:', e)
            store.setEncounters([])
        }
        finally {
            loading.value = false
        }
    }

    // Watch for passage changes
    watch(() => passageStore.selectedPassage.value, () => {
        fetchEncounters()
    })

    return {
        encounters: store.encounters,
        selectedVessel: store.selectedVessel,
        loading: readonly(loading),
        fetchEncounters,
        selectVessel: store.selectVessel,
    }
}
