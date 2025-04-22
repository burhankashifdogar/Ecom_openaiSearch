"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { ChevronRight, Star, ShoppingCart, Heart, Share2, Check, ArrowLeft, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/hooks/use-toast"
import { useCart } from "@/components/cart-provider"
import { Badge } from "@/components/ui/badge"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

type Product = {
  id: string
  name: string
  price: number
  description: string
  features: string[]
  specifications: Record<string, string>
  images: string[]
  category: string
  rating: number
  reviewCount: number
  stock: number
  tags: string[]
  discount?: number
  isNew?: boolean
}

type Recommendation = {
  id: string
  name: string
  price: number
  image: string
  description: string
  category: string
}

export default function ProductPage() {
  const params = useParams()
  const productId = params.id as string
  const [product, setProduct] = useState<Product | null>(null)
  const [recommendations, setRecommendations] = useState<Recommendation[]>([])
  const [loading, setLoading] = useState(true)
  const [recommendationsLoading, setRecommendationsLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [addedToCart, setAddedToCart] = useState(false)
  const [activeImageIndex, setActiveImageIndex] = useState(0)
  const [isWishlisted, setIsWishlisted] = useState(false)
  const { toast } = useToast()
  const { addToCart } = useCart()

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true)
      try {
        // In a real app, this would be an API call
        // For demo purposes, we'll use mock data
        const mockProduct: Product = {
          id: productId,
          name: "Premium Wireless Headphones",
          price: 199.99,
          description:
            "Experience immersive sound with our Premium Wireless Headphones. Featuring active noise cancellation, high-fidelity audio, and a comfortable over-ear design, these headphones are perfect for music lovers and professionals alike. With 30 hours of battery life and quick charging, you can enjoy your favorite music all day long.",
          features: [
            "Active Noise Cancellation",
            "30-hour battery life",
            "Bluetooth 5.0 connectivity",
            "High-fidelity audio",
            "Comfortable over-ear design",
            "Built-in microphone for calls",
            "Quick charging (3 hours of playback with 10 minutes of charging)",
          ],
          specifications: {
            Brand: "AudioTech",
            Model: "WH-1000X",
            Color: "Matte Black",
            Connectivity: "Bluetooth 5.0, 3.5mm audio jack",
            "Battery Life": "30 hours",
            Weight: "250g",
            Dimensions: "7.5 x 6.5 x 3.5 inches",
            Warranty: "2 years",
          },
          images: [
            "/placeholder.svg?height=600&width=600",
            "/placeholder.svg?height=600&width=600",
            "/placeholder.svg?height=600&width=600",
            "/placeholder.svg?height=600&width=600",
          ],
          category: "Electronics",
          rating: 4.8,
          reviewCount: 256,
          stock: 15,
          tags: ["wireless", "headphones", "audio", "bluetooth"],
          discount: 15,
          isNew: true,
        }

        // Simulate API delay
        setTimeout(() => {
          setProduct(mockProduct)
          setLoading(false)
        }, 1000)
      } catch (error) {
        console.error("Error fetching product:", error)
        setLoading(false)
      }
    }

    const fetchRecommendations = async () => {
      setRecommendationsLoading(true)
      try {
        // In a real app, this would be an API call to your AI-powered recommendations endpoint
        // For demo purposes, we'll use mock data
        const mockRecommendations: Recommendation[] = [
          {
            id: "2",
            name: "Wireless Earbuds",
            price: 129.99,
            image: "/placeholder.svg?height=300&width=300",
            description: "Compact wireless earbuds with noise isolation and crystal clear sound.",
            category: "Audio",
          },
          {
            id: "3",
            name: "Bluetooth Speaker",
            price: 89.99,
            image: "/placeholder.svg?height=300&width=300",
            description: "Portable Bluetooth speaker with 360° sound and 12-hour battery life.",
            category: "Audio",
          },
          {
            id: "4",
            name: "Headphone Stand",
            price: 29.99,
            image: "/placeholder.svg?height=300&width=300",
            description: "Elegant aluminum headphone stand to display and organize your headphones.",
            category: "Accessories",
          },
          {
            id: "5",
            name: "Premium Audio Cable",
            price: 19.99,
            image: "/placeholder.svg?height=300&width=300",
            description: "Gold-plated 3.5mm audio cable for superior sound quality.",
            category: "Accessories",
          },
        ]

        // Simulate API delay
        setTimeout(() => {
          setRecommendations(mockRecommendations)
          setRecommendationsLoading(false)
        }, 1500)
      } catch (error) {
        console.error("Error fetching recommendations:", error)
        setRecommendationsLoading(false)
      }
    }

    fetchProduct()
    fetchRecommendations()

    // Reset state when product ID changes
    return () => {
      setActiveImageIndex(0)
      setQuantity(1)
      setAddedToCart(false)
    }
  }, [productId])

  const handleAddToCart = () => {
    if (!product) return

    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0],
      quantity,
    })

    setAddedToCart(true)
    setTimeout(() => setAddedToCart(false), 2000)

    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    })
  }

  const handleToggleWishlist = () => {
    setIsWishlisted(!isWishlisted)

    toast({
      title: isWishlisted ? "Removed from wishlist" : "Added to wishlist",
      description: isWishlisted
        ? `${product?.name} has been removed from your wishlist.`
        : `${product?.name} has been added to your wishlist.`,
    })
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product?.name,
          text: product?.description,
          url: window.location.href,
        })
      } catch (error) {
        console.error("Error sharing:", error)
      }
    } else {
      // Fallback for browsers that don't support the Web Share API
      navigator.clipboard.writeText(window.location.href)
      toast({
        title: "Link copied",
        description: "Product link has been copied to clipboard.",
      })
    }
  }

  const nextImage = () => {
    if (!product) return
    setActiveImageIndex((prev) => (prev + 1) % product.images.length)
  }

  const prevImage = () => {
    if (!product) return
    setActiveImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length)
  }

  const calculateDiscountedPrice = (price: number, discount?: number) => {
    if (!discount) return price
    return price - (price * discount) / 100
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-1/2">
            <Skeleton className="aspect-square w-full rounded-lg" />
            <div className="grid grid-cols-4 gap-2 mt-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="aspect-square w-full rounded-lg" />
              ))}
            </div>
          </div>
          <div className="md:w-1/2 space-y-4">
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-6 w-1/4" />
            <Skeleton className="h-6 w-1/3" />
            <div className="space-y-2 mt-6">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
            <div className="pt-6">
              <Skeleton className="h-12 w-full max-w-xs" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
        <p className="text-muted-foreground mb-6">
          The product you are looking for does not exist or has been removed.
        </p>
        <Button asChild>
          <Link href="/shop">Browse Products</Link>
        </Button>
      </div>
    )
  }

  const discountedPrice = calculateDiscountedPrice(product.price, product.discount)

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumbs */}
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator>
            <ChevronRight className="h-4 w-4" />
          </BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbLink href="/shop">Shop</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator>
            <ChevronRight className="h-4 w-4" />
          </BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbLink href={`/categories/${product.category.toLowerCase()}`}>{product.category}</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator>
            <ChevronRight className="h-4 w-4" />
          </BreadcrumbSeparator>
          <BreadcrumbItem>
            <span className="truncate max-w-[200px] inline-block">{product.name}</span>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Product Images */}
        <div className="md:w-1/2">
          <div className="relative aspect-square bg-muted rounded-lg overflow-hidden">
            <Image
              src={product.images[activeImageIndex] || "/placeholder.svg"}
              alt={`${product.name} - View ${activeImageIndex + 1}`}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />

            {/* Image navigation buttons */}
            <div className="absolute inset-0 flex items-center justify-between p-2">
              <Button
                variant="secondary"
                size="icon"
                className="rounded-full opacity-70 hover:opacity-100"
                onClick={prevImage}
              >
                <ArrowLeft className="h-4 w-4" />
                <span className="sr-only">Previous image</span>
              </Button>
              <Button
                variant="secondary"
                size="icon"
                className="rounded-full opacity-70 hover:opacity-100"
                onClick={nextImage}
              >
                <ArrowRight className="h-4 w-4" />
                <span className="sr-only">Next image</span>
              </Button>
            </div>

            {/* Badges */}
            <div className="absolute top-2 left-2 flex flex-col gap-2">
              {product.isNew && <Badge className="bg-blue-500 hover:bg-blue-600">New</Badge>}
              {product.discount && <Badge className="bg-red-500 hover:bg-red-600">-{product.discount}%</Badge>}
            </div>
          </div>

          {/* Thumbnail images */}
          <div className="grid grid-cols-4 gap-2 mt-4">
            {product.images.map((image, index) => (
              <button
                key={index}
                className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                  activeImageIndex === index ? "border-primary" : "border-transparent hover:border-primary/50"
                }`}
                onClick={() => setActiveImageIndex(index)}
              >
                <Image
                  src={image || "/placeholder.svg"}
                  alt={`${product.name} - Thumbnail ${index + 1}`}
                  width={100}
                  height={100}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Product Details */}
        <div className="md:w-1/2">
          <h1 className="text-3xl font-bold">{product.name}</h1>

          <div className="flex items-center mt-2 mb-4">
            <div className="flex items-center">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-5 w-5 ${
                    i < Math.floor(product.rating)
                      ? "text-yellow-500 fill-yellow-500"
                      : i < product.rating
                        ? "text-yellow-500 fill-yellow-500 opacity-50"
                        : "text-muted-foreground"
                  }`}
                />
              ))}
              <span className="ml-2 text-sm font-medium">{product.rating}</span>
            </div>
            <span className="mx-2 text-muted-foreground">•</span>
            <Link href="#reviews" className="text-sm text-muted-foreground hover:text-primary">
              {product.reviewCount} reviews
            </Link>
          </div>

          {/* Price */}
          <div className="flex items-center gap-2 mb-6">
            {product.discount ? (
              <>
                <span className="text-2xl font-bold">${discountedPrice.toFixed(2)}</span>
                <span className="text-lg text-muted-foreground line-through">${product.price.toFixed(2)}</span>
                <Badge variant="outline" className="text-red-500 border-red-500">
                  Save ${(product.price - discountedPrice).toFixed(2)}
                </Badge>
              </>
            ) : (
              <span className="text-2xl font-bold">${product.price.toFixed(2)}</span>
            )}
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            {product.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="capitalize">
                {tag}
              </Badge>
            ))}
          </div>

          <p className="text-muted-foreground mb-6">{product.description}</p>

          <div className="mb-6">
            <div className="flex items-center mb-2">
              <div className={`mr-2 rounded-full p-1 ${product.stock > 0 ? "bg-green-500" : "bg-red-500"}`}>
                {product.stock > 0 ? <Check className="h-3 w-3 text-white" /> : <span className="h-3 w-3 block" />}
              </div>
              <span className="text-sm font-medium">
                {product.stock > 0 ? `In Stock (${product.stock} available)` : "Out of Stock"}
              </span>
            </div>
          </div>

          {/* Quantity selector and Add to cart */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-8">
            <div className="flex items-center border rounded-md">
              <button
                className="px-3 py-2 text-lg border-r"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={quantity <= 1}
                aria-label="Decrease quantity"
              >
                -
              </button>
              <span className="px-4 py-2 min-w-[3rem] text-center">{quantity}</span>
              <button
                className="px-3 py-2 text-lg border-l"
                onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                disabled={quantity >= product.stock}
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>

            <Button
              size="lg"
              className="flex-1 w-full sm:w-auto"
              onClick={handleAddToCart}
              disabled={product.stock === 0}
            >
              {addedToCart ? (
                <>
                  <Check className="mr-2 h-5 w-5" />
                  Added to Cart
                </>
              ) : (
                <>
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  Add to Cart
                </>
              )}
            </Button>

            <Button
              variant="outline"
              size="icon"
              onClick={handleToggleWishlist}
              className={isWishlisted ? "text-red-500" : ""}
              aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
            >
              <Heart className={`h-5 w-5 ${isWishlisted ? "fill-current" : ""}`} />
            </Button>

            <Button variant="outline" size="icon" onClick={handleShare} aria-label="Share product">
              <Share2 className="h-5 w-5" />
            </Button>
          </div>

          <Tabs defaultValue="features" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="features">Features</TabsTrigger>
              <TabsTrigger value="specifications">Specifications</TabsTrigger>
              <TabsTrigger value="shipping">Shipping</TabsTrigger>
            </TabsList>
            <TabsContent value="features" className="pt-4">
              <ul className="space-y-2">
                {product.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </TabsContent>
            <TabsContent value="specifications" className="pt-4">
              <div className="space-y-2">
                {Object.entries(product.specifications).map(([key, value]) => (
                  <div key={key} className="grid grid-cols-2 gap-4 py-2 border-b last:border-0">
                    <div className="font-medium">{key}</div>
                    <div>{value}</div>
                  </div>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="shipping" className="pt-4">
              <div className="space-y-4">
                <p>Free standard shipping on all orders over $50.</p>
                <p>Estimated delivery time: 3-5 business days.</p>
                <p>Express shipping available at checkout for an additional fee.</p>
                <p>International shipping available to select countries.</p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Recommendations */}
      <section className="mt-16">
        <h2 className="text-2xl font-bold mb-6">You May Also Like</h2>

        {recommendationsLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="border rounded-lg overflow-hidden">
                <Skeleton className="h-48 w-full" />
                <div className="p-4 space-y-3">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <div className="flex justify-between items-center pt-2">
                    <Skeleton className="h-4 w-1/4" />
                    <Skeleton className="h-8 w-24" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {recommendations.map((item) => (
              <div key={item.id} className="border rounded-lg overflow-hidden">
                <Link href={`/products/${item.id}`}>
                  <div className="aspect-square bg-muted overflow-hidden">
                    <Image
                      src={item.image || "/placeholder.svg"}
                      alt={item.name}
                      width={300}
                      height={300}
                      className="w-full h-full object-cover transition-transform hover:scale-105"
                    />
                  </div>
                </Link>
                <div className="p-4">
                  <Link href={`/products/${item.id}`} className="hover:underline">
                    <h3 className="font-medium">{item.name}</h3>
                  </Link>
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{item.description}</p>
                  <div className="flex justify-between items-center mt-4">
                    <p className="font-bold">${item.price.toFixed(2)}</p>
                    <Button
                      size="sm"
                      onClick={() => {
                        addToCart({
                          id: item.id,
                          name: item.name,
                          price: item.price,
                          image: item.image,
                          quantity: 1,
                        })
                        toast({
                          title: "Added to cart",
                          description: `${item.name} has been added to your cart.`,
                        })
                      }}
                    >
                      Add to Cart
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
