import type { Metadata } from "next"
import DashboardHeader from "@/components/dashboard-header"
import DashboardShell from "@/components/dashboard-shell"
import { ProductionPlanForm } from "@/components/production-plan-form"
import { createServerClient } from "@/lib/supabase/server"

export const metadata: Metadata = {
  title: "New Production Plan | Exquisite Bakery Inventory System",
  description: "Create a new production plan",
}

export default async function NewProductionPlanPage() {
  const supabase = createServerClient()

  const { data: recipes } = await supabase.from("recipes").select("*").order("name")

  return (
    <DashboardShell>
      <DashboardHeader heading="New Production Plan" text="Create a new production plan for your bakery." />
      <div className="grid gap-8">
        <ProductionPlanForm recipes={recipes || []} />
      </div>
    </DashboardShell>
  )
}
