import type { Metadata } from "next"
import DashboardHeader from "@/components/dashboard-header"
import DashboardShell from "@/components/dashboard-shell"
import { RecipeScanner } from "@/components/recipe-scanner"
import { createServerClient } from "@/lib/supabase/server"

export const metadata: Metadata = {
  title: "Scan Recipe | Exquisite Bakery Inventory System",
  description: "Scan and import a recipe",
}

export default async function ScanRecipePage() {
  const supabase = createServerClient()

  const { data: ingredients } = await supabase.from("ingredients").select("*").order("name")

  return (
    <DashboardShell>
      <DashboardHeader
        heading="Scan Recipe"
        text="Scan or paste a recipe to automatically extract ingredients and instructions."
      />
      <div className="grid gap-8">
        <RecipeScanner ingredients={ingredients || []} />
      </div>
    </DashboardShell>
  )
}
