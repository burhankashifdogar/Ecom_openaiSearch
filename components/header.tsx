"use client"

import type React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ShoppingCart, User, Search, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { DarkModeToggle } from "@/components/dark-mode-toggle"
import { useAuth } from "@/components/auth-provider"
import { useCart } from "@/components/cart-provider"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

export default function Header() {
  const pathname = usePathname()
  const router = useRouter()
  const { user, isAdmin } = useAuth()
  const { cart } = useCart()
  const { items } = cart
  const [searchQuery, setSearchQuery] = useState("")
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
      setSearchQuery("")
    }
  }

  // Navigation links
  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/shop", label: "Shop" },
    { href: "/categories", label: "Categories" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
  ]

  // Admin links
  const adminLinks = [
    { href: "/admin", label: "Dashboard" },
    { href: "/admin/products", label: "Products" },
    { href: "/admin/orders", label: "Orders" },
    { href: "/admin/users", label: "Users" },
    { href: "/admin/analytics", label: "Analytics" },
    { href: "/admin/advanced-analytics", label: "Advanced Analytics" },
  ]

  // User links
  const userLinks = [
    { href: "/account", label: "My Account" },
    { href: "/orders", label: "My Orders" },
    { href: "/wishlist", label: "Wishlist" },
  ]

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-200 ${isScrolled ? "bg-background/95 backdrop-blur-sm shadow-sm" : "bg-background"}`}
    >
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold text-primary">IntelliBuy</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  pathname === link.href ? "text-primary" : "text-foreground/80"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Search, Cart, User, Theme */}
          <div className="flex items-center space-x-4">
            {/* Search Form - Desktop */}
            <form onSubmit={handleSearch} className="hidden md:flex relative">
              <Input
                type="search"
                placeholder="Search products..."
                className="w-[200px] lg:w-[300px]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button type="submit" size="icon" variant="ghost" className="absolute right-0 top-0 h-full">
                <Search className="h-4 w-4" />
              </Button>
            </form>

            {/* Dark Mode Toggle */}
            <DarkModeToggle />

            {/* Cart */}
            <Link href="/cart">
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart className="h-5 w-5" />
                {items && items.length > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground">
                    {items.length}
                  </span>
                )}
              </Button>
            </Link>

            {/* User Menu */}
            {user ? (
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <User className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <div className="py-4">
                    <h2 className="text-lg font-semibold mb-4">Hello, {user.name || user.email}</h2>
                    <div className="space-y-3">
                      {isAdmin && (
                        <>
                          <h3 className="text-sm font-medium text-muted-foreground">Admin</h3>
                          <div className="space-y-1">
                            {adminLinks.map((link) => (
                              <Link key={link.href} href={link.href} className="block py-1 text-sm hover:text-primary">
                                {link.label}
                              </Link>
                            ))}
                          </div>
                          <div className="my-2 h-px bg-border" />
                        </>
                      )}
                      <h3 className="text-sm font-medium text-muted-foreground">Account</h3>
                      <div className="space-y-1">
                        {userLinks.map((link) => (
                          <Link key={link.href} href={link.href} className="block py-1 text-sm hover:text-primary">
                            {link.label}
                          </Link>
                        ))}
                      </div>
                      <div className="my-2 h-px bg-border" />
                      <Button
                        variant="ghost"
                        className="w-full justify-start px-2 text-sm"
                        onClick={() => {
                          // Handle logout
                          window.location.href = "/login"
                        }}
                      >
                        Log out
                      </Button>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            ) : (
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  Log in
                </Button>
              </Link>
            )}

            {/* Mobile Menu Trigger */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left">
                <div className="py-4">
                  <Link href="/" className="flex items-center space-x-2 mb-6">
                    <span className="text-xl font-bold text-primary">IntelliBuy</span>
                  </Link>

                  {/* Mobile Search */}
                  <form onSubmit={handleSearch} className="mb-6">
                    <div className="relative">
                      <Input
                        type="search"
                        placeholder="Search products..."
                        className="w-full"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                      <Button
                        type="submit"
                        size="icon"
                        variant="ghost"
                        className="absolute right-0 top-0 h-full"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <Search className="h-4 w-4" />
                      </Button>
                    </div>
                  </form>

                  {/* Mobile Navigation */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium text-muted-foreground">Menu</h3>
                    <div className="space-y-1">
                      {navLinks.map((link) => (
                        <Link
                          key={link.href}
                          href={link.href}
                          className={`block py-1 text-sm hover:text-primary ${
                            pathname === link.href ? "text-primary font-medium" : ""
                          }`}
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          {link.label}
                        </Link>
                      ))}
                    </div>

                    {user && (
                      <>
                        <div className="my-2 h-px bg-border" />
                        <h3 className="text-sm font-medium text-muted-foreground">Account</h3>
                        <div className="space-y-1">
                          {userLinks.map((link) => (
                            <Link
                              key={link.href}
                              href={link.href}
                              className="block py-1 text-sm hover:text-primary"
                              onClick={() => setIsMobileMenuOpen(false)}
                            >
                              {link.label}
                            </Link>
                          ))}
                        </div>

                        {isAdmin && (
                          <>
                            <div className="my-2 h-px bg-border" />
                            <h3 className="text-sm font-medium text-muted-foreground">Admin</h3>
                            <div className="space-y-1">
                              {adminLinks.map((link) => (
                                <Link
                                  key={link.href}
                                  href={link.href}
                                  className="block py-1 text-sm hover:text-primary"
                                  onClick={() => setIsMobileMenuOpen(false)}
                                >
                                  {link.label}
                                </Link>
                              ))}
                            </div>
                          </>
                        )}

                        <div className="my-2 h-px bg-border" />
                        <Button
                          variant="ghost"
                          className="w-full justify-start px-2 text-sm"
                          onClick={() => {
                            setIsMobileMenuOpen(false)
                            // Handle logout
                            window.location.href = "/login"
                          }}
                        >
                          Log out
                        </Button>
                      </>
                    )}

                    {!user && (
                      <>
                        <div className="my-2 h-px bg-border" />
                        <div className="flex space-x-2">
                          <Button
                            variant="default"
                            className="w-full"
                            onClick={() => {
                              setIsMobileMenuOpen(false)
                              router.push("/login")
                            }}
                          >
                            Log in
                          </Button>
                          <Button
                            variant="outline"
                            className="w-full"
                            onClick={() => {
                              setIsMobileMenuOpen(false)
                              router.push("/login?signup=true")
                            }}
                          >
                            Sign up
                          </Button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  )
}
