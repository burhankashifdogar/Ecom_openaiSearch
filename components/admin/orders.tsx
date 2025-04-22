"use client"

import { useState, useEffect } from "react"
import { Search, Eye, MoreHorizontal, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"

type Order = {
  id: string
  customerName: string
  email: string
  total: number
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled"
  items: number
  date: string
}

export function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const { toast } = useToast()

  useEffect(() => {
    // In a real app, this would be an API call with pagination
    // For demo purposes, we'll use mock data
    const fetchOrders = async () => {
      try {
        // Generate mock orders
        const statuses: Order["status"][] = ["pending", "processing", "shipped", "delivered", "cancelled"]

        const mockOrders: Order[] = Array.from({ length: 50 }, (_, i) => ({
          id: `ord-${1000 + i}`,
          customerName: `Customer ${i + 1}`,
          email: `customer${i + 1}@example.com`,
          total: Math.floor(Math.random() * 500) + 20,
          status: statuses[Math.floor(Math.random() * statuses.length)],
          items: Math.floor(Math.random() * 5) + 1,
          date: new Date(Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000)).toISOString(),
        }))

        // Filter by search query
        let filteredOrders = mockOrders

        if (searchQuery) {
          filteredOrders = filteredOrders.filter(
            (order) =>
              order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
              order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
              order.email.toLowerCase().includes(searchQuery.toLowerCase()),
          )
        }

        // Filter by status
        if (statusFilter !== "all") {
          filteredOrders = filteredOrders.filter((order) => order.status === statusFilter)
        }

        // Paginate
        const itemsPerPage = 10
        const totalFilteredOrders = filteredOrders.length
        const calculatedTotalPages = Math.ceil(totalFilteredOrders / itemsPerPage)

        setTotalPages(calculatedTotalPages)

        // Adjust current page if it's out of bounds after filtering
        const adjustedCurrentPage = Math.min(currentPage, calculatedTotalPages || 1)
        if (adjustedCurrentPage !== currentPage) {
          setCurrentPage(adjustedCurrentPage)
        }

        const startIndex = (adjustedCurrentPage - 1) * itemsPerPage
        const paginatedOrders = filteredOrders.slice(startIndex, startIndex + itemsPerPage)

        // Simulate API delay
        setTimeout(() => {
          setOrders(paginatedOrders)
          setLoading(false)
        }, 1000)
      } catch (error) {
        console.error("Error fetching orders:", error)
        setLoading(false)
      }
    }

    fetchOrders()
  }, [searchQuery, statusFilter, currentPage])

  const updateOrderStatus = (orderId: string, newStatus: Order["status"]) => {
    // In a real app, this would be an API call
    setOrders((prevOrders) =>
      prevOrders.map((order) => (order.id === orderId ? { ...order, status: newStatus } : order)),
    )

    toast({
      title: "Order status updated",
      description: `Order ${orderId} has been updated to ${newStatus}.`,
    })
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date)
  }

  const getStatusBadgeVariant = (status: Order["status"]) => {
    switch (status) {
      case "pending":
        return "outline"
      case "processing":
        return "secondary"
      case "shipped":
        return "default"
      case "delivered":
        return "success"
      case "cancelled":
        return "destructive"
      default:
        return "outline"
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Orders</h2>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-center mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search orders..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="processing">Processing</SelectItem>
            <SelectItem value="shipped">Shipped</SelectItem>
            <SelectItem value="delivered">Delivered</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead className="text-right">Total</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Items</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: 5 }).map((_, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Skeleton className="h-5 w-[80px]" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-5 w-[150px]" />
                  </TableCell>
                  <TableCell className="text-right">
                    <Skeleton className="h-5 w-[60px] ml-auto" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-5 w-[80px]" />
                  </TableCell>
                  <TableCell className="text-right">
                    <Skeleton className="h-5 w-[30px] ml-auto" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-5 w-[80px]" />
                  </TableCell>
                  <TableCell className="text-right">
                    <Skeleton className="h-8 w-8 rounded-md ml-auto" />
                  </TableCell>
                </TableRow>
              ))
            ) : orders.length > 0 ? (
              orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.id}</TableCell>
                  <TableCell>
                    <div>
                      <div>{order.customerName}</div>
                      <div className="text-xs text-muted-foreground">{order.email}</div>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">${order.total.toFixed(2)}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(order.status)}>{order.status}</Badge>
                  </TableCell>
                  <TableCell className="text-right">{order.items}</TableCell>
                  <TableCell>{formatDate(order.date)}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Actions</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <Dialog>
                          <DialogTrigger asChild>
                            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                          </DialogTrigger>
                          <DialogContent className="max-w-3xl">
                            <DialogHeader>
                              <DialogTitle>Order Details - {order.id}</DialogTitle>
                            </DialogHeader>
                            <div className="py-4">
                              <div className="grid grid-cols-2 gap-4 mb-6">
                                <div>
                                  <h3 className="text-sm font-medium text-muted-foreground mb-1">
                                    Customer Information
                                  </h3>
                                  <p className="font-medium">{order.customerName}</p>
                                  <p>{order.email}</p>
                                </div>
                                <div>
                                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Order Information</h3>
                                  <p>
                                    <span className="font-medium">Date:</span> {formatDate(order.date)}
                                  </p>
                                  <p>
                                    <span className="font-medium">Status:</span>{" "}
                                    <Badge variant={getStatusBadgeVariant(order.status)}>{order.status}</Badge>
                                  </p>
                                </div>
                              </div>

                              <h3 className="text-sm font-medium text-muted-foreground mb-2">Order Items</h3>
                              <div className="border rounded-md mb-6">
                                <Table>
                                  <TableHeader>
                                    <TableRow>
                                      <TableHead>Product</TableHead>
                                      <TableHead className="text-right">Price</TableHead>
                                      <TableHead className="text-right">Quantity</TableHead>
                                      <TableHead className="text-right">Total</TableHead>
                                    </TableRow>
                                  </TableHeader>
                                  <TableBody>
                                    {/* Mock order items */}
                                    {Array.from({ length: order.items }).map((_, i) => (
                                      <TableRow key={i}>
                                        <TableCell>Product {i + 1}</TableCell>
                                        <TableCell className="text-right">
                                          ${(order.total / order.items / 2).toFixed(2)}
                                        </TableCell>
                                        <TableCell className="text-right">2</TableCell>
                                        <TableCell className="text-right">
                                          ${(order.total / order.items).toFixed(2)}
                                        </TableCell>
                                      </TableRow>
                                    ))}
                                  </TableBody>
                                </Table>
                              </div>

                              <div className="flex justify-between items-start">
                                <div>
                                  <h3 className="text-sm font-medium text-muted-foreground mb-2">Update Status</h3>
                                  <Select
                                    defaultValue={order.status}
                                    onValueChange={(value) => updateOrderStatus(order.id, value as Order["status"])}
                                  >
                                    <SelectTrigger className="w-[180px]">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="pending">Pending</SelectItem>
                                      <SelectItem value="processing">Processing</SelectItem>
                                      <SelectItem value="shipped">Shipped</SelectItem>
                                      <SelectItem value="delivered">Delivered</SelectItem>
                                      <SelectItem value="cancelled">Cancelled</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>

                                <div className="text-right">
                                  <h3 className="text-sm font-medium text-muted-foreground mb-2">Order Summary</h3>
                                  <div className="space-y-1">
                                    <div className="flex justify-between">
                                      <span>Subtotal:</span>
                                      <span>${(order.total * 0.9).toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span>Tax:</span>
                                      <span>${(order.total * 0.1).toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span>Shipping:</span>
                                      <span>Free</span>
                                    </div>
                                    <div className="flex justify-between font-bold pt-2 border-t">
                                      <span>Total:</span>
                                      <span>${order.total.toFixed(2)}</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <DialogFooter>
                              <DialogClose asChild>
                                <Button>Close</Button>
                              </DialogClose>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                        <DropdownMenuItem
                          onClick={() => updateOrderStatus(order.id, "processing")}
                          disabled={order.status !== "pending"}
                        >
                          Mark as Processing
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => updateOrderStatus(order.id, "shipped")}
                          disabled={order.status !== "processing"}
                        >
                          Mark as Shipped
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => updateOrderStatus(order.id, "delivered")}
                          disabled={order.status !== "shipped"}
                        >
                          Mark as Delivered
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => updateOrderStatus(order.id, "cancelled")}
                          disabled={order.status === "delivered" || order.status === "cancelled"}
                          className="text-destructive focus:text-destructive"
                        >
                          Cancel Order
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-6">
                  No orders found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-4">
        <p className="text-sm text-muted-foreground">
          Showing page {currentPage} of {totalPages}
        </p>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1 || loading}
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Previous Page</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages || loading}
          >
            <ChevronRight className="h-4 w-4" />
            <span className="sr-only">Next Page</span>
          </Button>
        </div>
      </div>
    </div>
  )
}
