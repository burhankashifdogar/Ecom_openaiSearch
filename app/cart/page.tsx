"use client"

import { useState } from "react"
import Link from "next/link"
import { Trash2, ShoppingBag, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { useCart } from "@/components/cart-provider"
import { useToast } from "@/hooks/use-toast"

export default function CartPage() {
  const { cart, updateQuantity, removeFromCart, clearCart } = useCart()
  const { toast } = useToast()
  const [promoCode, setPromoCode] = useState("")
  const [isApplyingPromo, setIsApplyingPromo] = useState(false)

  const handleQuantityChange = (id: string, quantity: number) => {
    if (quantity < 1) return
    updateQuantity(id, quantity)
  }

  const handleRemoveItem = (id: string, name: string) => {
    removeFromCart(id)
    toast({
      title: "Item removed",
      description: `${name} has been removed from your cart.`,
    })
  }

  const handleApplyPromoCode = () => {
    if (!promoCode.trim()) return

    setIsApplyingPromo(true)

    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Invalid promo code",
        description: "The promo code you entered is invalid or has expired.",
        variant: "destructive",
      })
      setIsApplyingPromo(false)
    }, 1000)
  }

  const handleCheckout = () => {
    // In a real app, this would navigate to the checkout page
    toast({
      title: "Proceeding to checkout",
      description: "This would navigate to the checkout page in a real app.",
    })
  }

  if (cart.items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-md mx-auto">
          <ShoppingBag className="h-16 w-16 mx-auto mb-6 text-muted-foreground" />
          <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
          <p className="text-muted-foreground mb-8">Looks like you haven't added any products to your cart yet.</p>
          <Button asChild size="lg">
            <Link href="/shop">Start Shopping</Link>
          </Button>
        </div>
      </div>
    )
  }

  // Calculate cart summary
  const subtotal = cart.total
  const shipping = subtotal > 50 ? 0 : 5.99
  const tax = subtotal * 0.08 // 8% tax rate
  const total = subtotal + shipping + tax

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Cart Items */}
        <div className="lg:w-2/3">
          <div className="bg-background rounded-lg border p-6">
            <div className="hidden md:grid md:grid-cols-6 gap-4 mb-4 text-sm font-medium text-muted-foreground">
              <div className="col-span-3">Product</div>
              <div className="text-center">Price</div>
              <div className="text-center">Quantity</div>
              <div className="text-right">Total</div>
            </div>

            <Separator className="mb-6 hidden md:block" />

            {cart.items.map((item) => (
              <div key={item.id} className="mb-6">
                <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-center">
                  <div className="col-span-1 md:col-span-3 flex items-center gap-4">
                    <div className="h-20 w-20 bg-muted rounded-md overflow-hidden">
                      <img
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div>
                      <Link href={`/products/${item.id}`} className="font-medium hover:underline">
                        {item.name}
                      </Link>
                      <button
                        onClick={() => handleRemoveItem(item.id, item.name)}
                        className="flex items-center text-sm text-muted-foreground hover:text-destructive mt-1"
                      >
                        <Trash2 className="h-3 w-3 mr-1" />
                        Remove
                      </button>
                    </div>
                  </div>

                  <div className="md:text-center">
                    <div className="md:hidden text-sm text-muted-foreground mb-1">Price:</div>${item.price.toFixed(2)}
                  </div>

                  <div className="md:text-center">
                    <div className="md:hidden text-sm text-muted-foreground mb-1">Quantity:</div>
                    <div className="flex items-center md:justify-center">
                      <button
                        className="h-8 w-8 border rounded-l-md flex items-center justify-center"
                        onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                      >
                        -
                      </button>
                      <div className="h-8 w-12 border-t border-b flex items-center justify-center">{item.quantity}</div>
                      <button
                        className="h-8 w-8 border rounded-r-md flex items-center justify-center"
                        onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="md:text-right font-medium">
                    <div className="md:hidden text-sm text-muted-foreground mb-1">Total:</div>$
                    {(item.price * item.quantity).toFixed(2)}
                  </div>
                </div>

                {cart.items.indexOf(item) < cart.items.length - 1 && <Separator className="my-6" />}
              </div>
            ))}

            <div className="flex justify-between items-center mt-6">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  clearCart()
                  toast({
                    title: "Cart cleared",
                    description: "All items have been removed from your cart.",
                  })
                }}
              >
                Clear Cart
              </Button>

              <Button asChild variant="outline" size="sm">
                <Link href="/products">Continue Shopping</Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:w-1/3">
          <div className="bg-background rounded-lg border p-6 sticky top-20">
            <h2 className="text-xl font-bold mb-4">Order Summary</h2>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span>{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tax</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-bold">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex gap-2">
                  <Input placeholder="Promo code" value={promoCode} onChange={(e) => setPromoCode(e.target.value)} />
                  <Button
                    variant="outline"
                    onClick={handleApplyPromoCode}
                    disabled={isApplyingPromo || !promoCode.trim()}
                  >
                    {isApplyingPromo ? "Applying..." : "Apply"}
                  </Button>
                </div>
              </div>

              <Button className="w-full" size="lg" onClick={handleCheckout}>
                Checkout
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>

              <p className="text-xs text-muted-foreground text-center">Shipping and taxes calculated at checkout.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
