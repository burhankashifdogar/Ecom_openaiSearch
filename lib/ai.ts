import { OpenAI } from "openai"

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

// Function to generate product recommendations
export async function generateRecommendations(
  productId: string,
  userHistory: string[] = [],
  limit = 4,
): Promise<any[]> {
  try {
    // If no OpenAI API key is provided, return mock recommendations
    if (!process.env.OPENAI_API_KEY) {
      return getMockRecommendations(productId, limit)
    }

    // Create a prompt for the AI
    const prompt = `
      Generate ${limit} product recommendations for a user viewing product ID: ${productId}.
      ${userHistory.length > 0 ? `The user has previously viewed: ${userHistory.join(", ")}.` : ""}
      
      Return the response as a JSON array with objects containing:
      - id: a unique product ID (string)
      - name: product name (string)
      - price: product price (number)
      - description: short product description (string)
      - category: product category (string)
      - image: leave as "/placeholder.svg" (string)
    `

    // Call OpenAI API
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a product recommendation system for an e-commerce platform called IntelliBuy.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      response_format: { type: "json_object" },
    })

    // Parse the response
    const content = response.choices[0].message.content
    if (!content) {
      throw new Error("No content in response")
    }

    const parsedContent = JSON.parse(content)
    return parsedContent.recommendations || []
  } catch (error) {
    console.error("Error generating AI recommendations:", error)
    return getMockRecommendations(productId, limit)
  }
}

// Function to analyze search query
export async function analyzeSearchQuery(query: string): Promise<{
  keywords: string[]
  categories: string[]
  priceRange?: { min?: number; max?: number }
  attributes: Record<string, string>
}> {
  try {
    // If no OpenAI API key is provided, use simple parsing
    if (!process.env.OPENAI_API_KEY) {
      return parseSearchQuery(query)
    }

    // Create a prompt for the AI
    const prompt = `
      Analyze this e-commerce search query: "${query}"
      
      Extract the following information and return as JSON:
      - keywords: array of important search terms
      - categories: array of product categories mentioned
      - priceRange: object with min and max price if mentioned
      - attributes: object with product attributes (color, size, brand, etc.)
    `

    // Call OpenAI API
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a search query analyzer for an e-commerce platform.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      response_format: { type: "json_object" },
    })

    // Parse the response
    const content = response.choices[0].message.content
    if (!content) {
      throw new Error("No content in response")
    }

    return JSON.parse(content)
  } catch (error) {
    console.error("Error analyzing search query with AI:", error)
    return parseSearchQuery(query)
  }
}

// Function to generate product description
export async function generateProductDescription(
  productName: string,
  category: string,
  features: string[],
): Promise<string> {
  try {
    // If no OpenAI API key is provided, return a template description
    if (!process.env.OPENAI_API_KEY) {
      return `${productName} is a high-quality ${category} product with multiple features including ${features.join(", ")}.`
    }

    // Create a prompt for the AI
    const prompt = `
      Generate a compelling product description for:
      Product Name: ${productName}
      Category: ${category}
      Features: ${features.join(", ")}
      
      The description should be engaging, highlight the key features, and be 2-3 sentences long.
    `

    // Call OpenAI API
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a product description writer for an e-commerce platform.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
    })

    // Return the response
    return response.choices[0].message.content || ""
  } catch (error) {
    console.error("Error generating product description:", error)
    return `${productName} is a high-quality ${category} product with multiple features including ${features.join(", ")}.`
  }
}

