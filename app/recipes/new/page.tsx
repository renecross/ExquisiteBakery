import type { Metadata } from "next"
import DashboardHeader from "@/components/dashboard-header"
import DashboardShell from "@/components/dashboard-shell"
import { RecipeForm } from "@/components/recipe-form"
import { createServerClient } from "@/lib/supabase/server"

export const metadata: Metadata = {
  title: "Add Recipe | Exquisite Bakery Inventory System",
  description: "Add a new recipe to your collection",
}

export default async function NewRecipePage() {
  const supabase = createServerClient()

  const { data: ingredients } = await supabase.from("ingredients").select("*").order("name")

  return (
    <DashboardShell>
      <DashboardHeader heading="Add Recipe" text="Create a new recipe with ingredients and instructions." />
      <div className="grid gap-8">
        <RecipeForm ingredients={ingredients || []} />
      </div>
    </DashboardShell>
  )
}
