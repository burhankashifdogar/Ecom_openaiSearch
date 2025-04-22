"use client"

import { useEffect } from "react"

interface ProductTrackerProps {
  productId: string
  productName: string
  price: number
  category: string
}

export default function ProductTracker({ productId, productName, price, category }: ProductTrackerProps) {
  useEffect(() => {
    // Track product view on component mount
    if (window.trackAnalyticsEvent) {
      window.trackAnalyticsEvent("product_view", {
        productId,
        productName,
        price,
        category,
      })
    }
  }, [productId, productName, price, category])

  return null
}
