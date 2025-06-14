import type { Metadata } from "next"
import { PlusCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import DashboardHeader from "@/components/dashboard-header"
import DashboardShell from "@/components/dashboard-shell"
import { createServerClient } from "@/lib/supabase/server"
import { RecipesTable } from "@/components/recipes-table"
import { formatCurrency } from "@/lib/utils"

export const metadata: Metadata = {
  title: "Recipes | Exquisite Bakery Inventory System",
  description: "Manage your bakery recipes",
}

export default async function RecipesPage() {
  const supabase = createServerClient()

  const { data: recipes, error } = await supabase.from("recipes").select("*").order("name")

  if (error) {
    console.error("Error fetching recipes:", error)
  }

  return (
    <DashboardShell>
      <DashboardHeader heading="Recipes" text="Manage your bakery recipes and formulations.">
        <div className="flex gap-2">
          <Button asChild>
            <a href="/recipes/new">
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Recipe
            </a>
          </Button>
          <Button variant="outline" asChild>
            <a href="/recipes/scan">Scan Recipe</a>
          </Button>
        </div>
      </DashboardHeader>

      <RecipesTable
        recipes={
          recipes?.map((recipe) => ({
            ...recipe,
            selling_price_formatted: formatCurrency(recipe.selling_price),
          })) || []
        }
      />
    </DashboardShell>
  )
}
