"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { formatCurrency } from "@/lib/utils"
import { CakeSlice } from "lucide-react"

interface ProductionPlan {
  id: string
  name: string
  date: string
  status: string
  notes: string
}

interface ProductionItem {
  id: string
  recipe: {
    id: string
    name: string
    selling_price: number
  }
  quantity: number
}

interface RequiredIngredient {
  id: string
  name: string
  unit: string
  cost_per_unit: number
  quantity: number
}

interface ProductionReportProps {
  plan: ProductionPlan
  items: ProductionItem[]
  requiredIngredients: RequiredIngredient[]
}

export function ProductionReport({ plan, items, requiredIngredients }: ProductionReportProps) {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "draft":
        return "bg-gray-100 text-gray-800"
      case "scheduled":
        return "bg-blue-100 text-blue-800"
      case "in progress":
        return "bg-yellow-100 text-yellow-800"
      case "completed":
        return "bg-green-100 text-green-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const totalValue = items.reduce((sum, item) => sum + item.recipe.selling_price * item.quantity, 0)

  const totalCost = requiredIngredients.reduce(
    (sum, ingredient) => sum + ingredient.cost_per_unit * ingredient.quantity,
    0,
  )

  const profitMargin = totalValue > 0 ? ((totalValue - totalCost) / totalValue) * 100 : 0

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-ZA", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <div className="space-y-8 print:space-y-6">
      <div className="flex items-center justify-between print:border-b print:pb-4">
        <div className="flex items-center gap-2">
          <CakeSlice className="h-10 w-10" />
          <div>
            <h2 className="text-2xl font-bold">Exquisite Bakery</h2>
            <p className="text-muted-foreground">Production Report</p>
          </div>
        </div>
        <div className="text-right">
          <p className="font-medium">Report Date: {new Date().toLocaleDateString("en-ZA")}</p>
          <p className="text-sm text-muted-foreground">Production Date: {formatDate(plan.date)}</p>
        </div>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>{plan.name}</CardTitle>
                <CardDescription>
                  Status: <Badge className={getStatusColor(plan.status)}>{plan.status}</Badge>
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {plan.notes && (
              <div className="mb-6">
                <h3 className="text-sm font-medium mb-2">Notes:</h3>
                <p className="text-sm text-muted-foreground">{plan.notes}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Total Value</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(totalValue)}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Total Cost</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(totalCost)}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Profit Margin</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{profitMargin.toFixed(1)}%</div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Production Items</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Recipe</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Unit Price</TableHead>
                  <TableHead>Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.recipe.name}</TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell>{formatCurrency(item.recipe.selling_price)}</TableCell>
                    <TableCell>{formatCurrency(item.recipe.selling_price * item.quantity)}</TableCell>
                  </TableRow>
                ))}
                <TableRow className="bg-muted/50">
                  <TableCell colSpan={3} className="font-medium text-right">
                    Total
                  </TableCell>
                  <TableCell className="font-bold">{formatCurrency(totalValue)}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Required Ingredients</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ingredient</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Unit Cost</TableHead>
                  <TableHead>Total Cost</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {requiredIngredients.map((ingredient) => (
                  <TableRow key={ingredient.id}>
                    <TableCell className="font-medium">{ingredient.name}</TableCell>
                    <TableCell>
                      {ingredient.quantity.toFixed(2)} {ingredient.unit}
                    </TableCell>
                    <TableCell>{formatCurrency(ingredient.cost_per_unit)}</TableCell>
                    <TableCell>{formatCurrency(ingredient.cost_per_unit * ingredient.quantity)}</TableCell>
                  </TableRow>
                ))}
                <TableRow className="bg-muted/50">
                  <TableCell colSpan={3} className="font-medium text-right">
                    Total Cost
                  </TableCell>
                  <TableCell className="font-bold">{formatCurrency(totalCost)}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Profit Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">Total Revenue</TableCell>
                  <TableCell className="text-right">{formatCurrency(totalValue)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Total Cost</TableCell>
                  <TableCell className="text-right">{formatCurrency(totalCost)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Gross Profit</TableCell>
                  <TableCell className="text-right">{formatCurrency(totalValue - totalCost)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Profit Margin</TableCell>
                  <TableCell className="text-right">{profitMargin.toFixed(1)}%</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <div className="text-center text-sm text-muted-foreground print:mt-8 print:pt-4 print:border-t">
        <p>Generated by Exquisite Bakery Inventory System</p>
        <p>Report ID: {plan.id}</p>
      </div>
    </div>
  )
}
