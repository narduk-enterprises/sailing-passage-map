import type { PassagePosition } from '~/types/passage'
import { calculateBoundingRegion } from '~/utils/mapGeometry'

/**
 * Manages passage track overlays on the map
 */
export function usePassageOverlays(map: Ref<mapkit.Map | null>) {
    const overlays = ref<mapkit.Overlay[]>([])
    const boatAnnotation = ref<mapkit.Annotation | null>(null)

    /**
     * Draw passage track on the map
     */
    function drawTrack(positions: PassagePosition[]) {
        if (!map.value || positions.length === 0) return

        clearOverlays()

        const coordinates = positions.map(
            p => new mapkit.Coordinate(p.lat, p.lon),
        )

        const polyline = new mapkit.PolylineOverlay(coordinates, {
            style: new mapkit.Style({
                lineWidth: 3,
                strokeColor: '#3b82f6',
                strokeOpacity: 0.8,
                lineCap: 'round',
                lineJoin: 'round',
            }),
        })

        map.value.addOverlay(polyline)
        overlays.value.push(polyline)

        // Add start/end markers
        const startCoord = coordinates[0]!
        const endCoord = coordinates.at(-1)!

        const startAnnotation = new mapkit.MarkerAnnotation(startCoord, {
            color: '#22c55e',
            glyphText: 'S',
            title: 'Start',
        })

        const endAnnotation = new mapkit.MarkerAnnotation(endCoord, {
            color: '#ef4444',
            glyphText: 'E',
            title: 'End',
        })

        map.value.addAnnotations([startAnnotation, endAnnotation])

        // Fit map to track
        const region = calculateBoundingRegion(positions)
        const mapRegion = new mapkit.CoordinateRegion(
            new mapkit.Coordinate(region.center.lat, region.center.lon),
            new mapkit.CoordinateSpan(region.span.latDelta, region.span.lonDelta),
        )
        map.value.setRegionAnimated(mapRegion, true)
    }

    /**
     * Update boat position annotation
     */
    function updateBoatPosition(lat: number, lon: number, heading?: number) {
        if (!map.value) return

        const coordinate = new mapkit.Coordinate(lat, lon)

        if (boatAnnotation.value) {
            boatAnnotation.value.coordinate = coordinate
        }
        else {
            const annotation = new mapkit.MarkerAnnotation(coordinate, {
                color: '#f59e0b',
                glyphText: '⛵',
                title: 'Current Position',
            })
            map.value.addAnnotation(annotation)
            boatAnnotation.value = annotation
        }
    }

    /**
     * Clear all overlays
     */
    function clearOverlays() {
        if (!map.value) return

        for (const overlay of overlays.value) {
            map.value.removeOverlay(overlay)
        }
        overlays.value = []

        if (boatAnnotation.value) {
            map.value.removeAnnotation(boatAnnotation.value)
            boatAnnotation.value = null
        }

        // Remove all annotations
        if (map.value.annotations.length > 0) {
            map.value.removeAnnotations(map.value.annotations)
        }
    }

    onUnmounted(() => {
        clearOverlays()
    })

    return {
        drawTrack,
        updateBoatPosition,
        clearOverlays,
    }
}
