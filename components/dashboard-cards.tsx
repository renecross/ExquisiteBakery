import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CakeSlice, AlertTriangle, ShoppingCart, ClipboardList } from "lucide-react"
import Link from "next/link"

interface DashboardCardsProps {
  ingredientCount: number
  recipeCount: number
  productionPlansCount: number
  lowStockCount: number
}

export default function DashboardCards({
  ingredientCount,
  recipeCount,
  productionPlansCount,
  lowStockCount,
}: DashboardCardsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Link href="/ingredients">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Ingredients</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{ingredientCount}</div>
            <p className="text-xs text-muted-foreground">Ingredients in inventory</p>
          </CardContent>
        </Card>
      </Link>
      <Link href="/recipes">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Recipes</CardTitle>
            <CakeSlice className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{recipeCount}</div>
            <p className="text-xs text-muted-foreground">Recipes in the system</p>
          </CardContent>
        </Card>
      </Link>
      <Link href="/production">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Production Plans</CardTitle>
            <ClipboardList className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{productionPlansCount}</div>
            <p className="text-xs text-muted-foreground">Active production plans</p>
          </CardContent>
        </Card>
      </Link>
      <Link href="/ingredients?filter=low">
        <Card className={lowStockCount > 0 ? "border-red-200 bg-red-50" : ""}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock Alert</CardTitle>
            <AlertTriangle className={`h-4 w-4 ${lowStockCount > 0 ? "text-red-500" : "text-muted-foreground"}`} />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${lowStockCount > 0 ? "text-red-500" : ""}`}>{lowStockCount}</div>
            <p className="text-xs text-muted-foreground">Ingredients below minimum stock</p>
          </CardContent>
        </Card>
      </Link>
    </div>
  )
}
