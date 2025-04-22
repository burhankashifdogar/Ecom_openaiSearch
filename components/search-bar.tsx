"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Search, Camera, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { ImageUpload } from "@/components/image-upload"

interface SearchBarProps {
  initialQuery?: string
}

export function SearchBar({ initialQuery = "" }: SearchBarProps) {
  const [query, setQuery] = useState(initialQuery)
  const [isImageSearchOpen, setIsImageSearchOpen] = useState(false)
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const router = useRouter()

  useEffect(() => {
    // Load recent searches from localStorage
    const savedSearches = localStorage.getItem("recentSearches")
    if (savedSearches) {
      try {
        setRecentSearches(JSON.parse(savedSearches))
      } catch (e) {
        console.error("Failed to parse recent searches", e)
        setRecentSearches([])
      }
    }
  }, [])

  useEffect(() => {
    // Update query when initialQuery changes (e.g., when navigating back to search page)
    if (initialQuery) {
      setQuery(initialQuery)
    }
  }, [initialQuery])

  const saveRecentSearch = (searchQuery: string) => {
    if (!searchQuery.trim()) return

    const updatedSearches = [searchQuery, ...recentSearches.filter((s) => s !== searchQuery)].slice(0, 5) // Keep only the 5 most recent searches

    setRecentSearches(updatedSearches)
    localStorage.setItem("recentSearches", JSON.stringify(updatedSearches))
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      saveRecentSearch(query.trim())
      router.push(`/search?q=${encodeURIComponent(query.trim())}`)
    }
  }

  const handleExampleClick = (exampleQuery: string) => {
    setQuery(exampleQuery)
    saveRecentSearch(exampleQuery)
    router.push(`/search?q=${encodeURIComponent(exampleQuery)}`)
  }

  const handleRecentSearchClick = (searchQuery: string) => {
    setQuery(searchQuery)
    router.push(`/search?q=${encodeURIComponent(searchQuery)}`)
  }

  const clearSearch = () => {
    setQuery("")
  }

  return (
    <div className="w-full max-w-3xl mx-auto">
      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search for products using natural language..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-10 pr-10 py-2 w-full"
          />
          {query && (
            <button
              type="button"
              onClick={clearSearch}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Clear search</span>
            </button>
          )}
        </div>
        <Dialog open={isImageSearchOpen} onOpenChange={setIsImageSearchOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="icon" type="button">
              <Camera className="h-4 w-4" />
              <span className="sr-only">Image Search</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <div className="space-y-4 py-2 pb-4">
              <div className="space-y-2">
                <h2 className="text-xl font-semibold tracking-tight">Image Search</h2>
                <p className="text-sm text-muted-foreground">
                  Upload an image to find similar products in our catalog.
                </p>
              </div>
              <ImageUpload onUpload={() => setIsImageSearchOpen(false)} />
            </div>
          </DialogContent>
        </Dialog>
        <Button type="submit">Search</Button>
      </form>

      <div className="mt-2 flex flex-wrap gap-2 text-sm">
        {recentSearches.length > 0 && (
          <div className="w-full mb-2">
            <p className="text-xs text-muted-foreground mb-1">Recent searches:</p>
            <div className="flex flex-wrap gap-2">
              {recentSearches.map((search, index) => (
                <button
                  key={index}
                  onClick={() => handleRecentSearchClick(search)}
                  className="text-primary hover:underline text-xs bg-muted px-2 py-1 rounded-md"
                >
                  {search}
                </button>
              ))}
            </div>
          </div>
        )}

        <span className="text-muted-foreground">Try:</span>
        <button
          onClick={() => handleExampleClick("Red dress under $50 with floral print")}
          className="text-primary hover:underline"
        >
          "Red dress under $50 with floral print"
        </button>
        <button
          onClick={() => handleExampleClick("Comfortable running shoes for men")}
          className="text-primary hover:underline"
        >
          "Comfortable running shoes for men"
        </button>
        <button
          onClick={() => handleExampleClick("Electronics between $30 and $150")}
          className="text-primary hover:underline"
        >
          "Electronics between $30 and $150"
        </button>
      </div>
    </div>
  )
}
