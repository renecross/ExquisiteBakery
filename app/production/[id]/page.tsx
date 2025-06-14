import type { Metadata } from "next"
import { notFound } from "next/navigation"
import DashboardHeader from "@/components/dashboard-header"
import DashboardShell from "@/components/dashboard-shell"
import { createServerClient } from "@/lib/supabase/server"
import { ProductionPlanDetails } from "@/components/production-plan-details"
import { Button } from "@/components/ui/button"
import { ArrowLeft, FileText } from "lucide-react"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Production Plan Details | Exquisite Bakery Inventory System",
  description: "View production plan details and ingredient requirements",
}

export default async function ProductionPlanPage({
  params,
}: {
  params: { id: string }
}) {
  const supabase = createServerClient()

  // Fetch the production plan
  const { data: plan, error } = await supabase.from("production_plans").select("*").eq("id", params.id).single()

  if (error || !plan) {
    notFound()
  }

  // Fetch the production items with recipe details
  const { data: items } = await supabase
    .from("production_items")
    .select(`
      id,
      quantity,
      recipes (
        id,
        name,
        selling_price
      )
    `)
    .eq("production_plan_id", params.id)

  // Fetch all recipe ingredients for the recipes in this plan
  const recipeIds = items?.map((item) => item.recipes.id) || []

  const { data: recipeIngredients } = await supabase
    .from("recipe_ingredients")
    .select(`
      quantity,
      recipes (
        id,
        name
      ),
      ingredients (
        id,
        name,
        unit,
        cost_per_unit,
        current_stock
      )
    `)
    .in("recipe_id", recipeIds)

  // Calculate the required ingredients based on production quantities
  const requiredIngredients = new Map()

  items?.forEach((item) => {
    const recipeId = item.recipes.id
    const quantity = item.quantity

    recipeIngredients?.forEach((ri) => {
      if (ri.recipes.id === recipeId) {
        const ingredient = ri.ingredients
        const requiredQuantity = ri.quantity * quantity

        if (requiredIngredients.has(ingredient.id)) {
          requiredIngredients.get(ingredient.id).quantity += requiredQuantity
        } else {
          requiredIngredients.set(ingredient.id, {
            ...ingredient,
            quantity: requiredQuantity,
          })
        }
      }
    })
  })

  return (
    <DashboardShell>
      <DashboardHeader
        heading={plan.name}
        text={`Production plan for ${new Date(plan.date).toLocaleDateString("en-ZA", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}`}
      >
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href="/production">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Link>
          </Button>
          <Button asChild>
            <Link href={`/reports/production/${params.id}`}>
              <FileText className="mr-2 h-4 w-4" />
              Generate Report
            </Link>
          </Button>
        </div>
      </DashboardHeader>

      <ProductionPlanDetails
        plan={plan}
        items={
          items?.map((item) => ({
            id: item.id,
            recipe: {
              id: item.recipes.id,
              name: item.recipes.name,
              selling_price: item.recipes.selling_price,
            },
            quantity: item.quantity,
          })) || []
        }
        requiredIngredients={Array.from(requiredIngredients.values())}
      />
    </DashboardShell>
  )
}
