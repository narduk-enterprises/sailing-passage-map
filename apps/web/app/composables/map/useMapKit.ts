/**
 * MapKit composable
 * Handles initialization and provides the map instance
 */
export function useMapKit() {
    const map = ref<mapkit.Map | null>(null)
    const isReady = ref(false)
    const error = ref<string | null>(null)

    /**
     * Initialize MapKit JS with JWT token
     */
    async function initMapKit(containerId: string) {
        if (import.meta.server) return

        try {
            // Wait for MapKit script to load
            await waitForMapKit()

            // Get JWT token
            const { token } = await $fetch<{ token: string }>('/api/mapkit/token')

            // Initialize MapKit
            mapkit.init({
                authorizationCallback: (done: (token: string) => void) => {
                    done(token)
                },
            })

            // Create map instance
            const mapInstance = new mapkit.Map(containerId, {
                mapType: mapkit.Map.MapTypes.MutedStandard,
                showsCompass: mapkit.FeatureVisibility.Hidden,
                showsZoomControl: false,
                showsMapTypeControl: false,
                showsScale: mapkit.FeatureVisibility.Adaptive,
                isRotationEnabled: true,
                isScrollEnabled: true,
                isZoomEnabled: true,
            })

            map.value = mapInstance
            isReady.value = true
        }
        catch (e) {
            error.value = e instanceof Error ? e.message : 'Failed to initialize MapKit'
            console.error('MapKit init error:', e)
        }
    }

    /**
     * Wait for the MapKit global to be available
     */
    function waitForMapKit(): Promise<void> {
        return new Promise((resolve, reject) => {
            if (typeof mapkit !== 'undefined') {
                resolve()
                return
            }

            let attempts = 0
            const maxAttempts = 50
            const interval = setInterval(() => {
                attempts++
                if (typeof mapkit !== 'undefined') {
                    clearInterval(interval)
                    resolve()
                }
                else if (attempts >= maxAttempts) {
                    clearInterval(interval)
                    reject(new Error('MapKit JS failed to load'))
                }
            }, 200)
        })
    }

    /**
     * Clean up map instance
     */
    function destroyMap() {
        if (map.value) {
            map.value.destroy()
            map.value = null
            isReady.value = false
        }
    }

    onUnmounted(() => {
        destroyMap()
    })

    return {
        map,
        isReady,
        error,
        initMapKit,
        destroyMap,
    }
}
