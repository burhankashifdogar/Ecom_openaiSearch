"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Loader2, Search, Package, Truck, CheckCircle, XCircle } from "lucide-react"

type Order = {
  id: string
  date: string
  status: "processing" | "shipped" | "delivered" | "cancelled"
  total: number
  items: {
    id: string
    name: string
    price: number
    quantity: number
    image: string
  }[]
  tracking?: string
  address: string
  paymentMethod: string
}

export default function OrdersPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login")
    } else if (user) {
      // Fetch orders (mock data for demo)
      fetchOrders()
    }
  }, [user, loading, router])

  const fetchOrders = async () => {
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      const mockOrders: Order[] = [
        {
          id: "ORD-12345",
          date: "June 15, 2023",
          status: "delivered",
          total: 129.99,
          items: [
            {
              id: "PROD-1",
              name: "Wireless Headphones",
              price: 79.99,
              quantity: 1,
              image: "/placeholder.svg?height=80&width=80",
            },
            {
              id: "PROD-2",
              name: "Phone Case",
              price: 24.99,
              quantity: 2,
              image: "/placeholder.svg?height=80&width=80",
            },
          ],
          tracking: "1Z999AA10123456784",
          address: "123 Main St, Anytown, CA 12345",
          paymentMethod: "Visa ending in 4242",
        },
        {
          id: "ORD-12346",
          date: "May 28, 2023",
          status: "delivered",
          total: 79.5,
          items: [
            {
              id: "PROD-3",
              name: "Smart Watch",
              price: 79.5,
              quantity: 1,
              image: "/placeholder.svg?height=80&width=80",
            },
          ],
          tracking: "1Z999AA10123456785",
          address: "123 Main St, Anytown, CA 12345",
          paymentMethod: "Visa ending in 4242",
        },
        {
          id: "ORD-12347",
          date: "July 2, 2023",
          status: "shipped",
          total: 149.99,
          items: [
            {
              id: "PROD-4",
              name: "Bluetooth Speaker",
              price: 149.99,
              quantity: 1,
              image: "/placeholder.svg?height=80&width=80",
            },
          ],
          tracking: "1Z999AA10123456786",
          address: "123 Main St, Anytown, CA 12345",
          paymentMethod: "Mastercard ending in 5555",
        },
        {
          id: "ORD-12348",
          date: "July 10, 2023",
          status: "processing",
          total: 299.99,
          items: [
            {
              id: "PROD-5",
              name: "Laptop Backpack",
              price: 89.99,
              quantity: 1,
              image: "/placeholder.svg?height=80&width=80",
            },
            {
              id: "PROD-6",
              name: "Wireless Mouse",
              price: 49.99,
              quantity: 1,
              image: "/placeholder.svg?height=80&width=80",
            },
            {
              id: "PROD-7",
              name: "USB-C Hub",
              price: 79.99,
              quantity: 2,
              image: "/placeholder.svg?height=80&width=80",
            },
          ],
          address: "123 Main St, Anytown, CA 12345",
          paymentMethod: "PayPal",
        },
        {
          id: "ORD-12349",
          date: "April 15, 2023",
          status: "cancelled",
          total: 59.99,
          items: [
            {
              id: "PROD-8",
              name: "Phone Charger",
              price: 29.99,
              quantity: 2,
              image: "/placeholder.svg?height=80&width=80",
            },
          ],
          address: "123 Main St, Anytown, CA 12345",
          paymentMethod: "Visa ending in 4242",
        },
      ]

      setOrders(mockOrders)
      setFilteredOrders(mockOrders)
      setIsLoading(false)
    }, 1500)
  }

  useEffect(() => {
    // Filter orders based on search query and active tab
    let result = [...orders]

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (order) =>
          order.id.toLowerCase().includes(query) || order.items.some((item) => item.name.toLowerCase().includes(query)),
      )
    }

    // Apply status filter
    if (activeTab !== "all") {
      result = result.filter((order) => order.status === activeTab)
    }

    setFilteredOrders(result)
  }, [orders, searchQuery, activeTab])

  const getStatusBadge = (status: Order["status"]) => {
    switch (status) {
      case "processing":
        return (
          <Badge
            variant="outline"
            className="flex items-center gap-1 bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400"
          >
            <Package className="h-3 w-3" />
            Processing
          </Badge>
        )
      case "shipped":
        return (
          <Badge
            variant="outline"
            className="flex items-center gap-1 bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400"
          >
            <Truck className="h-3 w-3" />
            Shipped
          </Badge>
        )
      case "delivered":
        return (
          <Badge
            variant="outline"
            className="flex items-center gap-1 bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400"
          >
            <CheckCircle className="h-3 w-3" />
            Delivered
          </Badge>
        )
      case "cancelled":
        return (
          <Badge
            variant="outline"
            className="flex items-center gap-1 bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400"
          >
            <XCircle className="h-3 w-3" />
            Cancelled
          </Badge>
        )
      default:
        return null
    }
  }

  if (loading || isLoading) {
    return (
      <div className="container mx-auto px-4 py-16 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!user) {
    return null // Will redirect in useEffect
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">My Orders</h1>

      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search orders by ID or product name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="all">All Orders</TabsTrigger>
          <TabsTrigger value="processing">Processing</TabsTrigger>
          <TabsTrigger value="shipped">Shipped</TabsTrigger>
          <TabsTrigger value="delivered">Delivered</TabsTrigger>
          <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab}>
          {filteredOrders.length > 0 ? (
            <div className="space-y-6">
              {filteredOrders.map((order) => (
                <Card key={order.id} className="overflow-hidden">
                  <CardHeader className="bg-muted/50">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div>
                        <CardTitle className="text-lg">{order.id}</CardTitle>
                        <p className="text-sm text-muted-foreground">Ordered on {order.date}</p>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                        {getStatusBadge(order.status)}
                        <Button variant="outline" size="sm" asChild>
                          <a href={`/orders/${order.id}`}>View Details</a>
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-6">
                      <div className="grid gap-6 md:grid-cols-[2fr_1fr]">
                        <div>
                          <h3 className="font-medium mb-3">Items</h3>
                          <div className="space-y-4">
                            {order.items.map((item) => (
                              <div key={item.id} className="flex gap-4">
                                <img
                                  src={item.image || "/placeholder.svg"}
                                  alt={item.name}
                                  className="h-16 w-16 object-cover rounded-md"
                                />
                                <div>
                                  <h4 className="font-medium">{item.name}</h4>
                                  <p className="text-sm text-muted-foreground">
                                    ${item.price.toFixed(2)} x {item.quantity}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div>
                          <h3 className="font-medium mb-3">Order Summary</h3>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Total</span>
                              <span className="font-medium">${order.total.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Payment Method</span>
                              <span>{order.paymentMethod}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Shipping Address</span>
                              <span className="text-right">{order.address}</span>
                            </div>
                            {order.tracking && (
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Tracking Number</span>
                                <span>{order.tracking}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No orders found</h3>
              <p className="text-muted-foreground mb-6">
                {searchQuery
                  ? "No orders match your search criteria."
                  : activeTab !== "all"
                    ? `You don't have any ${activeTab} orders.`
                    : "You haven't placed any orders yet."}
              </p>
              <Button asChild>
                <a href="/shop">Start Shopping</a>
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
