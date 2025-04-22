import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle2, Users, ShoppingBag, Truck, HeadphonesIcon, Sparkles } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Hero Section */}
      <div className="flex flex-col md:flex-row items-center gap-12 mb-16">
        <div className="md:w-1/2">
          <h1 className="text-4xl font-bold mb-6">About IntelliBuy</h1>
          <p className="text-lg text-muted-foreground mb-6">
            IntelliBuy is revolutionizing online shopping with AI-powered recommendations and intelligent search
            capabilities. Our mission is to create a personalized shopping experience that helps you find exactly what
            you're looking for, even when you can't describe it perfectly.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button asChild>
              <Link href="/products">Shop Now</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
        <div className="md:w-1/2">
          <div className="relative aspect-video rounded-lg overflow-hidden">
            <Image src="/placeholder.svg?height=400&width=600" alt="IntelliBuy Team" fill className="object-cover" />
          </div>
        </div>
      </div>

      {/* Our Story */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-8">Our Story</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <p className="mb-4">
              Founded in 2023, IntelliBuy began with a simple idea: shopping online should be as intuitive as shopping
              with a knowledgeable friend who understands your preferences and can recommend exactly what you need.
            </p>
            <p className="mb-4">
              Our team of e-commerce experts and AI specialists came together to build a platform that learns from your
              browsing and purchasing behavior to create a truly personalized shopping experience.
            </p>
            <p>
              Today, IntelliBuy serves thousands of customers worldwide, offering a curated selection of high-quality
              products across multiple categories, all enhanced by our proprietary AI recommendation engine.
            </p>
          </div>
          <div className="relative aspect-square rounded-lg overflow-hidden">
            <Image src="/placeholder.svg?height=400&width=400" alt="IntelliBuy Office" fill className="object-cover" />
          </div>
        </div>
      </div>

      {/* Our Values */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-8">Our Values</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <div className="bg-primary/10 p-3 rounded-full mb-4">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">Customer First</h3>
                <p className="text-muted-foreground">
                  We prioritize our customers' needs and continuously improve our platform based on their feedback.
                </p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <div className="bg-primary/10 p-3 rounded-full mb-4">
                  <Sparkles className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">Innovation</h3>
                <p className="text-muted-foreground">
                  We embrace cutting-edge technology to create shopping experiences that are both efficient and
                  enjoyable.
                </p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <div className="bg-primary/10 p-3 rounded-full mb-4">
                  <CheckCircle2 className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">Quality</h3>
                <p className="text-muted-foreground">
                  We carefully select our products and partners to ensure we offer only the highest quality merchandise.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Why Choose Us */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-8">Why Choose IntelliBuy</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="flex flex-col items-center text-center">
            <div className="bg-primary/10 p-3 rounded-full mb-4">
              <Sparkles className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-bold mb-2">AI-Powered Recommendations</h3>
            <p className="text-muted-foreground">
              Our intelligent system learns your preferences to suggest products you'll love.
            </p>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="bg-primary/10 p-3 rounded-full mb-4">
              <ShoppingBag className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-bold mb-2">Curated Selection</h3>
            <p className="text-muted-foreground">
              We handpick quality products across categories to ensure satisfaction.
            </p>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="bg-primary/10 p-3 rounded-full mb-4">
              <Truck className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-bold mb-2">Fast & Reliable Shipping</h3>
            <p className="text-muted-foreground">Enjoy quick delivery with real-time tracking on all your orders.</p>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="bg-primary/10 p-3 rounded-full mb-4">
              <HeadphonesIcon className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-bold mb-2">24/7 Customer Support</h3>
            <p className="text-muted-foreground">
              Our dedicated team is always ready to assist with any questions or concerns.
            </p>
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-8">Meet Our Team</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { name: "Sarah Johnson", role: "CEO & Founder" },
            { name: "Michael Chen", role: "CTO" },
            { name: "Emma Williams", role: "Head of Product" },
            { name: "David Rodriguez", role: "Customer Experience Director" },
          ].map((member, index) => (
            <div key={index} className="flex flex-col items-center">
              <div className="w-32 h-32 rounded-full bg-muted mb-4 overflow-hidden">
                <Image
                  src={`/placeholder.svg?height=128&width=128&text=${member.name.charAt(0)}`}
                  alt={member.name}
                  width={128}
                  height={128}
                  className="object-cover"
                />
              </div>
              <h3 className="text-lg font-bold">{member.name}</h3>
              <p className="text-muted-foreground">{member.role}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-primary/10 rounded-lg p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Ready to Experience Smarter Shopping?</h2>
        <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
          Join thousands of satisfied customers who have discovered the perfect products for their needs with
          IntelliBuy.
        </p>
        <Button size="lg" asChild>
          <Link href="/products">Start Shopping Now</Link>
        </Button>
      </div>
    </div>
  )
}
