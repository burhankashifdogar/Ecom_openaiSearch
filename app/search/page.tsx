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

// Mock product database - expanded with more products and better descriptions
const mockProducts: Product[] = [
  {
    id: "1",
    name: "Red Floral Summer Dress",
    price: 49.99,
    image: "/placeholder.svg?height=300&width=300",
    category: "clothing",
    description: "A beautiful red dress with floral print, perfect for summer outings and casual events.",
  },
  {
    id: "2",
    name: "Blue Denim Jeans",
    price: 59.99,
    image: "/placeholder.svg?height=300&width=300",
    category: "clothing",
    description: "Classic blue denim jeans with a comfortable fit and durable material for everyday wear.",
  },
  {
    id: "3",
    name: "Men's Running Shoes",
    price: 89.99,
    image: "/placeholder.svg?height=300&width=300",
    category: "footwear",
    description: "Comfortable running shoes with cushioned soles for maximum support during workouts and runs.",
  },
  {
    id: "4",
    name: "Wireless Bluetooth Headphones",
    price: 129.99,
    image: "/placeholder.svg?height=300&width=300",
    category: "electronics",
    description: "High-quality wireless headphones with noise cancellation and long battery life.",
  },
  {
    id: "5",
    name: "Leather Crossbody Bag",
    price: 79.99,
    image: "/placeholder.svg?height=300&width=300",
    category: "accessories",
    description: "Stylish leather crossbody bag with multiple compartments, perfect for everyday use.",
  },
  {
    id: "6",
    name: "Smart Fitness Watch",
    price: 149.99,
    image: "/placeholder.svg?height=300&width=300",
    category: "electronics",
    description: "Track your fitness goals with this advanced smartwatch featuring heart rate monitoring and GPS.",
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
    description: "Comfortable and stylish button-down shirt for men, suitable for casual and semi-formal occasions.",
  },
  {
    id: "9",
    name: "Stainless Steel Water Bottle",
    price: 24.99,
    image: "/placeholder.svg?height=300&width=300",
    category: "accessories",
    description: "Eco-friendly stainless steel water bottle that keeps drinks cold for 24 hours or hot for 12 hours.",
  },
  {
    id: "10",
    name: "Wireless Charging Pad",
    price: 35.99,
    image: "/placeholder.svg?height=300&width=300",
    category: "electronics",
    description: "Fast wireless charging pad compatible with all Qi-enabled devices.",
  },
  {
    id: "11",
    name: "Yoga Mat",
    price: 29.99,
    image: "/placeholder.svg?height=300&width=300",
    category: "sports",
    description: "Non-slip yoga mat with comfortable padding for all types of yoga and floor exercises.",
  },
  {
    id: "12",
    name: "Ceramic Coffee Mug Set",
    price: 39.99,
    image: "/placeholder.svg?height=300&width=300",
    category: "home",
    description: "Set of 4 ceramic coffee mugs in assorted colors, microwave and dishwasher safe.",
  },
]

// Enhanced search parser function
function parseSearchQuery(query: string) {
  const lowercaseQuery = query.toLowerCase()

  // Extract potential price constraints
  const priceRegex = /under\s+\$?(\d+)|less\s+than\s+\$?(\d+)|cheaper\s+than\s+\$?(\d+)/i
  const priceMatch = query.match(priceRegex)
  const priceMax = priceMatch ? Number.parseInt(priceMatch[1] || priceMatch[2] || priceMatch[3]) : null

  // Extract price range
  const priceRangeRegex = /between\s+\$?(\d+)\s+and\s+\$?(\d+)/i
  const priceRangeMatch = query.match(priceRangeRegex)
  const priceRange = priceRangeMatch
    ? { min: Number.parseInt(priceRangeMatch[1]), max: Number.parseInt(priceRangeMatch[2]) }
    : null

  // Extract color information
  const commonColors = [
    "red",
    "blue",
    "green",
    "yellow",
    "black",
    "white",
    "purple",
    "orange",
    "pink",
    "brown",
    "gray",
    "grey",
    "silver",
    "gold",
  ]
  const colorMatches = commonColors.filter((color) => lowercaseQuery.includes(color))
  const color = colorMatches.length > 0 ? colorMatches[0] : null

  // Extract category information
  const categories = [
    "dress",
    "jeans",
    "shoes",
    "headphones",
    "bag",
    "watch",
    "clothing",
    "footwear",
    "electronics",
    "accessories",
    "sports",
    "home",
    "jacket",
    "shirt",
  ]
  const categoryMatches = categories.filter((category) => lowercaseQuery.includes(category))
  const category = categoryMatches.length > 0 ? categoryMatches[0] : null

  // Extract pattern/style information
  const patterns = ["floral", "striped", "plain", "patterned", "solid", "printed", "leather", "denim", "cotton"]
  const patternMatches = patterns.filter((pattern) => lowercaseQuery.includes(pattern))
  const pattern = patternMatches.length > 0 ? patternMatches[0] : null

  // Extract gender information
  const genders = ["men", "women", "men's", "women's", "unisex"]
  const genderMatches = genders.filter(
    (gender) =>
      lowercaseQuery.includes(gender) ||
      lowercaseQuery.includes(`${gender}'s`) ||
      lowercaseQuery.includes(`${gender}s`),
  )
  const gender = genderMatches.length > 0 ? genderMatches[0] : null

  return {
    category,
    color,
    priceMax,
    priceRange,
    pattern,
    gender,
    query: lowercaseQuery, // Keep the original query for general matching
  }
}

