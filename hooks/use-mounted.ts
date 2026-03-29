import { useState, useEffect } from 'react'

/**
 * Returns true only after the component has mounted on the client.
 * Use this to avoid SSR hydration mismatches for date/time rendering.
 *
 * @example
 * const mounted = useMounted()
 * return <span>{mounted ? new Date(date).toLocaleDateString() : '—'}</span>
 */
export function useMounted(): boolean {
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    return mounted
}
