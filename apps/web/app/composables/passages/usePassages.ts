import type { Passage } from '~/types/passage'
import { usePassageStore } from '~/stores/passage'
import { loadPassageList, loadPassage, sortPassagesByDate } from '~/utils/passageLoader'

/**
 * Composable for managing passage fetching and selection
 */
export function usePassages() {
    const store = usePassageStore()
    const loading = ref(false)
    const error = ref<string | null>(null)

    /**
     * Fetch all passages from the API
     */
    async function fetchPassages() {
        loading.value = true
        error.value = null
        try {
            const list = await loadPassageList()
            store.passages.value = sortPassagesByDate(list)
        }
        catch (e) {
            error.value = e instanceof Error ? e.message : 'Failed to load passages'
            console.error('Error fetching passages:', e)
        }
        finally {
            loading.value = false
        }
    }

    /**
     * Select a passage and load its full data (positions, encounters, etc.)
     */
    async function selectPassage(passage: Passage) {
        loading.value = true
        error.value = null
        try {
            const fullPassage = await loadPassage(passage.id)
            if (fullPassage) {
                store.selectPassage(fullPassage)
            }
        }
        catch (e) {
            error.value = e instanceof Error ? e.message : 'Failed to load passage'
            console.error('Error selecting passage:', e)
        }
        finally {
            loading.value = false
        }
    }

    /**
     * Clear current selection
     */
    function clearSelection() {
        store.selectPassage(null)
    }

    return {
        passages: store.passages,
        selectedPassage: store.selectedPassage,
        loading: readonly(loading),
        error: readonly(error),
        fetchPassages,
        selectPassage,
        clearSelection,
    }
}
