"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, ShoppingBag, Users, Package, Settings, BarChart, LineChart } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

export function AdminSidebar() {
  const pathname = usePathname()

  const routes = [
    {
      href: "/admin",
      label: "Dashboard",
      icon: LayoutDashboard,
      active: pathname === "/admin",
    },
    {
      href: "/admin/analytics",
      label: "Analytics",
      icon: BarChart,
      active: pathname === "/admin/analytics",
    },
    {
      href: "/admin/advanced-analytics",
      label: "Advanced Analytics",
      icon: LineChart,
      active: pathname === "/admin/advanced-analytics",
    },
    {
      href: "/admin/products",
      label: "Products",
      icon: Package,
      active: pathname === "/admin/products",
    },
    {
      href: "/admin/orders",
      label: "Orders",
      icon: ShoppingBag,
      active: pathname === "/admin/orders",
    },
    {
      href: "/admin/users",
      label: "Users",
      icon: Users,
      active: pathname === "/admin/users",
    },
    {
      href: "/admin/settings",
      label: "Settings",
      icon: Settings,
      active: pathname === "/admin/settings",
    },
  ]

  return (
    <div className="space-y-1">
      {routes.map((route) => (
        <Button
          key={route.href}
          variant={route.active ? "secondary" : "ghost"}
          className={cn("w-full justify-start", route.active ? "bg-muted hover:bg-muted" : "")}
          asChild
        >
          <Link href={route.href}>
            <route.icon className="mr-2 h-5 w-5" />
            {route.label}
          </Link>
        </Button>
      ))}
    </div>
  )
}
