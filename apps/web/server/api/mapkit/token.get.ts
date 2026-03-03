export default defineEventHandler(() => {
    const config = useRuntimeConfig()
    const token = config.mapkitProdToken || config.mapkitDevToken || ''

    if (!token) {
        throw createError({
            statusCode: 500,
            statusMessage: 'MapKit token not configured',
        })
    }

    return { token }
})
