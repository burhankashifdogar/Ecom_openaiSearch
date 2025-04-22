"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth-provider"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { BarChart, LineChart, PieChart } from "@/components/ui/chart"
import { format, subDays, startOfDay, endOfDay } from "date-fns"
import { CalendarIcon, Download } from "lucide-react"
import { getAggregatedMetrics, getTopProducts } from "@/lib/services/analytics"

export default function AdvancedAnalyticsPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [dateRange, setDateRange] = useState<{
    from: Date
    to: Date
  }>({
    from: startOfDay(subDays(new Date(), 30)),
    to: endOfDay(new Date()),
  })
  const [metrics, setMetrics] = useState<Record<string, any> | null>(null)
  const [topProducts, setTopProducts] = useState<Array<{ productId: string; count: number }>>([])
  const [topPurchasedProducts, setTopPurchasedProducts] = useState<Array<{ productId: string; count: number }>>([])
  const [isLoading, setIsLoading] = useState(true)
  const [timeframe, setTimeframe] = useState("30d")

  // Redirect if not admin
  useEffect(() => {
    if (!loading && (!user || !user.isAdmin)) {
      router.push("/login")
    }
  }, [user, loading, router])

  // Load analytics data
  useEffect(() => {
    const loadAnalyticsData = async () => {
      setIsLoading(true)
      try {
        // Get aggregated metrics
        const metricsData = await getAggregatedMetrics(dateRange.from, dateRange.to)
        setMetrics(metricsData)

        // Get top viewed products
        const topViewedProducts = await getTopProducts(dateRange.from, dateRange.to, "views", 5)
        setTopProducts(topViewedProducts)

        // Get top purchased products
        const topPurchased = await getTopProducts(dateRange.from, dateRange.to, "purchases", 5)
        setTopPurchasedProducts(topPurchased)
      } catch (error) {
        console.error("Error loading analytics data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadAnalyticsData()
  }, [dateRange])

  // Handle timeframe change
  const handleTimeframeChange = (value: string) => {
    setTimeframe(value)
    const today = new Date()

    switch (value) {
      case "7d":
        setDateRange({
          from: startOfDay(subDays(today, 7)),
          to: endOfDay(today),
        })
        break
      case "30d":
        setDateRange({
          from: startOfDay(subDays(today, 30)),
          to: endOfDay(today),
        })
        break
      case "90d":
        setDateRange({
          from: startOfDay(subDays(today, 90)),
          to: endOfDay(today),
        })
        break
      default:
        break
    }
  }

  // Mock data for charts
  const trafficData = {
    months: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    data: [
      {
        name: "Visitors",
        data: [1200, 1400, 1300, 1500, 1800, 2000, 1700],
      },
      {
        name: "Page Views",
        data: [3000, 3500, 3200, 3800, 4200, 4800, 4000],
      },
    ],
  }

  const conversionData = {
    months: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    data: [
      {
        name: "Conversion Rate",
        data: [2.1, 2.3, 2.0, 2.5, 2.8, 3.0, 2.7],
      },
    ],
  }

  const salesData = {
    months: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    data: [
      {
        name: "Revenue",
        data: [1200, 1500, 1300, 1800, 2200, 2500, 2000],
      },
      {
        name: "Orders",
        data: [25, 30, 28, 35, 40, 45, 38],
      },
    ],
  }

  const deviceData = [
    { name: "Mobile", value: 58 },
    { name: "Desktop", value: 32 },
    { name: "Tablet", value: 10 },
  ]

  const channelData = [
    { name: "Direct", value: 40 },
    { name: "Organic Search", value: 30 },
    { name: "Social", value: 15 },
    { name: "Referral", value: 10 },
    { name: "Email", value: 5 },
  ]

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
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Advanced Analytics</h1>
          <p className="text-muted-foreground">Detailed insights into your store's performance</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <Select value={timeframe} onValueChange={handleTimeframeChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select timeframe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
            </SelectContent>
          </Select>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-[280px] justify-start text-left font-normal">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateRange?.from ? (
                  dateRange.to ? (
                    <>
                      {format(dateRange.from, "LLL dd, y")} - {format(dateRange.to, "LLL dd, y")}
                    </>
                  ) : (
                    format(dateRange.from, "LLL dd, y")
                  )
                ) : (
                  <span>Pick a date range</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="range"
                selected={dateRange}
                onSelect={(range) => range && setDateRange(range)}
                initialFocus
              />
            </PopoverContent>
          </Popover>

          <Button variant="outline" size="icon">
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Visitors</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-[100px]" />
            ) : (
              <div className="text-2xl font-bold">{metrics?.uniqueVisitors?.toLocaleString() || 0}</div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-[100px]" />
            ) : (
              <div className="text-2xl font-bold">{(metrics?.conversionRate || 0).toFixed(2)}%</div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Orders</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-[100px]" />
            ) : (
              <div className="text-2xl font-bold">{metrics?.completedOrders?.toLocaleString() || 0}</div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cart Abandonment</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-[100px]" />
            ) : (
              <div className="text-2xl font-bold">{(metrics?.cartAbandonmentRate || 0).toFixed(2)}%</div>
            )}
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="traffic">
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="traffic">Traffic & Engagement</TabsTrigger>
          <TabsTrigger value="conversion">Conversion & Sales</TabsTrigger>
          <TabsTrigger value="products">Product Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="traffic" className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Traffic Overview</CardTitle>
              <CardDescription>Visitors and page views over time</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              {isLoading ? (
                <Skeleton className="h-full w-full" />
              ) : (
                <LineChart
                  data={trafficData.data}
                  categories={trafficData.months}
                  index="name"
                  colors={["#4f46e5", "#94a3b8"]}
                  yAxisWidth={60}
                  showLegend
                  showXAxis
                  showYAxis
                  showGridLines
                  valueFormatter={(value) => `${value.toLocaleString()}`}
                />
              )}
            </CardContent>
          </Card>

          <div className="grid gap-8 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Traffic by Device</CardTitle>
                <CardDescription>Distribution of visitors by device type</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                {isLoading ? (
                  <Skeleton className="h-full w-full" />
                ) : (
                  <PieChart
                    data={deviceData}
                    index="name"
                    valueKey="value"
                    category="value"
                    colors={["#4f46e5", "#3b82f6", "#8b5cf6"]}
                    showLegend
                    valueFormatter={(value) => `${value}%`}
                  />
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Traffic by Channel</CardTitle>
                <CardDescription>Distribution of visitors by acquisition channel</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                {isLoading ? (
                  <Skeleton className="h-full w-full" />
                ) : (
                  <PieChart
                    data={channelData}
                    index="name"
                    valueKey="value"
                    category="value"
                    colors={["#4f46e5", "#3b82f6", "#8b5cf6", "#a855f7", "#d946ef"]}
                    showLegend
                    valueFormatter={(value) => `${value}%`}
                  />
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="conversion" className="space-y-8">
          <div className="grid gap-8 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Conversion Rate</CardTitle>
                <CardDescription>Percentage of visitors who complete a purchase</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                {isLoading ? (
                  <Skeleton className="h-full w-full" />
                ) : (
                  <LineChart
                    data={conversionData.data}
                    categories={conversionData.months}
                    index="name"
                    colors={["#4f46e5"]}
                    yAxisWidth={60}
                    showLegend
                    showXAxis
                    showYAxis
                    showGridLines
                    valueFormatter={(value) => `${value}%`}
                  />
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Sales Performance</CardTitle>
                <CardDescription>Revenue and orders over time</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                {isLoading ? (
                  <Skeleton className="h-full w-full" />
                ) : (
                  <BarChart
                    data={salesData.data}
                    categories={salesData.months}
                    index="name"
                    colors={["#4f46e5", "#3b82f6"]}
                    yAxisWidth={60}
                    showLegend
                    showXAxis
                    showYAxis
                    showGridLines
                    valueFormatter={(value, info) => (info?.dataKey === "Revenue" ? `$${value}` : `${value}`)}
                  />
                )}
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Conversion Funnel</CardTitle>
              <CardDescription>Customer journey from page view to purchase</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              {isLoading ? (
                <Skeleton className="h-full w-full" />
              ) : (
                <BarChart
                  data={[
                    {
                      name: "Funnel",
                      data: [
                        metrics?.pageViews || 0,
                        metrics?.productViews || 0,
                        metrics?.addToCartEvents || 0,
                        metrics?.checkoutStarts || 0,
                        metrics?.completedOrders || 0,
                      ],
                    },
                  ]}
                  categories={["Page Views", "Product Views", "Add to Cart", "Checkout", "Purchase"]}
                  index="name"
                  colors={["#4f46e5"]}
                  layout="vertical"
                  yAxisWidth={120}
                  showLegend={false}
                  showXAxis
                  showYAxis
                  showGridLines
                  valueFormatter={(value) => `${value.toLocaleString()}`}
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="products" className="space-y-8">
          <div className="grid gap-8 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Top Viewed Products</CardTitle>
                <CardDescription>Most viewed products in the selected period</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-2">
                    {Array(5)
                      .fill(0)
                      .map((_, i) => (
                        <Skeleton key={i} className="h-12 w-full" />
                      ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {topProducts.length > 0 ? (
                      topProducts.map((product, i) => (
                        <div key={i} className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium">Product ID: {product.productId}</p>
                            <p className="text-xs text-muted-foreground">Views: {product.count}</p>
                          </div>
                          <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                            <div
                              className="h-full bg-primary"
                              style={{
                                width: `${(product.count / topProducts[0].count) * 100}%`,
                              }}
                            />
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-muted-foreground text-center py-4">No data available</p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Purchased Products</CardTitle>
                <CardDescription>Best selling products in the selected period</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-2">
                    {Array(5)
                      .fill(0)
                      .map((_, i) => (
                        <Skeleton key={i} className="h-12 w-full" />
                      ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {topPurchasedProducts.length > 0 ? (
                      topPurchasedProducts.map((product, i) => (
                        <div key={i} className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium">Product ID: {product.productId}</p>
                            <p className="text-xs text-muted-foreground">Purchases: {product.count}</p>
                          </div>
                          <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                            <div
                              className="h-full bg-primary"
                              style={{
                                width: `${(product.count / topPurchasedProducts[0].count) * 100}%`,
                              }}
                            />
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-muted-foreground text-center py-4">No data available</p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Product Category Performance</CardTitle>
              <CardDescription>Sales distribution across product categories</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              {isLoading ? (
                <Skeleton className="h-full w-full" />
              ) : (
                <BarChart
                  data={[
                    {
                      name: "Views",
                      data: [1200, 800, 600, 400, 300],
                    },
                    {
                      name: "Purchases",
                      data: [150, 120, 80, 60, 40],
                    },
                  ]}
                  categories={["Electronics", "Clothing", "Home & Kitchen", "Books", "Sports"]}
                  index="name"
                  colors={["#4f46e5", "#3b82f6"]}
                  yAxisWidth={60}
                  showLegend
                  showXAxis
                  showYAxis
                  showGridLines
                  valueFormatter={(value) => `${value}`}
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
