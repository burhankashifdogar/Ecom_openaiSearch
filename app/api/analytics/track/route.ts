import { type NextRequest, NextResponse } from "next/server"
import { trackEvent } from "@/lib/services/analytics"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { eventType, data, url, referrer } = body

    // Get IP address from request
    const ipAddress = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "127.0.0.1"

    // Get user agent from request
    const userAgent = request.headers.get("user-agent") || ""

    // Track the event
    await trackEvent(eventType, data, {
      url,
      referrer,
      // Add these to the data object since our function doesn't accept them directly
      ...data,
      ipAddress,
      userAgent,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error tracking analytics event:", error)
    return NextResponse.json({ error: "Failed to track event" }, { status: 500 })
  }
}
