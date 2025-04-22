"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/hooks/use-toast"
import { useCart } from "@/components/cart-provider"

type Product = {
  id: string
  name: string
  price: number
  image: string
  category: string
}

export function ProductGrid({
  category,
  limit = 8,
}: {
  category?: string
  limit?: number
}) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()
  const { addToCart } = useCart()

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // In a real app, this would be an API call with category filter
        // For demo purposes, we'll use mock data
        const mockProducts: Product[] = [
          {
            id: "1",
            name: "Premium Wireless Headphones",
            price: 199.99,
            image: "/placeholder.svg?height=300&width=300",
            category: "electronics",
          },
          {
            id: "2",
            name: "Smart Fitness Watch",
            price: 149.99,
            image: "/placeholder.svg?height=300&width=300",
            category: "accessories",
          },
          {
            id: "3",
            name: "Designer Summer Dress",
            price: 79.99,
            image: "/placeholder.svg?height=300&width=300",
            category: "clothing",
          },
          {
            id: "4",
            name: "Ergonomic Office Chair",
            price: 249.99,
            image: "/placeholder.svg?height=300&width=300",
            category: "home-living",
          },
          {
            id: "5",
            name: "Bluetooth Portable Speaker",
            price: 89.99,
            image: "/placeholder.svg?height=300&width=300",
            category: "electronics",
          },
          {
            id: "6",
            name: "Leather Crossbody Bag",
            price: 129.99,
            image: "/placeholder.svg?height=300&width=300",
            category: "accessories",
          },
          {
            id: "7",
            name: "Men's Casual Sneakers",
            price: 69.99,
            image: "/placeholder.svg?height=300&width=300",
            category: "clothing",
          },
          {
            id: "8",
            name: "Scented Candle Set",
            price: 34.99,
            image: "/placeholder.svg?height=300&width=300",
            category: "home-living",
          },
        ]

        // Filter by category if provided
        let filteredProducts = mockProducts
        if (category) {
          filteredProducts = mockProducts.filter(
            (product) => product.category === category || category === "new-arrivals",
          )
        }

        // Limit the number of products
        filteredProducts = filteredProducts.slice(0, limit)

        // Simulate API delay
        setTimeout(() => {
          setProducts(filteredProducts)
          setLoading(false)
        }, 1000)
      } catch (error) {
        console.error("Error fetching products:", error)
        setLoading(false)
      }
    }

    fetchProducts()
  }, [category, limit])

  const handleAddToCart = (product: Product) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
    })

    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    })
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {Array.from({ length: limit }).map((_, index) => (
          <Card key={index} className="overflow-hidden">
            <CardContent className="p-0">
              <Skeleton className="h-48 w-full" />
            </CardContent>
            <div className="p-4 space-y-3">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <div className="flex justify-between items-center pt-2">
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-8 w-24" />
              </div>
            </div>
          </Card>
        ))}
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No products found.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
      {products.map((product) => (
        <Card key={product.id} className="overflow-hidden">
          <CardContent className="p-0">
            <Link href={`/products/${product.id}`}>
              <div className="overflow-hidden">
                <img
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                  className="h-48 w-full object-cover transition-transform hover:scale-105"
                />
              </div>
            </Link>
          </CardContent>
          <CardFooter className="flex flex-col items-start p-4">
            <Link href={`/products/${product.id}`} className="hover:underline">
              <h3 className="font-medium">{product.name}</h3>
            </Link>
            <p className="text-lg font-bold my-2">${product.price.toFixed(2)}</p>
            <div className="flex justify-between items-center w-full mt-2">
              <Link href={`/categories/${product.category}`} className="text-xs text-muted-foreground hover:underline">
                {product.category.replace("-", " ")}
              </Link>
              <Button onClick={() => handleAddToCart(product)} size="sm">
                Add to Cart
              </Button>
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
