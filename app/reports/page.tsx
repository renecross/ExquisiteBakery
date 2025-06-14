import type { Metadata } from "next"
import DashboardHeader from "@/components/dashboard-header"
import DashboardShell from "@/components/dashboard-shell"
import { ReportsOverview } from "@/components/reports-overview"
import { createServerClient } from "@/lib/supabase/server"

export const metadata: Metadata = {
  title: "Reports | Exquisite Bakery Inventory System",
  description: "Generate reports and export data to Xero",
}

export default async function ReportsPage() {
  const supabase = createServerClient()

  // Get counts for summary cards
  const { data: ingredientCount } = await supabase.from("ingredients").select("*", { count: "exact", head: true })

  const { data: recipeCount } = await supabase.from("recipes").select("*", { count: "exact", head: true })

  const { data: productionPlans } = await supabase
    .from("production_plans")
    .select("*", { count: "exact", head: true })
    .eq("status", "completed")

  // Get recent production plans
  const { data: recentPlans } = await supabase
    .from("production_plans")
    .select("*")
    .order("date", { ascending: false })
    .limit(5)

  return (
    <DashboardShell>
      <DashboardHeader heading="Reports" text="Generate reports and export data to Xero." />

      <ReportsOverview
        ingredientCount={ingredientCount?.count || 0}
        recipeCount={recipeCount?.count || 0}
        completedPlansCount={productionPlans?.count || 0}
        recentPlans={recentPlans || []}
      />
    </DashboardShell>
  )
}
