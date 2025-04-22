"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth-provider"
import { AnalyticsDashboard } from "@/components/admin/analytics-dashboard"
import { useToast } from "@/hooks/use-toast"

export default function AnalyticsPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    if (!loading && (!user || !user.isAdmin)) {
      toast({
        title: "Access Restricted",
        description: "You need admin privileges to access this page.",
        variant: "destructive",
      })
      router.push("/login")
    }
  }, [user, loading, router, toast])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p>Loading...</p>
      </div>
    )
  }

  if (!user || !user.isAdmin) {
    return null // Will redirect in useEffect
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Analytics Dashboard</h1>
      <AnalyticsDashboard />
    </div>
  )
}
