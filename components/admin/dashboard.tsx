"use client"

import { useState, useEffect } from "react"
import { ShoppingBag, Users, DollarSign, Package, TrendingUp, TrendingDown } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"

export function AdminDashboard() {
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalSales: 0,
    totalOrders: 0,
    totalCustomers: 0,
    totalProducts: 0,
    salesChange: 0,
    ordersChange: 0,
    customersChange: 0,
    productsChange: 0,
  })

  useEffect(() => {
    // In a real app, this would be an API call
    // For demo purposes, we'll use mock data
    const fetchStats = async () => {
      try {
        // Simulate API delay
        setTimeout(() => {
          setStats({
            totalSales: 24892.5,
            totalOrders: 156,
            totalCustomers: 89,
            totalProducts: 42,
            salesChange: 12.5,
            ordersChange: 8.2,
            customersChange: 15.3,
            productsChange: -2.1,
          })
          setLoading(false)
        }, 1500)
      } catch (error) {
        console.error("Error fetching admin stats:", error)
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  return (
    <div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-[100px]" />
            ) : (
              <>
                <div className="text-2xl font-bold">${stats.totalSales.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground flex items-center mt-1">
                  {stats.salesChange > 0 ? (
                    <>
                      <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
                      <span className="text-green-500">{stats.salesChange}%</span>
                    </>
                  ) : (
                    <>
                      <TrendingDown className="h-3 w-3 mr-1 text-red-500" />
                      <span className="text-red-500">{Math.abs(stats.salesChange)}%</span>
                    </>
                  )}
                  <span className="ml-1">from last month</span>
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-[60px]" />
            ) : (
              <>
                <div className="text-2xl font-bold">{stats.totalOrders}</div>
                <p className="text-xs text-muted-foreground flex items-center mt-1">
                  {stats.ordersChange > 0 ? (
                    <>
                      <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
                      <span className="text-green-500">{stats.ordersChange}%</span>
                    </>
                  ) : (
                    <>
                      <TrendingDown className="h-3 w-3 mr-1 text-red-500" />
                      <span className="text-red-500">{Math.abs(stats.ordersChange)}%</span>
                    </>
                  )}
                  <span className="ml-1">from last month</span>
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-[60px]" />
            ) : (
              <>
                <div className="text-2xl font-bold">{stats.totalCustomers}</div>
                <p className="text-xs text-muted-foreground flex items-center mt-1">
                  {stats.customersChange > 0 ? (
                    <>
                      <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
                      <span className="text-green-500">{stats.customersChange}%</span>
                    </>
                  ) : (
                    <>
                      <TrendingDown className="h-3 w-3 mr-1 text-red-500" />
                      <span className="text-red-500">{Math.abs(stats.customersChange)}%</span>
                    </>
                  )}
                  <span className="ml-1">from last month</span>
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-[60px]" />
            ) : (
              <>
                <div className="text-2xl font-bold">{stats.totalProducts}</div>
                <p className="text-xs text-muted-foreground flex items-center mt-1">
                  {stats.productsChange > 0 ? (
                    <>
                      <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
                      <span className="text-green-500">{stats.productsChange}%</span>
                    </>
                  ) : (
                    <>
                      <TrendingDown className="h-3 w-3 mr-1 text-red-500" />
                      <span className="text-red-500">{Math.abs(stats.productsChange)}%</span>
                    </>
                  )}
                  <span className="ml-1">from last month</span>
                </p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="mt-8">
        <Tabs defaultValue="sales">
          <TabsList>
            <TabsTrigger value="sales">Sales Overview</TabsTrigger>
            <TabsTrigger value="products">Top Products</TabsTrigger>
            <TabsTrigger value="customers">Customer Insights</TabsTrigger>
          </TabsList>
          <TabsContent value="sales" className="p-4 border rounded-md mt-4">
            <h3 className="text-lg font-medium mb-4">Sales Overview</h3>
            {loading ? (
              <Skeleton className="h-[300px] w-full" />
            ) : (
              <div className="h-[300px] flex items-center justify-center bg-muted rounded-md">
                <p className="text-muted-foreground">Sales chart would be displayed here</p>
              </div>
            )}
          </TabsContent>
          <TabsContent value="products" className="p-4 border rounded-md mt-4">
            <h3 className="text-lg font-medium mb-4">Top Products</h3>
            {loading ? (
              <Skeleton className="h-[300px] w-full" />
            ) : (
              <div className="h-[300px] flex items-center justify-center bg-muted rounded-md">
                <p className="text-muted-foreground">Product performance chart would be displayed here</p>
              </div>
            )}
          </TabsContent>
          <TabsContent value="customers" className="p-4 border rounded-md mt-4">
            <h3 className="text-lg font-medium mb-4">Customer Insights</h3>
            {loading ? (
              <Skeleton className="h-[300px] w-full" />
            ) : (
              <div className="h-[300px] flex items-center justify-center bg-muted rounded-md">
                <p className="text-muted-foreground">Customer analytics would be displayed here</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
