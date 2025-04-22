import { defaultCache } from "@serwist/next/browser"
import type { PrecacheEntry } from "@serwist/precaching"
import { installSerwist } from "@serwist/sw"

declare const self: ServiceWorkerGlobalScope & {
  __SW_MANIFEST: (PrecacheEntry | string)[]
}

installSerwist({
  precacheEntries: self.__SW_MANIFEST,
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,
  runtimeCaching: [
    // Cache the Google Fonts stylesheets with a stale-while-revalidate strategy.
    {
      urlPattern: /^https:\/\/fonts\.googleapis\.com/,
      handler: "StaleWhileRevalidate",
      options: {
        cacheName: "google-fonts-stylesheets",
        expiration: {
          maxEntries: 5,
          maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
        },
      },
    },
    // Cache the Google Fonts webfont files with a cache-first strategy for 1 year.
    {
      urlPattern: /^https:\/\/fonts\.gstatic\.com/,
      handler: "CacheFirst",
      options: {
        cacheName: "google-fonts-webfonts",
        expiration: {
          maxEntries: 30,
          maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
        },
      },
    },
    // Cache images with a cache-first strategy
    {
      urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp|ico)$/i,
      handler: "CacheFirst",
      options: {
        cacheName: "images",
        expiration: {
          maxEntries: 100,
          maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
        },
      },
    },
    // Cache CSS and JavaScript files with a stale-while-revalidate strategy
    {
      urlPattern: /\.(?:js|css)$/i,
      handler: "StaleWhileRevalidate",
      options: {
        cacheName: "static-resources",
        expiration: {
          maxEntries: 50,
          maxAgeSeconds: 60 * 60 * 24 * 7, // 7 days
        },
      },
    },
    // Cache API responses with a network-first strategy
    {
      urlPattern: /\/api\//,
      handler: "NetworkFirst",
      options: {
        cacheName: "api-cache",
        networkTimeoutSeconds: 10,
        expiration: {
          maxEntries: 50,
          maxAgeSeconds: 60 * 5, // 5 minutes
        },
      },
    },
    // Cache product pages with a network-first strategy
    {
      urlPattern: /\/products\//,
      handler: "NetworkFirst",
      options: {
        cacheName: "product-pages",
        expiration: {
          maxEntries: 50,
          maxAgeSeconds: 60 * 60 * 24, // 1 day
        },
      },
    },
    // Cache category pages with a network-first strategy
    {
      urlPattern: /\/categories\//,
      handler: "NetworkFirst",
      options: {
        cacheName: "category-pages",
        expiration: {
          maxEntries: 20,
          maxAgeSeconds: 60 * 60 * 24, // 1 day
        },
      },
    },
    // Cache the homepage with a network-first strategy
    {
      urlPattern: /\/$/,
      handler: "NetworkFirst",
      options: {
        cacheName: "homepage",
        expiration: {
          maxEntries: 1,
          maxAgeSeconds: 60 * 60 * 12, // 12 hours
        },
      },
    },
    // Default cache strategy for everything else
    defaultCache,
  ],
  // Offline fallback page
  offlineAnalyticsConfig: {
    enabled: true,
  },
})

// Listen for the "message" event to handle custom messages
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting()
  }
})

// Show a custom offline page when the user is offline
const FALLBACK_HTML_URL = "/offline.html"
const FALLBACK_IMAGE_URL = "/offline-image.svg"

// Serve a custom offline page when a navigation request fails
self.addEventListener("fetch", (event) => {
  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request).catch(() => {
        return caches.match(FALLBACK_HTML_URL) || Response.error()
      }),
    )
  }

  // Serve a fallback image when an image request fails
  if (event.request.destination === "image") {
    event.respondWith(
      fetch(event.request).catch(() => {
        return caches.match(FALLBACK_IMAGE_URL) || Response.error()
      }),
    )
  }
})