// Fallback function for search query parsing
function parseSearchQuery(query: string) {
  const lowercaseQuery = query.toLowerCase()

  // Extract potential price constraints
  const priceRange: { min?: number; max?: number } = {}
  const underPriceMatch = query.match(/under\s+\$?(\d+)/i)
  if (underPriceMatch) {
    priceRange.max = Number(underPriceMatch[1])
  }

  const overPriceMatch = query.match(/over\s+\$?(\d+)/i)
  if (overPriceMatch) {
    priceRange.min = Number(overPriceMatch[1])
  }

  const priceBetweenMatch = query.match(/between\s+\$?(\d+)\s+and\s+\$?(\d+)/i)
  if (priceBetweenMatch) {
    priceRange.min = Number(priceBetweenMatch[1])
    priceRange.max = Number(priceBetweenMatch[2])
  }

  // Extract categories
  const categories = []
  const commonCategories = ["electronics", "clothing", "shoes", "accessories", "home", "kitchen", "beauty", "sports"]
  for (const category of commonCategories) {
    if (lowercaseQuery.includes(category)) {
      categories.push(category)
    }
  }

  // Extract attributes
  const attributes: Record<string, string> = {}

  // Colors
  const colors = ["red", "blue", "green", "black", "white", "yellow", "purple", "pink", "orange", "brown", "gray"]
  for (const color of colors) {
    if (lowercaseQuery.includes(color)) {
      attributes.color = color
    }
  }

  // Sizes
  const sizeMatch = query.match(/size\s+([a-zA-Z0-9]+)/i)
  if (sizeMatch) {
    attributes.size = sizeMatch[1]
  }

  // Brands (simplified)
  const brandMatch = query.match(/brand\s+([a-zA-Z0-9]+)/i)
  if (brandMatch) {
    attributes.brand = brandMatch[1]
  }

  // Extract keywords (all words except common stop words)
  const stopWords = [
    "a",
    "an",
    "the",
    "in",
    "on",
    "at",
    "for",
    "with",
    "by",
    "to",
    "from",
    "of",
    "and",
    "or",
    "under",
    "over",
    "between",
  ]
  const keywords = lowercaseQuery
    .split(/\s+/)
    .filter((word) => !stopWords.includes(word) && word.length > 2)
    .filter((word) => !colors.includes(word) && !commonCategories.includes(word))

  return {
    keywords,
    categories,
    priceRange: Object.keys(priceRange).length > 0 ? priceRange : undefined,
    attributes,
  }
}

// Mock recommendations for fallback
function getMockRecommendations(productId: string, limit = 4) {
  const mockProducts = [
    {
      id: "1",
      name: "Wireless Bluetooth Headphones",
      price: 79.99,
      description: "Premium sound quality with noise cancellation technology.",
      category: "Electronics",
      image: "/placeholder.svg",
    },
    {
      id: "2",
      name: "Smart Fitness Watch",
      price: 129.99,
      description: "Track your fitness goals with heart rate monitoring and GPS.",
      category: "Electronics",
      image: "/placeholder.svg",
    },
    {
      id: "3",
      name: "Portable Bluetooth Speaker",
      price: 49.99,
      description: "Powerful sound in a compact, waterproof design.",
      category: "Electronics",
      image: "/placeholder.svg",
    },
    {
      id: "4",
      name: "Wireless Charging Pad",
      price: 29.99,
      description: "Fast wireless charging for all Qi-enabled devices.",
      category: "Electronics",
      image: "/placeholder.svg",
    },
    {
      id: "5",
      name: "Ultra-Slim Laptop",
      price: 899.99,
      description: "Powerful performance in a lightweight, portable design.",
      category: "Electronics",
      image: "/placeholder.svg",
    },
    {
      id: "6",
      name: "Designer Leather Wallet",
      price: 59.99,
      description: "Handcrafted genuine leather with RFID protection.",
      category: "Accessories",
      image: "/placeholder.svg",
    },
    {
      id: "7",
      name: "Premium Cotton T-Shirt",
      price: 24.99,
      description: "Soft, breathable fabric perfect for everyday wear.",
      category: "Clothing",
      image: "/placeholder.svg",
    },
    {
      id: "8",
      name: "Stainless Steel Water Bottle",
      price: 34.99,
      description: "Keeps drinks cold for 24 hours or hot for 12 hours.",
      category: "Home & Kitchen",
      image: "/placeholder.svg",
    },
  ]

  // Filter out the current product
  const filteredProducts = mockProducts.filter((product) => product.id !== productId)

  // Return random products up to the limit
  return filteredProducts.sort(() => 0.5 - Math.random()).slice(0, limit)
}
