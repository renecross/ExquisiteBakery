import type { Metadata } from "next"
import { PlusCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import DashboardHeader from "@/components/dashboard-header"
import DashboardShell from "@/components/dashboard-shell"
import { createServerClient } from "@/lib/supabase/server"
import { ProductionPlansTable } from "@/components/production-plans-table"

export const metadata: Metadata = {
  title: "Production Plans | Exquisite Bakery Inventory System",
  description: "Manage your bakery production plans",
}

export default async function ProductionPlansPage() {
  const supabase = createServerClient()

  const { data: plans, error } = await supabase.from("production_plans").select("*").order("date", { ascending: false })

  if (error) {
    console.error("Error fetching production plans:", error)
  }

  return (
    <DashboardShell>
      <DashboardHeader heading="Production Plans" text="Create and manage your bakery production plans.">
        <Button asChild>
          <a href="/production/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            New Production Plan
          </a>
        </Button>
      </DashboardHeader>

      <ProductionPlansTable plans={plans || []} />
    </DashboardShell>
  )
}
