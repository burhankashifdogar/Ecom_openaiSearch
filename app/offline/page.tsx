"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { WifiOff, RefreshCw } from "lucide-react"

export default function OfflinePage() {
  return (
    <div className="container flex flex-col items-center justify-center min-h-[70vh] px-4 py-16 text-center">
      <div className="mb-6 rounded-full bg-primary/10 p-6">
        <WifiOff className="h-12 w-12 text-primary" />
      </div>
      <h1 className="text-3xl font-bold mb-4">You're Offline</h1>
      <p className="text-muted-foreground max-w-md mb-8">
        It looks like you've lost your internet connection. Some features may be unavailable until you're back online.
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <Button onClick={() => window.location.reload()} className="flex items-center">
          <RefreshCw className="mr-2 h-4 w-4" />
          Try Again
        </Button>
        <Button variant="outline" asChild>
          <Link href="/">Go to Homepage</Link>
        </Button>
      </div>
      <p className="mt-8 text-sm text-muted-foreground">You can still browse previously visited pages while offline.</p>
    </div>
  )
}
