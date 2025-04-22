// Mock products data
export const mockProducts = [
  {
    id: "1",
    name: "Smartphone X",
    slug: "smartphone-x",
    description: "Latest smartphone with advanced features",
    price: 699.99,
    image: "/placeholder.svg?height=200&width=200",
    category: "Electronics",
    featured: true,
  },
  {
    id: "2",
    name: "Laptop Pro",
    slug: "laptop-pro",
    description: "High-performance laptop for professionals",
    price: 1299.99,
    image: "/placeholder.svg?height=200&width=200",
    category: "Electronics",
    featured: true,
  },
  {
    id: "3",
    name: "Wireless Earbuds",
    slug: "wireless-earbuds",
    description: "Premium wireless earbuds with noise cancellation",
    price: 149.99,
    image: "/placeholder.svg?height=200&width=200",
    category: "Electronics",
    featured: false,
  },
  {
    id: "4",
    name: "Smart Watch",
    slug: "smart-watch",
    description: "Fitness and health tracking smartwatch",
    price: 249.99,
    image: "/placeholder.svg?height=200&width=200",
    category: "Electronics",
    featured: true,
  },
  {
    id: "5",
    name: "Running Shoes",
    slug: "running-shoes",
    description: "Lightweight running shoes for athletes",
    price: 89.99,
    image: "/placeholder.svg?height=200&width=200",
    category: "Sports & Outdoors",
    featured: true,
  },
  {
    id: "6",
    name: "Coffee Maker",
    slug: "coffee-maker",
    description: "Automatic coffee maker for home use",
    price: 79.99,
    image: "/placeholder.svg?height=200&width=200",
    category: "Home & Kitchen",
    featured: false,
  },
  {
    id: "7",
    name: "Men's T-Shirt",
    slug: "mens-tshirt",
    description: "Comfortable cotton t-shirt for men",
    price: 24.99,
    image: "/placeholder.svg?height=200&width=200",
    category: "Clothing",
    featured: false,
  },
  {
    id: "8",
    name: "Women's Jeans",
    slug: "womens-jeans",
    description: "Stylish and comfortable jeans for women",
    price: 49.99,
    image: "/placeholder.svg?height=200&width=200",
    category: "Clothing",
    featured: false,
  },
]

export type Product = {
  id: string
  name: string
  slug: string
  description: string
  price: number
  salePrice?: number
  image: string
  category: string
  featured: boolean
}

// Get all products
export async function getProducts(): Promise<Product[]> {
  console.warn("Using mock products data")
  return mockProducts
}

// Get featured products
export async function getFeaturedProducts(): Promise<Product[]> {
  console.warn("Using mock featured products data")
  return mockProducts.filter((p) => p.featured)
}

// Get product by ID
export async function getProductById(id: string): Promise<Product | null> {
  console.warn("Using mock product data for ID:", id)
  return mockProducts.find((p) => p.id === id) || null
}

// Get product by slug
export async function getProductBySlug(slug: string): Promise<Product | null> {
  console.warn("Using mock product data for slug:", slug)
  return mockProducts.find((p) => p.slug === slug) || null
}

// Search products
export async function searchProducts(query: string): Promise<Product[]> {
  console.warn("Using mock product search for query:", query)
  const lowerQuery = query.toLowerCase()
  return mockProducts.filter(
    (p) =>
      p.name.toLowerCase().includes(lowerQuery) ||
      p.description.toLowerCase().includes(lowerQuery) ||
      p.category.toLowerCase().includes(lowerQuery),
  )
}

// Get products by category
export async function getProductsByCategory(category: string): Promise<Product[]> {
  console.warn("Using mock products for category:", category)
  return mockProducts.filter((p) => p.category.toLowerCase() === category.toLowerCase())
}

// Get related products
export async function getRelatedProducts(productId: string, limit: number): Promise<Product[]> {
  console.warn(`Using mock related products for product ID: ${productId} with limit: ${limit}`)
  const product = mockProducts.find((p) => p.id === productId)
  if (!product) {
    return []
  }

  // Filter out the current product and products from the same category
  const related = mockProducts.filter((p) => p.id !== productId && p.category === product.category).slice(0, limit)

  return related
}
