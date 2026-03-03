import type { Passage } from '~/types/passage'

export const usePassageStore = () => {
    const passages = useState<Passage[]>('passages', () => [])
    const selectedPassage = useState<Passage | null>('selectedPassage', () => null)
    const currentTime = useState<string | null>('currentTime', () => null)
    const isPlaying = useState<boolean>('isPlaying', () => false)
    const playbackSpeed = useState<number>('playbackSpeed', () => 1)

    const selectPassage = (passage: Passage | null) => {
        selectedPassage.value = passage
        if (passage) {
            currentTime.value = passage.startTime
        }
        else {
            currentTime.value = null
        }
    }

    const setTime = (time: string) => {
        currentTime.value = time
    }

    const togglePlayback = () => {
        isPlaying.value = !isPlaying.value
    }

    return {
        passages,
        selectedPassage,
        currentTime,
        isPlaying,
        playbackSpeed,
        selectPassage,
        setTime,
        togglePlayback,
    }
}
