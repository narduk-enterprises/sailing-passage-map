import type { Passage } from '~/types/passage'
import type { PassageEncounters } from '~/types/vessel-encounter'

/**
 * Load a single passage with its data
 */
export async function loadPassage(passageId: string): Promise<Passage | null> {
    try {
        const data = await $fetch<Passage>(`/api/passages/${passageId}`)
        return data
    }
    catch (error) {
        console.error(`Failed to load passage ${passageId}:`, error)
        return null
    }
}

/**
 * Load passage list (metadata only)
 */
export async function loadPassageList(): Promise<Passage[]> {
    try {
        const data = await $fetch<Passage[]>('/api/passages/list')
        return data || []
    }
    catch (error) {
        console.error('Failed to load passage list:', error)
        return []
    }
}

/**
 * Load vessel encounters for a passage
 */
export async function loadVesselEncounters(
    encountersFilename: string,
): Promise<PassageEncounters | null> {
    try {
        const data = await $fetch<PassageEncounters>(
            `/api/passages/encounters?file=${encodeURIComponent(encountersFilename)}`,
        )
        return data
    }
    catch (error) {
        console.error('Failed to load vessel encounters:', error)
        return null
    }
}

/**
 * Sort passages by start time (newest first)
 */
export function sortPassagesByDate(passages: Passage[]): Passage[] {
    return [...passages].sort((a, b) => {
        return new Date(b.startTime).getTime() - new Date(a.startTime).getTime()
    })
}
