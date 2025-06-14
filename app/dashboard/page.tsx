import type { Metadata } from "next"
import DashboardHeader from "@/components/dashboard-header"
import DashboardShell from "@/components/dashboard-shell"
import DashboardCards from "@/components/dashboard-cards"
import { createServerClient } from "@/lib/supabase/server"
import SetupInstructions from "../setup-instructions"

export const metadata: Metadata = {
  title: "Dashboard | Exquisite Bakery Inventory System",
  description: "Overview of your bakery operations",
}

export default async function DashboardPage() {
  const supabase = createServerClient()
  const isConfigured = process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // Fetch summary data
  const { data: ingredientCount } = await supabase.from("ingredients").select("*", { count: "exact", head: true })

  const { data: recipeCount } = await supabase.from("recipes").select("*", { count: "exact", head: true })

  const { data: productionPlans } = await supabase.from("production_plans").select("*", { count: "exact", head: true })

  const { data: lowStockItems } = await supabase.from("ingredients").select("*").lt("current_stock", "min_stock")

  return (
    <DashboardShell>
      <DashboardHeader heading="Dashboard" text="Overview of your bakery inventory and production planning." />
      <DashboardCards
        ingredientCount={ingredientCount?.count || 0}
        recipeCount={recipeCount?.count || 0}
        productionPlansCount={productionPlans?.count || 0}
        lowStockCount={lowStockItems?.length || 0}
      />

      {!isConfigured && <SetupInstructions />}
    </DashboardShell>
  )
}
