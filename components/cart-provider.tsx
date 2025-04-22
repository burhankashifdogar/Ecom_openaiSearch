"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { getCart, addItemToCart, removeItemFromCart, updateItemQuantity, clearCartItems } from "@/app/actions/cart"
import { useAuth } from "./auth-provider"

export type CartItem = {
  id: string
  name: string
  price: number
  image: string
  quantity: number
}

type CartContextType = {
  cart: {
    items: CartItem[]
    total: number
  }
  addToCart: (product: Omit<CartItem, "quantity">) => void
  removeFromCart: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  loading: boolean
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { user, loading: authLoading } = useAuth()
  const [cart, setCart] = useState<{ items: CartItem[]; total: number }>({
    items: [],
    total: 0,
  })
  const [loading, setLoading] = useState(true)

  // Load cart from server when user is authenticated
  useEffect(() => {
    if (authLoading) return

    if (user) {
      // User is authenticated, fetch cart from server
      fetchCart()
    } else {
      // User is not authenticated, load cart from localStorage
      const savedCart = localStorage.getItem("cart")
      if (savedCart) {
        try {
          const parsedCart = JSON.parse(savedCart)
          setCart(parsedCart)
        } catch (error) {
          console.error("Failed to parse cart from localStorage:", error)
        }
      }
      setLoading(false)
    }
  }, [user, authLoading])

  // Save cart to localStorage when it changes (for non-authenticated users)
  useEffect(() => {
    if (!user && !loading) {
      localStorage.setItem("cart", JSON.stringify(cart))
    }
  }, [cart, user, loading])

  const fetchCart = async () => {
    setLoading(true)
    try {
      const cartData = await getCart()
      setCart(cartData)
    } catch (error) {
      console.error("Failed to fetch cart:", error)
      // Fallback to empty cart if server action fails
      setCart({ items: [], total: 0 })
    } finally {
      setLoading(false)
    }
  }

  const calculateTotal = (items: CartItem[]) => {
    if (!items || !Array.isArray(items)) return 0
    return items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  }

  const addToCart = async (product: Omit<CartItem, "quantity">) => {
    if (user) {
      // User is authenticated, use server action
      setLoading(true)
      try {
        const updatedCart = await addItemToCart(product.id)
        setCart(updatedCart)
      } catch (error) {
        console.error("Failed to add item to cart:", error)
      } finally {
        setLoading(false)
      }
    } else {
      // User is not authenticated, use localStorage
      setCart((prevCart) => {
        const existingItemIndex = prevCart.items.findIndex((item) => item.id === product.id)

        let updatedItems

        if (existingItemIndex >= 0) {
          // If item already exists, increase quantity
          updatedItems = [...prevCart.items]
          updatedItems[existingItemIndex] = {
            ...updatedItems[existingItemIndex],
            quantity: updatedItems[existingItemIndex].quantity + 1,
          }
        } else {
          // If item doesn't exist, add it with quantity 1
          updatedItems = [...prevCart.items, { ...product, quantity: 1 }]
        }

        return {
          items: updatedItems,
          total: calculateTotal(updatedItems),
        }
      })
    }
  }

  const removeFromCart = async (productId: string) => {
    if (user) {
      // User is authenticated, use server action
      setLoading(true)
      try {
        const updatedCart = await removeItemFromCart(productId)
        setCart(updatedCart)
      } catch (error) {
        console.error("Failed to remove item from cart:", error)
      } finally {
        setLoading(false)
      }
    } else {
      // User is not authenticated, use localStorage
      setCart((prevCart) => {
        const updatedItems = prevCart.items.filter((item) => item.id !== productId)
        return {
          items: updatedItems,
          total: calculateTotal(updatedItems),
        }
      })
    }
  }

  const updateQuantity = async (productId: string, quantity: number) => {
    if (quantity < 1) return

    if (user) {
      // User is authenticated, use server action
      setLoading(true)
      try {
        const updatedCart = await updateItemQuantity(productId, quantity)
        setCart(updatedCart)
      } catch (error) {
        console.error("Failed to update item quantity:", error)
      } finally {
        setLoading(false)
      }
    } else {
      // User is not authenticated, use localStorage
      setCart((prevCart) => {
        const updatedItems = prevCart.items.map((item) => (item.id === productId ? { ...item, quantity } : item))
        return {
          items: updatedItems,
          total: calculateTotal(updatedItems),
        }
      })
    }
  }

  const clearCart = async () => {
    if (user) {
      // User is authenticated, use server action
      setLoading(true)
      try {
        const updatedCart = await clearCartItems()
        setCart(updatedCart)
      } catch (error) {
        console.error("Failed to clear cart:", error)
      } finally {
        setLoading(false)
      }
    } else {
      // User is not authenticated, use localStorage
      setCart({ items: [], total: 0 })
    }
  }

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, loading }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
