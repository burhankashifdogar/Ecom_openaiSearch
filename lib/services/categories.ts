// Mock categories data
export const mockCategories = [
  {
    id: "1",
    name: "Electronics",
    slug: "electronics",
    description: "Electronic devices and gadgets",
    image: "/placeholder.svg?height=200&width=200",
  },
  {
    id: "2",
    name: "Clothing",
    slug: "clothing",
    description: "Fashion and apparel",
    image: "/placeholder.svg?height=200&width=200",
  },
  {
    id: "3",
    name: "Home & Kitchen",
    slug: "home-kitchen",
    description: "Home and kitchen products",
    image: "/placeholder.svg?height=200&width=200",
  },
  {
    id: "4",
    name: "Books",
    slug: "books",
    description: "Books and literature",
    image: "/placeholder.svg?height=200&width=200",
  },
  {
    id: "5",
    name: "Sports & Outdoors",
    slug: "sports-outdoors",
    description: "Sports equipment and outdoor gear",
    image: "/placeholder.svg?height=200&width=200",
  },
]

export type Category = {
  id: string
  name: string
  slug: string
  description: string
  image: string
}

// Get all categories
export async function getCategories(): Promise<Category[]> {
  console.warn("Using mock categories data")
  return mockCategories
}

// Get category by ID
export async function getCategoryById(id: string): Promise<Category | null> {
  console.warn("Using mock category data for ID:", id)
  return mockCategories.find((c) => c.id === id) || null
}

// Get category by slug
export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  console.warn("Using mock category data for slug:", slug)
  return mockCategories.find((c) => c.slug === slug) || null
}
