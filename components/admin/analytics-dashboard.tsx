"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { BarChart, LineChart, PieChart } from "@/components/ui/chart"
import {
  ArrowDownIcon,
  ArrowUpIcon,
  BarChart3Icon,
  LineChartIcon,
  PieChartIcon,
  UsersIcon,
  ShoppingBagIcon,
  DollarSignIcon,
  TrendingUpIcon,
} from "lucide-react"

// Mock data for charts
const mockSalesData = {
  months: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
  data: [
    {
      name: "This Year",
      data: [18000, 16000, 21000, 17000, 23000, 25000, 22000, 19000, 21000, 24000, 28000, 32000],
    },
    {
      name: "Last Year",
      data: [15000, 14000, 18000, 16000, 19000, 21000, 20000, 18000, 19000, 22000, 24000, 28000],
    },
  ],
}

const mockTrafficData = {
  months: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
  data: [
    {
      name: "Organic",
      data: [4200, 3800, 5000, 4800, 5200, 5500, 5300, 5100, 5400, 5600, 5800, 6000],
    },
    {
      name: "Direct",
      data: [2500, 2300, 2700, 2600, 2800, 3000, 2900, 2800, 3100, 3200, 3300, 3500],
    },
    {
      name: "Social",
      data: [1800, 1700, 2000, 1900, 2100, 2200, 2100, 2000, 2200, 2300, 2400, 2600],
    },
    {
      name: "Referral",
      data: [1200, 1100, 1300, 1200, 1400, 1500, 1400, 1300, 1500, 1600, 1700, 1800],
    },
  ],
}

const mockCategoryData = [
  { name: "Electronics", value: 35 },
  { name: "Clothing", value: 25 },
  { name: "Home & Kitchen", value: 20 },
  { name: "Beauty", value: 15 },
  { name: "Other", value: 5 },
]

const mockDeviceData = [
  { name: "Mobile", value: 58 },
  { name: "Desktop", value: 32 },
  { name: "Tablet", value: 10 },
]

