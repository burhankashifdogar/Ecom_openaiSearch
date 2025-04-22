"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { SearchBar } from "@/components/search-bar"
import { useToast } from "@/hooks/use-toast"
import { useCart } from "@/components/cart-provider"

type Product = {
  id: string
  name: string
  price: number
  image: string
  category: string
  description: string
}

export default function ImageSearchPage() {
  const searchParams = useSearchParams()
  const searchId = searchParams.get("id")
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()
  const { addToCart } = useCart()

  useEffect(() => {
    if (!searchId) {
      setLoading(false)
      return
    }

    // In a real implementation, you would fetch the results using the searchId
    // For this demo, we'll simulate a delay and return mock results
    const fetchResults = async () => {
      try {
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 1500))

        // Mock products that would be returned from the image search
        const mockResults = [
          {
            id: "1",
            name: "Red Floral Summer Dress",
            price: 49.99,
            image: "/placeholder.svg?height=300&width=300",
            category: "clothing",
            description: "A beautiful red dress with floral print, perfect for summer outings and casual events.",
          },
          {
            id: "7",
            name: "Women's Black Leather Jacket",
            price: 199.99,
            image: "/placeholder.svg?height=300&width=300",
            category: "clothing",
            description: "Classic black leather jacket for women, perfect for adding an edge to any outfit.",
          },
          {
            id: "8",
            name: "Men's Casual Button-Down Shirt",
            price: 45.99,
            image: "/placeholder.svg?height=300&width=300",
            category: "clothing",
            description:
              "Comfortable and stylish button-down shirt for men, suitable for casual and semi-formal occasions.",
          },
        ]

        setProducts(mockResults)
        setLoading(false)
      } catch (error) {
        console.error("Error fetching image search results:", error)
        toast({
          title: "Error",
          description: "Failed to fetch image search results. Please try again.",
          variant: "destructive",
        })
        setLoading(false)
      }
    }

    fetchResults()
  }, [searchId, toast])

  const handleAddToCart = (product: Product) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1,
    })

    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    })
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <SearchBar />
      </div>

      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Image Search Results</h1>
        {loading ? (
          <p className="text-muted-foreground">Searching for visually similar products...</p>
        ) : (
          <p className="text-muted-foreground">Found {products.length} visually similar products</p>
        )}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: 3 }).map((_, index) => (
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
      ) : products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <Card key={product.id} className="overflow-hidden h-full flex flex-col">
              <CardContent className="p-0 flex-shrink-0">
                <Link href={`/products/${product.id}`}>
                  <img
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    className="h-48 w-full object-cover transition-transform hover:scale-105"
                  />
                </Link>
              </CardContent>
              <CardFooter className="flex flex-col items-start p-4 flex-grow">
                <Link href={`/products/${product.id}`} className="hover:underline">
                  <h3 className="font-medium">{product.name}</h3>
                </Link>
                <p className="text-sm text-muted-foreground my-2 line-clamp-2">{product.description}</p>
                <p className="text-lg font-bold my-2">${product.price.toFixed(2)}</p>
                <div className="flex justify-between items-center w-full mt-2 mt-auto">
                  <span className="text-xs text-muted-foreground capitalize">{product.category}</span>
                  <Button onClick={() => handleAddToCart(product)} size="sm">
                    Add to Cart
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No similar products found.</p>
          <p className="text-muted-foreground mt-2">Try uploading a different image.</p>
          <Button asChild className="mt-6">
            <Link href="/search">Return to Search</Link>
          </Button>
        </div>
      )}
    </div>
  )
}
