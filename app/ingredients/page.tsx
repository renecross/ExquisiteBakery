import type { Metadata } from "next"
import { PlusCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import DashboardHeader from "@/components/dashboard-header"
import DashboardShell from "@/components/dashboard-shell"
import { createServerClient } from "@/lib/supabase/server"
import { IngredientsTable } from "@/components/ingredients-table"
import { formatCurrency } from "@/lib/utils"

export const metadata: Metadata = {
  title: "Ingredients | Exquisite Bakery Inventory System",
  description: "Manage your bakery ingredients",
}

export default async function IngredientsPage({
  searchParams,
}: {
  searchParams: { filter?: string }
}) {
  const supabase = createServerClient()

  let query = supabase.from("ingredients").select("*")

  if (searchParams.filter === "low") {
    query = query.lt("current_stock", "min_stock")
  }

  const { data: ingredients, error } = await query.order("name")

  if (error) {
    console.error("Error fetching ingredients:", error)
  }

  return (
    <DashboardShell>
      <DashboardHeader heading="Ingredients" text="Manage your bakery ingredients and inventory.">
        <Button asChild>
          <a href="/ingredients/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Ingredient
          </a>
        </Button>
      </DashboardHeader>

      <IngredientsTable
        ingredients={
          ingredients?.map((ingredient) => ({
            ...ingredient,
            cost_per_unit_formatted: formatCurrency(ingredient.cost_per_unit),
          })) || []
        }
      />
    </DashboardShell>
  )
}
