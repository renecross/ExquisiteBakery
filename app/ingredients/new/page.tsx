import type { Metadata } from "next"
import DashboardHeader from "@/components/dashboard-header"
import DashboardShell from "@/components/dashboard-shell"
import { IngredientForm } from "@/components/ingredient-form"

export const metadata: Metadata = {
  title: "Add Ingredient | Exquisite Bakery Inventory System",
  description: "Add a new ingredient to your inventory",
}

export default function NewIngredientPage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Add Ingredient" text="Add a new ingredient to your inventory." />
      <div className="grid gap-8">
        <IngredientForm />
      </div>
    </DashboardShell>
  )
}
