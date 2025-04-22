import { cookies } from "next/headers"

// Types of events we want to track
export type AnalyticsEventType =
  | "page_view"
  | "product_view"
  | "add_to_cart"
  | "remove_from_cart"
  | "checkout_start"
  | "checkout_complete"
  | "search"
  | "filter_use"
  | "signup"
  | "login"
  | "wishlist_add"
  | "wishlist_remove"

export type AnalyticsEvent = {
  eventType: AnalyticsEventType
  userId?: string | null
  sessionId: string
  timestamp: Date
  data: Record<string, any>
  url?: string
  referrer?: string
  userAgent?: string
  ipAddress?: string
}

// Mock analytics data for development
const mockAnalyticsData: AnalyticsEvent[] = []

// Track an event
export async function trackEvent(
  eventType: AnalyticsEventType,
  data: Record<string, any> = {},
  options: {
    url?: string
    referrer?: string
  } = {},
): Promise<void> {
  try {
    // Get user ID if available
    const userId = getUserIdFromSession()

    // Get or create session ID
    const sessionId = getOrCreateSessionId()

    // Create event object
    const event: AnalyticsEvent = {
      eventType,
      userId,
      sessionId,
      timestamp: new Date(),
      data,
      url: options.url,
      referrer: options.referrer,
    }

    // In development, store in mock data
    console.warn("Tracking analytics event:", event)
    mockAnalyticsData.push(event)

    // In production, this would store to the database
    // await sql`
    //   INSERT INTO analytics_events (
    //     user_id, event_type, event_data, ip_address, user_agent, created_at
    //   ) VALUES (
    //     ${userId}, ${eventType}, ${JSON.stringify(data)},
    //     ${ipAddress}, ${userAgent}, ${new Date()}
    //   )
    // `;
  } catch (error) {
    console.error("Error tracking analytics event:", error)
  }
}

// Get analytics data for dashboard
export async function getAnalyticsData(
  startDate: Date,
  endDate: Date,
  filters: {
    eventTypes?: AnalyticsEventType[]
    userId?: string
  } = {},
): Promise<AnalyticsEvent[]> {
  console.warn("Getting analytics data with filters:", filters)

  // Filter mock data based on parameters
  let filteredData = mockAnalyticsData.filter((event) => event.timestamp >= startDate && event.timestamp <= endDate)

  if (filters.eventTypes && filters.eventTypes.length > 0) {
    filteredData = filteredData.filter((event) => filters.eventTypes!.includes(event.eventType))
  }

  if (filters.userId) {
    filteredData = filteredData.filter((event) => event.userId === filters.userId)
  }

  return filteredData
}

// Get aggregated metrics
export async function getAggregatedMetrics(startDate: Date, endDate: Date): Promise<Record<string, any>> {
  // In development, calculate from mock data
  const events = await getAnalyticsData(startDate, endDate)

  // Count page views
  const pageViews = events.filter((e) => e.eventType === "page_view").length

  // Count unique visitors (by session ID)
  const uniqueVisitors = new Set(events.filter((e) => e.eventType === "page_view").map((e) => e.sessionId)).size

  // Count product views
  const productViews = events.filter((e) => e.eventType === "product_view").length

  // Count add to cart events
  const addToCartEvents = events.filter((e) => e.eventType === "add_to_cart").length

  // Count checkout starts
  const checkoutStarts = events.filter((e) => e.eventType === "checkout_start").length

  // Count completed orders
  const completedOrders = events.filter((e) => e.eventType === "checkout_complete").length

  // Calculate conversion rate
  const conversionRate = uniqueVisitors > 0 ? (completedOrders / uniqueVisitors) * 100 : 0

  // Calculate cart abandonment rate
  const cartAbandonmentRate = checkoutStarts > 0 ? ((checkoutStarts - completedOrders) / checkoutStarts) * 100 : 0

  return {
    pageViews,
    uniqueVisitors,
    productViews,
    addToCartEvents,
    checkoutStarts,
    completedOrders,
    conversionRate,
    cartAbandonmentRate,
  }
}

// Get top products by views or purchases
export async function getTopProducts(
  startDate: Date,
  endDate: Date,
  metric: "views" | "purchases" = "views",
  limit = 10,
): Promise<Array<{ productId: string; count: number }>> {
  const events = await getAnalyticsData(startDate, endDate, {
    eventTypes: metric === "views" ? ["product_view"] : ["checkout_complete"],
  })

  // Group by product ID and count occurrences
  const productCounts: Record<string, number> = {}

  events.forEach((event) => {
    if (metric === "views" && event.data.productId) {
      productCounts[event.data.productId] = (productCounts[event.data.productId] || 0) + 1
    } else if (metric === "purchases" && event.data.products) {
      // For purchases, we need to extract products from the order
      const products = event.data.products || []
      products.forEach((product: any) => {
        if (product.id) {
          productCounts[product.id] = (productCounts[product.id] || 0) + 1
        }
      })
    }
  })

  // Convert to array and sort
  const sortedProducts = Object.entries(productCounts)
    .map(([productId, count]) => ({ productId, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit)

  return sortedProducts
}

// Helper function to get user ID from session
function getUserIdFromSession(): string | null {
  try {
    const sessionCookie = cookies().get("session")

    if (!sessionCookie?.value) {
      return null
    }

    const session = JSON.parse(sessionCookie.value)
    return session.userId || null
  } catch (error) {
    console.error("Error getting user ID from session:", error)
    return null
  }
}

// Helper function to get or create session ID
function getOrCreateSessionId(): string {
  try {
    const sessionIdCookie = cookies().get("analytics_session")

    if (sessionIdCookie?.value) {
      return sessionIdCookie.value
    }

    // Generate a new session ID
    const newSessionId = `session_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`

    // In a client component, we would set the cookie here
    // document.cookie = `analytics_session=${newSessionId}; path=/; max-age=86400`;

    return newSessionId
  } catch (error) {
    console.error("Error managing session ID:", error)
    return `session_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`
  }
}