export function AnalyticsDashboard() {
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalRevenue: 0,
    revenueChange: 0,
    totalOrders: 0,
    ordersChange: 0,
    totalCustomers: 0,
    customersChange: 0,
    conversionRate: 0,
    conversionChange: 0,
  })

  useEffect(() => {
    // Simulate API call
    const timer = setTimeout(() => {
      setStats({
        totalRevenue: 267892.5,
        revenueChange: 12.5,
        totalOrders: 1568,
        ordersChange: 8.2,
        totalCustomers: 892,
        customersChange: 15.3,
        conversionRate: 3.2,
        conversionChange: 0.8,
      })
      setLoading(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="space-y-8">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Revenue Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSignIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-[120px]" />
            ) : (
              <>
                <div className="text-2xl font-bold">${stats.totalRevenue.toLocaleString()}</div>
                <div className="flex items-center pt-1 text-xs text-muted-foreground">
                  {stats.revenueChange > 0 ? (
                    <ArrowUpIcon className="mr-1 h-3 w-3 text-green-500" />
                  ) : (
                    <ArrowDownIcon className="mr-1 h-3 w-3 text-red-500" />
                  )}
                  <span className={stats.revenueChange > 0 ? "text-green-500" : "text-red-500"}>
                    {Math.abs(stats.revenueChange)}%
                  </span>
                  <span className="ml-1">from last month</span>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Orders Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingBagIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-[80px]" />
            ) : (
              <>
                <div className="text-2xl font-bold">{stats.totalOrders.toLocaleString()}</div>
                <div className="flex items-center pt-1 text-xs text-muted-foreground">
                  {stats.ordersChange > 0 ? (
                    <ArrowUpIcon className="mr-1 h-3 w-3 text-green-500" />
                  ) : (
                    <ArrowDownIcon className="mr-1 h-3 w-3 text-red-500" />
                  )}
                  <span className={stats.ordersChange > 0 ? "text-green-500" : "text-red-500"}>
                    {Math.abs(stats.ordersChange)}%
                  </span>
                  <span className="ml-1">from last month</span>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Customers Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
            <UsersIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-[80px]" />
            ) : (
              <>
                <div className="text-2xl font-bold">{stats.totalCustomers.toLocaleString()}</div>
                <div className="flex items-center pt-1 text-xs text-muted-foreground">
                  {stats.customersChange > 0 ? (
                    <ArrowUpIcon className="mr-1 h-3 w-3 text-green-500" />
                  ) : (
                    <ArrowDownIcon className="mr-1 h-3 w-3 text-red-500" />
                  )}
                  <span className={stats.customersChange > 0 ? "text-green-500" : "text-red-500"}>
                    {Math.abs(stats.customersChange)}%
                  </span>
                  <span className="ml-1">from last month</span>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Conversion Rate Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <TrendingUpIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-[60px]" />
            ) : (
              <>
                <div className="text-2xl font-bold">{stats.conversionRate}%</div>
                <div className="flex items-center pt-1 text-xs text-muted-foreground">
                  {stats.conversionChange > 0 ? (
                    <ArrowUpIcon className="mr-1 h-3 w-3 text-green-500" />
                  ) : (
                    <ArrowDownIcon className="mr-1 h-3 w-3 text-red-500" />
                  )}
                  <span className={stats.conversionChange > 0 ? "text-green-500" : "text-red-500"}>
                    {Math.abs(stats.conversionChange)}%
                  </span>
                  <span className="ml-1">from last month</span>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="sales">
        <TabsList className="grid w-full grid-cols-3 mb-4">
          <TabsTrigger value="sales" className="flex items-center gap-2">
            <LineChartIcon className="h-4 w-4" />
            <span>Sales Analytics</span>
          </TabsTrigger>
          <TabsTrigger value="traffic" className="flex items-center gap-2">
            <BarChart3Icon className="h-4 w-4" />
            <span>Traffic Sources</span>
          </TabsTrigger>
          <TabsTrigger value="breakdown" className="flex items-center gap-2">
            <PieChartIcon className="h-4 w-4" />
            <span>Sales Breakdown</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="sales" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Sales</CardTitle>
              <CardDescription>Compare sales performance with previous year</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              {loading ? (
                <Skeleton className="h-full w-full" />
              ) : (
                <LineChart
                  data={mockSalesData.data}
                  categories={mockSalesData.months}
                  index="name"
                  colors={["#4f46e5", "#94a3b8"]}
                  yAxisWidth={60}
                  showLegend
                  showXAxis
                  showYAxis
                  showGridLines
                  valueFormatter={(value) => `$${value.toLocaleString()}`}
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="traffic" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Traffic Sources</CardTitle>
              <CardDescription>Monthly traffic by source</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              {loading ? (
                <Skeleton className="h-full w-full" />
              ) : (
                <BarChart
                  data={mockTrafficData.data}
                  categories={mockTrafficData.months}
                  index="name"
                  colors={["#4f46e5", "#3b82f6", "#8b5cf6", "#a855f7"]}
                  yAxisWidth={60}
                  showLegend
                  showXAxis
                  showYAxis
                  showGridLines
                  valueFormatter={(value) => `${value.toLocaleString()} visits`}
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="breakdown" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Sales by Category</CardTitle>
                <CardDescription>Distribution of sales across product categories</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                {loading ? (
                  <Skeleton className="h-full w-full" />
                ) : (
                  <PieChart
                    data={mockCategoryData}
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

            <Card>
              <CardHeader>
                <CardTitle>Sales by Device</CardTitle>
                <CardDescription>Distribution of sales across devices</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                {loading ? (
                  <Skeleton className="h-full w-full" />
                ) : (
                  <PieChart
                    data={mockDeviceData}
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
          </div>
        </TabsContent>
      </Tabs>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Customers</CardTitle>
            <CardDescription>New customers in the last 30 days</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-2">
                {Array(5)
                  .fill(0)
                  .map((_, i) => (
                    <Skeleton key={i} className="h-12 w-full" />
                  ))}
              </div>
            ) : (
              <div className="space-y-4">
                {[
                  { name: "Sarah Johnson", email: "sarah.j@example.com", spent: "$245.00", date: "2 days ago" },
                  { name: "Michael Chen", email: "m.chen@example.com", spent: "$120.50", date: "3 days ago" },
                  { name: "Emma Williams", email: "emma.w@example.com", spent: "$350.75", date: "5 days ago" },
                  { name: "James Smith", email: "james.s@example.com", spent: "$89.99", date: "1 week ago" },
                  { name: "Olivia Brown", email: "o.brown@example.com", spent: "$175.25", date: "1 week ago" },
                ].map((customer, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                        {customer.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{customer.name}</p>
                        <p className="text-xs text-muted-foreground">{customer.email}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">{customer.spent}</p>
                      <p className="text-xs text-muted-foreground">{customer.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Products</CardTitle>
            <CardDescription>Best selling products this month</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-2">
                {Array(5)
                  .fill(0)
                  .map((_, i) => (
                    <Skeleton key={i} className="h-12 w-full" />
                  ))}
              </div>
            ) : (
              <div className="space-y-4">
                {[
                  { name: "Wireless Headphones", category: "Electronics", sales: 124, revenue: "$12,400" },
                  { name: "Smart Watch", category: "Electronics", sales: 98, revenue: "$19,600" },
                  { name: "Running Shoes", category: "Clothing", sales: 87, revenue: "$8,700" },
                  { name: "Coffee Maker", category: "Home & Kitchen", sales: 76, revenue: "$15,200" },
                  { name: "Moisturizer", category: "Beauty", sales: 65, revenue: "$3,250" },
                ].map((product, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">{product.name}</p>
                      <p className="text-xs text-muted-foreground">{product.category}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">{product.revenue}</p>
                      <p className="text-xs text-muted-foreground">{product.sales} units</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
