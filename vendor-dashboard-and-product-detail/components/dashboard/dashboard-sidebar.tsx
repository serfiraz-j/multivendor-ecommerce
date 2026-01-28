"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { User, Package, Heart, MapPin, ArrowLeft } from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  { href: "/dashboard", label: "Profile", icon: User },
  { href: "/dashboard/orders", label: "My Orders", icon: Package },
  { href: "/dashboard/addresses", label: "Addresses", icon: MapPin },
  { href: "/wishlist", label: "Wishlist", icon: Heart },
]

export function DashboardSidebar() {
  const pathname = usePathname()

  return (
    <aside className="flex h-full w-64 flex-col border-r border-border bg-sidebar">
      {/* Header */}
      <div className="flex h-16 items-center gap-2 border-b border-sidebar-border px-4">
        <User className="h-6 w-6 text-sidebar-primary" />
        <span className="font-semibold text-sidebar-foreground">My Account</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground",
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* Back to Shop */}
      <div className="border-t border-sidebar-border p-4">
        <Link
          href="/"
          className="flex items-center gap-2 text-sm text-sidebar-foreground/70 hover:text-sidebar-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Shop
        </Link>
      </div>
    </aside>
  )
}
