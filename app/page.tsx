import { ProductGrid } from "@/components/product-grid"
import { FeaturedProducts } from "@/components/featured-products"
import { Hero } from "@/components/hero"
import { SearchBar } from "@/components/search-bar"
import { Categories } from "@/components/categories"

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Hero />
      <div className="my-8">
        <SearchBar />
      </div>
      <Categories />
      <section className="my-12">
        <h2 className="text-3xl font-bold mb-6">Featured Products</h2>
        <FeaturedProducts />
      </section>
      <section className="my-12">
        <h2 className="text-3xl font-bold mb-6">New Arrivals</h2>
        <ProductGrid category="new-arrivals" />
      </section>
    </div>
  )
}
