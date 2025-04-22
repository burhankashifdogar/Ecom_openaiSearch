"use server"

import { cookies } from "next/headers"

// Types
export type CartItem = {
  id: string
  name: string
  price: number
  image: string
  quantity: number
}

type Cart = {
  items: CartItem[]
  total: number
}

// Mock cart data
const mockCartItems: CartItem[] = [
  {
    id: "1",
    name: "Smartphone X",
    price: 699.99,
    image: "/placeholder.svg?height=200&width=200",
    quantity: 1,
  },
  {
    id: "2",
    name: "Wireless Earbuds",
    price: 149.99,
    image: "/placeholder.svg?height=200&width=200",
    quantity: 2,
  },
]

// Helper function to calculate cart total
function calculateTotal(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0)
}

// Get cart for authenticated user
export async function getCart(): Promise<Cart> {
  try {
    // For development, return mock data
    return {
      items: mockCartItems,
      total: calculateTotal(mockCartItems),
    }
  } catch (error) {
    console.error("Error fetching cart:", error)
    return {
      items: mockCartItems,
      total: calculateTotal(mockCartItems),
    }
  }
}

// Add item to cart
export async function addItemToCart(productId: string): Promise<Cart> {
  try {
    // For development, update mock data
    const updatedMockItems = [...mockCartItems]
    const existingItemIndex = updatedMockItems.findIndex((item) => item.id === productId)

    if (existingItemIndex >= 0) {
      updatedMockItems[existingItemIndex].quantity += 1
    } else {
      updatedMockItems.push({
        id: productId,
        name: `Product ${productId}`,
        price: 99.99,
        image: "/placeholder.svg?height=200&width=200",
        quantity: 1,
      })
    }

    // Update the global mock items for persistence during the session
    mockCartItems.length = 0
    mockCartItems.push(...updatedMockItems)

    return {
      items: updatedMockItems,
      total: calculateTotal(updatedMockItems),
    }
  } catch (error) {
    console.error("Error adding item to cart:", error)
    return getCart()
  }
}

// Remove item from cart
export async function removeItemFromCart(productId: string): Promise<Cart> {
  try {
    // For development, update mock data
    const updatedMockItems = mockCartItems.filter((item) => item.id !== productId)

    // Update the global mock items for persistence during the session
    mockCartItems.length = 0
    mockCartItems.push(...updatedMockItems)

    return {
      items: updatedMockItems,
      total: calculateTotal(updatedMockItems),
    }
  } catch (error) {
    console.error("Error removing item from cart:", error)
    return getCart()
  }
}

// Update item quantity
export async function updateItemQuantity(productId: string, quantity: number): Promise<Cart> {
  try {
    // For development, update mock data
    const updatedMockItems = [...mockCartItems]
    const existingItemIndex = updatedMockItems.findIndex((item) => item.id === productId)

    if (existingItemIndex >= 0) {
      if (quantity <= 0) {
        updatedMockItems.splice(existingItemIndex, 1)
      } else {
        updatedMockItems[existingItemIndex].quantity = quantity
      }
    }

    // Update the global mock items for persistence during the session
    mockCartItems.length = 0
    mockCartItems.push(...updatedMockItems)

    return {
      items: updatedMockItems,
      total: calculateTotal(updatedMockItems),
    }
  } catch (error) {
    console.error("Error updating item quantity:", error)
    return getCart()
  }
}

// Clear cart
export async function clearCartItems(): Promise<Cart> {
  try {
    // For development, clear mock data
    mockCartItems.length = 0

    return { items: [], total: 0 }
  } catch (error) {
    console.error("Error clearing cart:", error)
    return { items: [], total: 0 }
  }
}

// Helper function to get user ID from session (not used in mock implementation)
function getUserIdFromSession(): number | null {
  try {
    const sessionCookie = cookies().get("session")

    if (!sessionCookie?.value) {
      return null
    }

    const session = JSON.parse(sessionCookie.value)
    return session.userId || null
  } catch (error) {
    console.error("Error getting user ID from session:", error)
    return null
  }
}
