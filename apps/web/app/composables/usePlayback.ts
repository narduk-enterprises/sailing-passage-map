import { usePassageStore } from '~/stores/passage'

/**
 * Composable for passage timeline playback
 */
export function usePlayback() {
    const store = usePassageStore()
    let animationFrame: number | null = null
    let lastFrameTime = 0

    const STEP_MS = 60000 // 1 minute per step

    function startPlayback() {
        store.isPlaying.value = true
        lastFrameTime = performance.now()
        tick()
    }

    function stopPlayback() {
        store.isPlaying.value = false
        if (animationFrame !== null) {
            cancelAnimationFrame(animationFrame)
            animationFrame = null
        }
    }

    function togglePlayback() {
        if (store.isPlaying.value) {
            stopPlayback()
        }
        else {
            startPlayback()
        }
    }

    function tick() {
        if (!store.isPlaying.value || !store.selectedPassage.value || !store.currentTime.value) {
            stopPlayback()
            return
        }

        const now = performance.now()
        const elapsed = now - lastFrameTime
        lastFrameTime = now

        const currentMs = new Date(store.currentTime.value).getTime()
        const endMs = new Date(store.selectedPassage.value.endTime).getTime()
        const step = STEP_MS * store.playbackSpeed.value * (elapsed / 1000)
        const newMs = currentMs + step

        if (newMs >= endMs) {
            store.currentTime.value = store.selectedPassage.value.endTime
            stopPlayback()
            return
        }

        store.currentTime.value = new Date(newMs).toISOString()
        animationFrame = requestAnimationFrame(tick)
    }

    function setSpeed(speed: number) {
        store.playbackSpeed.value = speed
    }

    function seekTo(time: string) {
        store.currentTime.value = time
    }

    function seekToProgress(progress: number) {
        if (!store.selectedPassage.value) return
        const startMs = new Date(store.selectedPassage.value.startTime).getTime()
        const endMs = new Date(store.selectedPassage.value.endTime).getTime()
        const targetMs = startMs + (endMs - startMs) * Math.max(0, Math.min(1, progress))
        store.currentTime.value = new Date(targetMs).toISOString()
    }

    const progress = computed(() => {
        if (!store.selectedPassage.value || !store.currentTime.value) return 0
        const startMs = new Date(store.selectedPassage.value.startTime).getTime()
        const endMs = new Date(store.selectedPassage.value.endTime).getTime()
        const currentMs = new Date(store.currentTime.value).getTime()
        if (endMs === startMs) return 0
        return (currentMs - startMs) / (endMs - startMs)
    })

    onUnmounted(() => {
        stopPlayback()
    })

    return {
        isPlaying: store.isPlaying,
        playbackSpeed: store.playbackSpeed,
        currentTime: store.currentTime,
        progress,
        startPlayback,
        stopPlayback,
        togglePlayback,
        setSpeed,
        seekTo,
        seekToProgress,
    }
}
