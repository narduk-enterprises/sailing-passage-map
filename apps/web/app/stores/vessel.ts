import type { VesselEncounter } from '~/types/vessel-encounter'

export interface SelectedVesselData {
    name: string
    type?: string
    mmsi?: string
    speed: string
    heading: string
    distance: string
    length?: string
    flag?: string
    timestamp: string
}

export const useVesselStore = () => {
    const encounters = useState<VesselEncounter[]>('vesselEncounters', () => [])
    const selectedVessel = useState<SelectedVesselData | null>('selectedVessel', () => null)

    const setEncounters = (data: VesselEncounter[]) => {
        encounters.value = data
    }

    const selectVessel = (data: SelectedVesselData | null) => {
        selectedVessel.value = data
    }

    return {
        encounters,
        selectedVessel,
        setEncounters,
        selectVessel,
    }
}
