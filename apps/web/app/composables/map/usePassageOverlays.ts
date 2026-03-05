import type { PassagePosition } from '~/types/passage'
import type { VesselEncounter } from '~/types/vessel-encounter'
import { calculateBoundingRegion, haversineDistance } from '~/utils/mapGeometry'
import { interpolatePosition } from '~/utils/mapHelpers'
import { usePassageStore } from '~/stores/passage'
import type { Ref, ShallowRef } from 'vue'

/**
 * Manages passage track overlays on the map
 */
export function usePassageOverlays(map: Ref<mapkit.Map | null> | ShallowRef<mapkit.Map | null>) {
    const overlays = shallowRef<mapkit.Overlay[]>([])
    const boatAnnotation = shallowRef<mapkit.Annotation | null>(null)
    const encounterAnnotations = shallowRef<Map<string, mapkit.Annotation>>(new Map())
    const store = usePassageStore()

    // Store active passage positions for click detection
    const currentPositions = shallowRef<PassagePosition[]>([])
    
    // Tap listener for scrubbing
    function handleMapTap(event: object) {
        if (!currentPositions.value.length || !store.selectedPassage.value) return
        
        // Ensure MapKit exposes the coordinate of the tap
        const ev = event as Record<string, unknown>
        const tapCoordObj = (typeof ev.toCoordinates === 'function' ? ev.toCoordinates() : ev.coordinate) as Record<string, number>
        if (!tapCoordObj) return

        const tapCoord = { latitude: tapCoordObj.latitude as number, longitude: tapCoordObj.longitude as number }

        // Find closest position in our array
        let closestPos = currentPositions.value[0]!
        let minDistance = Infinity

        for (const pos of currentPositions.value) {
            const dist = haversineDistance(tapCoord.latitude, tapCoord.longitude, pos.lat, pos.lon)
            if (dist < minDistance) {
                minDistance = dist
                closestPos = pos
            }
        }

        // If the click is reasonably close to the track (within 5 nm)
        if (minDistance < 5 && store.currentTime) {
            store.currentTime.value = closestPos._time
        }
    }

    // Attach map listener once
    if (map.value) {
        map.value.addEventListener('single-tap', handleMapTap)
    }

    watch(map, (newMap) => {
        if (newMap) {
            newMap.addEventListener('single-tap', handleMapTap)
        }
    })

    /**
     * Draw passage track on the map
     */
    function drawTrack(positions: PassagePosition[]) {
        if (!map.value || positions.length === 0) return

        clearOverlays()
        currentPositions.value = positions

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
    function updateBoatPosition(lat: number, lon: number, _heading?: number) {
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
     * Update other vessels (encounters) positions at a given time
     */
    function updateEncounterPositions(time: string, vessels: VesselEncounter[]) {
        if (!map.value || !vessels || vessels.length === 0) return

        const targetMs = new Date(time).getTime()
        const activeVesselIds = new Set<string>()

        for (const vessel of vessels) {
            for (const segment of vessel.encounterSegments) {
                const startMs = new Date(segment.startTime).getTime()
                const endMs = new Date(segment.endTime).getTime()

                // If time falls within this encounter segment
                if (targetMs >= startMs && targetMs <= endMs) {
                    activeVesselIds.add(vessel.vesselId)
                    
                    // We can reuse the interpolatePosition helper by casting VesselPosition to PassagePosition-like
                    const pos = interpolatePosition(segment.positions as unknown as PassagePosition[], time)
                    
                    if (pos) {
                        const coordinate = new mapkit.Coordinate(pos.lat, pos.lon)
                        
                        let annotation = encounterAnnotations.value.get(vessel.vesselId)
                        if (annotation) {
                            annotation.coordinate = coordinate
                        } else {
                            annotation = new mapkit.MarkerAnnotation(coordinate, {
                                color: '#a855f7',
                                glyphText: '🚢',
                                title: vessel.displayName || vessel.metadata.name || vessel.vesselId,
                                subtitle: `Speed: ${pos.speed ? pos.speed.toFixed(1) + ' kn' : 'N/A'}`
                            })
                            map.value.addAnnotation(annotation)
                            encounterAnnotations.value.set(vessel.vesselId, annotation)
                        }
                    }
                    break
                }
            }
        }

        // Cleanup stale annotations for vessels no longer active
        for (const [id, annotation] of encounterAnnotations.value.entries()) {
            if (!activeVesselIds.has(id)) {
                map.value.removeAnnotation(annotation)
                encounterAnnotations.value.delete(id)
            }
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
        
        encounterAnnotations.value.clear()
    }

    onUnmounted(() => {
        clearOverlays()
        if (map.value) {
            map.value.removeEventListener('single-tap', handleMapTap)
        }
    })

    return {
        drawTrack,
        updateBoatPosition,
        updateEncounterPositions,
        clearOverlays,
    }
}
