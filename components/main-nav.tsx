"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { CakeSlice } from "lucide-react"

export function MainNav() {
  const pathname = usePathname()

  return (
    <div className="mr-4 flex">
      <Link href="/" className="mr-6 flex items-center space-x-2">
        <CakeSlice className="h-6 w-6" />
        <span className="hidden font-bold sm:inline-block">Exquisite Bakery</span>
      </Link>
      <nav className="flex items-center space-x-6 text-sm font-medium">
        <Link
          href="/dashboard"
          className={cn(
            "transition-colors hover:text-foreground/80",
            pathname === "/dashboard" ? "text-foreground" : "text-foreground/60",
          )}
        >
          Dashboard
        </Link>
        <Link
          href="/ingredients"
          className={cn(
            "transition-colors hover:text-foreground/80",
            pathname?.startsWith("/ingredients") ? "text-foreground" : "text-foreground/60",
          )}
        >
          Ingredients
        </Link>
        <Link
          href="/recipes"
          className={cn(
            "transition-colors hover:text-foreground/80",
            pathname?.startsWith("/recipes") ? "text-foreground" : "text-foreground/60",
          )}
        >
          Recipes
        </Link>
        <Link
          href="/production"
          className={cn(
            "transition-colors hover:text-foreground/80",
            pathname?.startsWith("/production") ? "text-foreground" : "text-foreground/60",
          )}
        >
          Production
        </Link>
        <Link
          href="/reports"
          className={cn(
            "transition-colors hover:text-foreground/80",
            pathname?.startsWith("/reports") ? "text-foreground" : "text-foreground/60",
          )}
        >
          Reports
        </Link>
      </nav>
    </div>
  )
}
