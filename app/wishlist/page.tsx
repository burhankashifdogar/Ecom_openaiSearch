"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth-provider"
import { useCart } from "@/components/cart-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { Heart, Loader2, ShoppingCart, Trash2, MoveRight } from "lucide-react"

type WishlistItem = {
  id: string
  name: string
  price: number
  image: string
  category: string
  inStock: boolean
}

export default function WishlistPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const { addToCart } = useCart()
  const [wishlist, setWishlist] = useState<WishlistItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login")
    } else if (user) {
      // Fetch wishlist (mock data for demo)
      fetchWishlist()
    }
  }, [user, loading, router])

  const fetchWishlist = async () => {
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      const mockWishlist: WishlistItem[] = [
        {
          id: "1",
          name: "Wireless Noise-Cancelling Headphones",
          price: 249.99,
          image: "/placeholder.svg?height=200&width=200",
          category: "Electronics",
          inStock: true,
        },
        {
          id: "2",
          name: "Smart Fitness Watch",
          price: 179.99,
          image: "/placeholder.svg?height=200&width=200",
          category: "Wearables",
          inStock: true,
        },
        {
          id: "3",
          name: "Premium Leather Wallet",
          price: 59.99,
          image: "/placeholder.svg?height=200&width=200",
          category: "Accessories",
          inStock: false,
        },
        {
          id: "4",
          name: "Portable Bluetooth Speaker",
          price: 89.99,
          image: "/placeholder.svg?height=200&width=200",
          category: "Audio",
          inStock: true,
        },
      ]

      setWishlist(mockWishlist)
      setIsLoading(false)
    }, 1000)
  }

  const handleAddToCart = (item: WishlistItem) => {
    addToCart({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image,
    })

    toast({
      title: "Added to cart",
      description: `${item.name} has been added to your cart.`,
    })
  }

  const handleRemoveFromWishlist = (itemId: string, itemName: string) => {
    setWishlist(wishlist.filter((item) => item.id !== itemId))

    toast({
      title: "Removed from wishlist",
      description: `${itemName} has been removed from your wishlist.`,
    })
  }

  const handleAddAllToCart = () => {
    const inStockItems = wishlist.filter((item) => item.inStock)

    inStockItems.forEach((item) => {
      addToCart({
        id: item.id,
        name: item.name,
        price: item.price,
        image: item.image,
      })
    })

    toast({
      title: "Items added to cart",
      description: `${inStockItems.length} items have been added to your cart.`,
    })
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
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">My Wishlist</h1>
          <p className="text-muted-foreground">
            {wishlist.length} {wishlist.length === 1 ? "item" : "items"}
          </p>
        </div>
        {wishlist.length > 0 && (
          <Button onClick={handleAddAllToCart} className="flex items-center gap-2">
            <ShoppingCart className="h-4 w-4" />
            Add All to Cart
          </Button>
        )}
      </div>

      {wishlist.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlist.map((item) => (
            <Card key={item.id} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="relative">
                  <img src={item.image || "/placeholder.svg"} alt={item.name} className="w-full h-48 object-cover" />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 bg-background/80 hover:bg-background/90 text-destructive"
                    onClick={() => handleRemoveFromWishlist(item.id, item.name)}
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Remove from wishlist</span>
                  </Button>
                </div>
                <div className="p-4">
                  <h3 className="font-medium mb-1">{item.name}</h3>
                  <p className="text-sm text-muted-foreground mb-2">{item.category}</p>
                  <div className="flex justify-between items-center">
                    <p className="text-lg font-bold">${item.price.toFixed(2)}</p>
                    {item.inStock ? (
                      <Button size="sm" onClick={() => handleAddToCart(item)}>
                        Add to Cart
                      </Button>
                    ) : (
                      <Button size="sm" variant="outline" disabled>
                        Out of Stock
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Heart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">Your wishlist is empty</h3>
          <p className="text-muted-foreground mb-6">Add items to your wishlist to save them for later.</p>
          <Button asChild>
            <a href="/shop" className="flex items-center gap-2">
              Continue Shopping
              <MoveRight className="h-4 w-4" />
            </a>
          </Button>
        </div>
      )}
    </div>
  )
}
