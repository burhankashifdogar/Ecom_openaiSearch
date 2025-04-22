"use client"

import { useEffect } from "react"

interface CheckoutTrackerProps {
  step: "start" | "complete"
  orderId?: string
  total?: number
  products?: Array<{
    id: string
    name: string
    price: number
    quantity: number
  }>
}

export default function CheckoutTracker({ step, orderId, total, products }: CheckoutTrackerProps) {
  useEffect(() => {
    // Track checkout event on component mount
    if (window.trackAnalyticsEvent) {
      if (step === "start") {
        window.trackAnalyticsEvent("checkout_start", {
          products,
          total,
        })
      } else if (step === "complete") {
        window.trackAnalyticsEvent("checkout_complete", {
          orderId,
          products,
          total,
        })
      }
    }
  }, [step, orderId, total, products])

  return null
}
