"use client"

import { useEffect, useCallback } from "react"
import { usePathname, useSearchParams } from "next/navigation"

type TrackEventFunction = (
  eventType: string,
  data?: Record<string, any>,
  options?: { url?: string; referrer?: string },
) => void

declare global {
  interface Window {
    trackAnalyticsEvent?: TrackEventFunction
  }
}

export default function AnalyticsTracker() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // Define tracking function
  const trackEvent = useCallback(
    (eventType: string, data: Record<string, any> = {}, options: { url?: string; referrer?: string } = {}) => {
      // Get current URL if not provided
      const url = options.url || `${pathname}${searchParams ? `?${searchParams}` : ""}`

      // Get referrer if not provided
      const referrer = options.referrer || document.referrer

      // Send event to server
      fetch("/api/analytics/track", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          eventType,
          data,
          url,
          referrer,
        }),
        // Use keepalive to ensure the request completes even if the page is unloading
        keepalive: true,
      }).catch((error) => {
        console.error("Error tracking analytics event:", error)
      })
    },
    [pathname, searchParams],
  )

  // Track page views
  useEffect(() => {
    // Make tracking function globally available
    window.trackAnalyticsEvent = trackEvent

    // Track page view on mount and when pathname changes
    trackEvent("page_view", {
      path: pathname,
      query: Object.fromEntries(searchParams?.entries() || []),
    })

    // Clean up
    return () => {
      delete window.trackAnalyticsEvent
    }
  }, [pathname, searchParams, trackEvent])

  return null
}
