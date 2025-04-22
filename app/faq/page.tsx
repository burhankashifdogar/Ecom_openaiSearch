"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Search } from "lucide-react"

// FAQ data
const faqData = [
  {
    category: "Shopping & Orders",
    questions: [
      {
        question: "How do I place an order?",
        answer:
          "To place an order, browse our products, add items to your cart, and proceed to checkout. Follow the steps to enter your shipping and payment information, then confirm your order.",
      },
      {
        question: "What payment methods do you accept?",
        answer:
          "We accept credit/debit cards (Visa, Mastercard, American Express), PayPal, Apple Pay, and Google Pay. All transactions are secure and encrypted.",
      },
      {
        question: "How can I track my order?",
        answer:
          "Once your order ships, you'll receive a tracking number via email. You can also view your order status by logging into your account and visiting the 'Orders' section.",
      },
      {
        question: "What is your return policy?",
        answer:
          "We offer a 30-day return policy for most items. Products must be in original condition with tags attached. Some items like personalized products may not be eligible for returns.",
      },
    ],
  },
  {
    category: "Shipping & Delivery",
    questions: [
      {
        question: "How long will it take to receive my order?",
        answer:
          "Standard shipping typically takes 3-5 business days. Express shipping takes 1-2 business days. International shipping may take 7-14 business days depending on the destination.",
      },
      {
        question: "Do you ship internationally?",
        answer:
          "Yes, we ship to most countries worldwide. International shipping rates and delivery times vary by location.",
      },
      {
        question: "Is free shipping available?",
        answer: "We offer free standard shipping on orders over $50 within the continental United States.",
      },
      {
        question: "What if my package is damaged or lost?",
        answer:
          "Please contact our customer service team immediately if your package arrives damaged or doesn't arrive. We'll work with the shipping carrier to resolve the issue.",
      },
    ],
  },
  {
    category: "Account & Security",
    questions: [
      {
        question: "How do I create an account?",
        answer:
          "Click the 'Login' button in the top right corner, then select 'Create Account'. Fill in your details and follow the instructions to complete registration.",
      },
      {
        question: "How can I reset my password?",
        answer:
          "On the login page, click 'Forgot Password' and enter your email address. We'll send you a link to reset your password.",
      },
      {
        question: "Is my personal information secure?",
        answer:
          "Yes, we use industry-standard encryption and security measures to protect your personal and payment information. We never share your data with third parties without your consent.",
      },
      {
        question: "Can I update my account information?",
        answer:
          "Yes, log into your account and go to the 'Account Settings' section to update your personal information, shipping addresses, and payment methods.",
      },
    ],
  },
  {
    category: "Products & Features",
    questions: [
      {
        question: "How does the AI recommendation system work?",
        answer:
          "Our AI system analyzes your browsing history, past purchases, and preferences to suggest products you might like. The more you shop with us, the more personalized your recommendations become.",
      },
      {
        question: "Can I search for products using images?",
        answer:
          "Yes, our visual search feature allows you to upload an image and find similar products in our catalog. Look for the camera icon in the search bar.",
      },
      {
        question: "Are product reviews genuine?",
        answer:
          "Yes, all reviews are from verified purchasers. We never edit or remove reviews unless they violate our community guidelines.",
      },
      {
        question: "How can I save products for later?",
        answer:
          "Add items to your wishlist by clicking the heart icon on any product page. You'll need to be logged in to use this feature.",
      },
    ],
  },
]

export default function FAQPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredFAQs, setFilteredFAQs] = useState(faqData)

  // Handle search
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase()
    setSearchQuery(query)

    if (!query.trim()) {
      setFilteredFAQs(faqData)
      return
    }

    const filtered = faqData
      .map((category) => ({
        ...category,
        questions: category.questions.filter(
          (item) => item.question.toLowerCase().includes(query) || item.answer.toLowerCase().includes(query),
        ),
      }))
      .filter((category) => category.questions.length > 0)

    setFilteredFAQs(filtered)
  }

  return (
    <div className="container max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold mb-4">Frequently Asked Questions</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
          Find answers to common questions about shopping, shipping, returns, and more.
        </p>

        <div className="relative max-w-md mx-auto">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search for answers..."
            className="pl-10"
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>
      </div>

      {filteredFAQs.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium mb-2">No results found</h3>
          <p className="text-muted-foreground mb-6">
            We couldn't find any FAQs matching your search. Try different keywords or browse all categories.
          </p>
          <Button onClick={() => setSearchQuery("")}>Clear Search</Button>
        </div>
      ) : (
        <div className="space-y-8">
          {filteredFAQs.map((category, index) => (
            <div key={index}>
              <h2 className="text-xl font-semibold mb-4">{category.category}</h2>
              <Accordion type="single" collapsible className="w-full">
                {category.questions.map((item, qIndex) => (
                  <AccordionItem key={qIndex} value={`${index}-${qIndex}`}>
                    <AccordionTrigger className="text-left">{item.question}</AccordionTrigger>
                    <AccordionContent>
                      <p className="text-muted-foreground">{item.answer}</p>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          ))}
        </div>
      )}

      <div className="mt-12 pt-8 border-t border-border text-center">
        <h3 className="text-lg font-medium mb-4">Still have questions?</h3>
        <p className="text-muted-foreground mb-6">
          Our customer support team is here to help you with any questions you may have.
        </p>
        <Button asChild>
          <Link href="/contact">Contact Us</Link>
        </Button>
      </div>
    </div>
  )
}
