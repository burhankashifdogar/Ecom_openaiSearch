import Link from "next/link"
import { Shirt, Watch, Laptop, Home, Gift, Sparkles } from "lucide-react"

const categories = [
  {
    name: "Clothing",
    icon: Shirt,
    href: "/categories/clothing",
    color: "bg-pink-100 dark:bg-pink-900/20",
  },
  {
    name: "Accessories",
    icon: Watch,
    href: "/categories/accessories",
    color: "bg-blue-100 dark:bg-blue-900/20",
  },
  {
    name: "Electronics",
    icon: Laptop,
    href: "/categories/electronics",
    color: "bg-purple-100 dark:bg-purple-900/20",
  },
  {
    name: "Home & Living",
    icon: Home,
    href: "/categories/home-living",
    color: "bg-green-100 dark:bg-green-900/20",
  },
  {
    name: "Gifts",
    icon: Gift,
    href: "/categories/gifts",
    color: "bg-yellow-100 dark:bg-yellow-900/20",
  },
  {
    name: "New Arrivals",
    icon: Sparkles,
    href: "/categories/new-arrivals",
    color: "bg-orange-100 dark:bg-orange-900/20",
  },
]

export function Categories() {
  return (
    <section className="my-12">
      <h2 className="text-3xl font-bold mb-6">Shop by Category</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {categories.map((category) => (
          <Link
            key={category.name}
            href={category.href}
            className="flex flex-col items-center justify-center p-6 rounded-lg transition-colors hover:bg-muted"
          >
            <div className={`p-4 rounded-full ${category.color} mb-3`}>
              <category.icon className="h-6 w-6" />
            </div>
            <span className="text-sm font-medium">{category.name}</span>
          </Link>
        ))}
      </div>
    </section>
  )
}
