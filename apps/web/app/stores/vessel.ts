import type { VesselEncounter } from '~/types/vessel-encounter'
import type { SelectedVesselData } from '~/types/vessel'

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
