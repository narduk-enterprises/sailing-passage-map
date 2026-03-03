/**
 * Format a date string to a human-readable format
 */
export function formatDate(dateString: string, options?: Intl.DateTimeFormatOptions): string {
    const date = new Date(dateString)
    const defaultOptions: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        ...options,
    }
    return new Intl.DateTimeFormat('en-US', defaultOptions).format(date)
}

/**
 * Format a date string to time only
 */
export function formatTime(dateString: string): string {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
    }).format(date)
}

/**
 * Format duration in hours to human-readable
 */
export function formatDuration(hours: number): string {
    if (hours < 1) {
        return `${Math.round(hours * 60)} min`
    }
    const h = Math.floor(hours)
    const m = Math.round((hours - h) * 60)
    return m > 0 ? `${h}h ${m}m` : `${h}h`
}

/**
 * Format a date range
 */
export function formatDateRange(startTime: string, endTime: string): string {
    const start = formatDate(startTime, { month: 'short', day: 'numeric' })
    const end = formatDate(endTime, { month: 'short', day: 'numeric', year: 'numeric' })
    return `${start} – ${end}`
}

/**
 * Get relative time string (e.g., "2 hours ago")
 */
export function getRelativeTime(dateString: string): string {
    const now = Date.now()
    const date = new Date(dateString).getTime()
    const diff = now - date
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(minutes / 60)
    const days = Math.floor(hours / 24)

    if (days > 0) return `${days}d ago`
    if (hours > 0) return `${hours}h ago`
    if (minutes > 0) return `${minutes}m ago`
    return 'just now'
}
