import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import {
  Shirt,
  Watch,
  Laptop,
  Home,
  Gift,
  Sparkles,
  Headphones,
  Smartphone,
  BookOpen,
  Utensils,
  Dumbbell,
  Baby,
} from "lucide-react"

const categories = [
  {
    name: "Clothing",
    icon: Shirt,
    href: "/categories/clothing",
    color: "bg-pink-100 dark:bg-pink-900/20",
    description: "Fashion for every style and occasion",
    count: 128,
  },
  {
    name: "Accessories",
    icon: Watch,
    href: "/categories/accessories",
    color: "bg-blue-100 dark:bg-blue-900/20",
    description: "Complete your look with the perfect accessories",
    count: 94,
  },
  {
    name: "Electronics",
    icon: Laptop,
    href: "/categories/electronics",
    color: "bg-purple-100 dark:bg-purple-900/20",
    description: "The latest gadgets and tech innovations",
    count: 156,
  },
  {
    name: "Home & Living",
    icon: Home,
    href: "/categories/home-living",
    color: "bg-green-100 dark:bg-green-900/20",
    description: "Everything you need for a stylish, comfortable home",
    count: 112,
  },
  {
    name: "Gifts",
    icon: Gift,
    href: "/categories/gifts",
    color: "bg-yellow-100 dark:bg-yellow-900/20",
    description: "Perfect presents for every occasion",
    count: 78,
  },
  {
    name: "New Arrivals",
    icon: Sparkles,
    href: "/categories/new-arrivals",
    color: "bg-orange-100 dark:bg-orange-900/20",
    description: "The latest additions to our collection",
    count: 45,
  },
  {
    name: "Audio",
    icon: Headphones,
    href: "/categories/audio",
    color: "bg-red-100 dark:bg-red-900/20",
    description: "Premium sound experiences for music lovers",
    count: 67,
  },
  {
    name: "Mobile",
    icon: Smartphone,
    href: "/categories/mobile",
    color: "bg-indigo-100 dark:bg-indigo-900/20",
    description: "Smartphones and accessories for staying connected",
    count: 89,
  },
  {
    name: "Books",
    icon: BookOpen,
    href: "/categories/books",
    color: "bg-teal-100 dark:bg-teal-900/20",
    description: "Bestsellers, new releases, and timeless classics",
    count: 134,
  },
  {
    name: "Kitchen",
    icon: Utensils,
    href: "/categories/kitchen",
    color: "bg-cyan-100 dark:bg-cyan-900/20",
    description: "Cookware and appliances for culinary enthusiasts",
    count: 92,
  },
  {
    name: "Fitness",
    icon: Dumbbell,
    href: "/categories/fitness",
    color: "bg-lime-100 dark:bg-lime-900/20",
    description: "Equipment and gear for your workout routine",
    count: 76,
  },
  {
    name: "Kids",
    icon: Baby,
    href: "/categories/kids",
    color: "bg-amber-100 dark:bg-amber-900/20",
    description: "Toys, clothing, and accessories for children",
    count: 108,
  },
]

export default function CategoriesPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Shop by Category</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Browse our wide selection of products organized by category to find exactly what you're looking for.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {categories.map((category) => (
          <Link key={category.name} href={category.href}>
            <Card className="h-full transition-all hover:shadow-md">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className={`p-4 rounded-full ${category.color} mb-4`}>
                  <category.icon className="h-6 w-6" />
                </div>
                <h3 className="font-medium text-lg mb-2">{category.name}</h3>
                <p className="text-sm text-muted-foreground mb-4">{category.description}</p>
                <span className="text-xs bg-muted px-2 py-1 rounded-full">{category.count} products</span>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="mt-16">
        <h2 className="text-2xl font-bold mb-6">Featured Collections</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="overflow-hidden">
            <div className="relative h-48">
              <img
                src="/placeholder.svg?height=200&width=400&text=Summer"
                alt="Summer Collection"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                <div className="text-white">
                  <h3 className="font-bold text-xl">Summer Collection</h3>
                  <p className="text-sm opacity-90">Stay cool with our summer essentials</p>
                </div>
              </div>
            </div>
          </Card>
          <Card className="overflow-hidden">
            <div className="relative h-48">
              <img
                src="/placeholder.svg?height=200&width=400&text=Tech"
                alt="Tech Gadgets"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                <div className="text-white">
                  <h3 className="font-bold text-xl">Tech Gadgets</h3>
                  <p className="text-sm opacity-90">The latest innovations at your fingertips</p>
                </div>
              </div>
            </div>
          </Card>
          <Card className="overflow-hidden">
            <div className="relative h-48">
              <img
                src="/placeholder.svg?height=200&width=400&text=Home"
                alt="Home Decor"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                <div className="text-white">
                  <h3 className="font-bold text-xl">Home Decor</h3>
                  <p className="text-sm opacity-90">Transform your space with stylish accents</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
