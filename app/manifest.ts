import type { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "IntelliBuy - AI-Enhanced Shopping Experience",
    short_name: "IntelliBuy",
    description: "Shop smarter with AI-powered recommendations and intelligent search",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#4f46e5",
    orientation: "portrait",
    icons: [
      {
        src: "/icons/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any maskable",
      },
      {
        src: "/icons/icon-384x384.png",
        sizes: "384x384",
        type: "image/png",
      },
      {
        src: "/icons/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: "/icons/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
        purpose: "apple touch icon",
      },
    ],
    screenshots: [
      {
        src: "/screenshots/mobile-home.png",
        sizes: "750x1334",
        type: "image/png",
        platform: "narrow",
        label: "Home screen of IntelliBuy",
      },
      {
        src: "/screenshots/mobile-product.png",
        sizes: "750x1334",
        type: "image/png",
        platform: "narrow",
        label: "Product page of IntelliBuy",
      },
      {
        src: "/screenshots/desktop-home.png",
        sizes: "1280x800",
        type: "image/png",
        platform: "wide",
        label: "Home screen of IntelliBuy",
      },
      {
        src: "/screenshots/desktop-product.png",
        sizes: "1280x800",
        type: "image/png",
        platform: "wide",
        label: "Product page of IntelliBuy",
      },
    ],
    related_applications: [
      {
        platform: "web",
      },
    ],
    prefer_related_applications: false,
    shortcuts: [
      {
        name: "Shop Now",
        url: "/shop",
        description: "Browse all products",
      },
      {
        name: "My Cart",
        url: "/cart",
        description: "View your shopping cart",
      },
      {
        name: "My Account",
        url: "/account",
        description: "Manage your account",
      },
    ],
  }
}