export default function SearchPage() {
  const searchParams = useSearchParams()
  const query = searchParams.get("q")
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()
  const { addToCart } = useCart()

  useEffect(() => {
    if (!query) return

    const searchProducts = async () => {
      setLoading(true)
      try {
        // Parse the search query using our enhanced parser
        const parsedQuery = parseSearchQuery(query)
        console.log("Parsed query:", parsedQuery)

        // Filter products based on parsed query
        let filteredProducts = [...mockProducts]

        // Filter by general query match
        filteredProducts = filteredProducts.filter((product) => {
          const productText = `${product.name} ${product.description} ${product.category}`.toLowerCase()
          return productText.includes(parsedQuery.query)
        })

        // Apply specific filters if they exist
        if (parsedQuery.category) {
          filteredProducts = filteredProducts.filter(
            (product) =>
              product.category.toLowerCase().includes(parsedQuery.category!) ||
              product.name.toLowerCase().includes(parsedQuery.category!) ||
              product.description.toLowerCase().includes(parsedQuery.category!),
          )
        }

        if (parsedQuery.color) {
          filteredProducts = filteredProducts.filter(
            (product) =>
              product.name.toLowerCase().includes(parsedQuery.color!) ||
              product.description.toLowerCase().includes(parsedQuery.color!),
          )
        }

        if (parsedQuery.priceMax) {
          filteredProducts = filteredProducts.filter((product) => product.price <= parsedQuery.priceMax!)
        }

        if (parsedQuery.priceRange) {
          filteredProducts = filteredProducts.filter(
            (product) => product.price >= parsedQuery.priceRange!.min && product.price <= parsedQuery.priceRange!.max,
          )
        }

        if (parsedQuery.pattern) {
          filteredProducts = filteredProducts.filter(
            (product) =>
              product.name.toLowerCase().includes(parsedQuery.pattern!) ||
              product.description.toLowerCase().includes(parsedQuery.pattern!),
          )
        }

        if (parsedQuery.gender) {
          const genderTerm = parsedQuery.gender.replace(/'s$/, "").toLowerCase()
          filteredProducts = filteredProducts.filter(
            (product) =>
              product.name.toLowerCase().includes(genderTerm) || product.description.toLowerCase().includes(genderTerm),
          )
        }

        // If we have no results but have a query, try a more lenient search
        if (filteredProducts.length === 0 && query.trim() !== "") {
          const words = query
            .toLowerCase()
            .split(/\s+/)
            .filter((word) => word.length > 2)

          if (words.length > 0) {
            filteredProducts = mockProducts.filter((product) => {
              const productText = `${product.name} ${product.description} ${product.category}`.toLowerCase()
              return words.some((word) => productText.includes(word))
            })
          }
        }

        // Simulate API delay
        setTimeout(() => {
          setProducts(filteredProducts)
          setLoading(false)
        }, 800)
      } catch (error) {
        console.error("Error searching products:", error)
        toast({
          title: "Search error",
          description: "There was an error processing your search. Please try again.",
          variant: "destructive",
        })
        setLoading(false)
      }
    }

    searchProducts()
  }, [query, toast])

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
        <SearchBar initialQuery={query || ""} />
      </div>

      {query ? (
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2">Search Results for "{query}"</h1>
          {loading ? (
            <p className="text-muted-foreground">Searching...</p>
          ) : (
            <p className="text-muted-foreground">Found {products.length} results</p>
          )}
        </div>
      ) : (
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold mb-2">Search Products</h1>
          <p className="text-muted-foreground">Enter a search query to find products</p>
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, index) => (
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
      ) : query ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No products found matching your search.</p>
          <p className="text-muted-foreground mt-2">Try using different keywords or filters.</p>
          <div className="mt-6">
            <h2 className="text-lg font-medium mb-4">Popular Categories</h2>
            <div className="flex flex-wrap justify-center gap-2">
              {["Clothing", "Electronics", "Footwear", "Accessories", "Home"].map((category) => (
                <Button
                  key={category}
                  variant="outline"
                  onClick={() => {
                    const input = document.querySelector('input[type="text"]') as HTMLInputElement
                    if (input) {
                      input.value = category
                      input.form?.dispatchEvent(new Event("submit", { cancelable: true }))
                    }
                  }}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}
