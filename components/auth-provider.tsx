"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"

type User = {
  id: string
  name: string
  email: string
  role: string
  isAdmin: boolean
}

type AuthContextType = {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  logout: () => void
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // For demo purposes, check if user data exists in localStorage
    const checkAuth = () => {
      try {
        const savedUser = localStorage.getItem("user")
        if (savedUser) {
          setUser(JSON.parse(savedUser))
        }
      } catch (error) {
        console.error("Authentication error:", error)
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  const login = async (email: string, password: string) => {
    setLoading(true)
    try {
      // For demo purposes, simulate a successful login
      // In a real app, this would be an API call to validate credentials

      // Simple validation
      if (!email.includes("@") || password.length < 6) {
        throw new Error("Invalid email or password")
      }

      // Determine if user is admin based on email
      const isAdmin = email.includes("admin")
      const role = isAdmin ? "admin" : "customer"

      // Create a mock user
      const userData: User = {
        id: "user-1",
        name: email.split("@")[0],
        email: email,
        role: role,
        isAdmin: isAdmin,
      }

      // Save to localStorage for persistence
      localStorage.setItem("user", JSON.stringify(userData))
      setUser(userData)
    } catch (error) {
      console.error("Login error:", error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const register = async (name: string, email: string, password: string) => {
    setLoading(true)
    try {
      // For demo purposes, simulate a successful registration
      // In a real app, this would be an API call to create a user

      // Simple validation
      if (!email.includes("@") || password.length < 6) {
        throw new Error("Invalid email or password")
      }

      // Determine if user is admin based on email
      const isAdmin = email.includes("admin")
      const role = isAdmin ? "admin" : "customer"

      // Create a mock user
      const userData: User = {
        id: "user-" + Date.now(),
        name: name,
        email: email,
        role: role,
        isAdmin: isAdmin,
      }

      // Save to localStorage for persistence
      localStorage.setItem("user", JSON.stringify(userData))
      setUser(userData)
    } catch (error) {
      console.error("Registration error:", error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    try {
      // Remove user from localStorage
      localStorage.removeItem("user")
      setUser(null)
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  return <AuthContext.Provider value={{ user, login, register, logout, loading }}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
