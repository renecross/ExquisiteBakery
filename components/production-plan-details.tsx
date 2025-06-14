"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { formatCurrency } from "@/lib/utils"
import { AlertTriangle } from "lucide-react"

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
  current_stock: number
  quantity: number
}

interface ProductionPlanDetailsProps {
  plan: ProductionPlan
  items: ProductionItem[]
  requiredIngredients: RequiredIngredient[]
}

export function ProductionPlanDetails({ plan, items, requiredIngredients }: ProductionPlanDetailsProps) {
  const [activeTab, setActiveTab] = useState("items")

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

  return (
    <div className="grid gap-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalValue)}</div>
            <p className="text-xs text-muted-foreground">Total selling price of all items</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Cost</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalCost)}</div>
            <p className="text-xs text-muted-foreground">Cost of all required ingredients</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Profit</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalValue - totalCost)}</div>
            <p className="text-xs text-muted-foreground">Expected profit from this plan</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Profit Margin</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{profitMargin.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">Percentage profit on total value</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Production Plan Details</CardTitle>
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

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="items">Production Items</TabsTrigger>
              <TabsTrigger value="ingredients">Required Ingredients</TabsTrigger>
            </TabsList>
            <TabsContent value="items" className="pt-4">
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
                  {items.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="h-24 text-center">
                        No items in this production plan.
                      </TableCell>
                    </TableRow>
                  ) : (
                    items.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.recipe.name}</TableCell>
                        <TableCell>{item.quantity}</TableCell>
                        <TableCell>{formatCurrency(item.recipe.selling_price)}</TableCell>
                        <TableCell>{formatCurrency(item.recipe.selling_price * item.quantity)}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TabsContent>
            <TabsContent value="ingredients" className="pt-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Ingredient</TableHead>
                    <TableHead>Required</TableHead>
                    <TableHead>In Stock</TableHead>
                    <TableHead>Unit Cost</TableHead>
                    <TableHead>Total Cost</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {requiredIngredients.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="h-24 text-center">
                        No ingredients required for this plan.
                      </TableCell>
                    </TableRow>
                  ) : (
                    requiredIngredients.map((ingredient) => (
                      <TableRow
                        key={ingredient.id}
                        className={ingredient.quantity > ingredient.current_stock ? "bg-red-50" : ""}
                      >
                        <TableCell className="font-medium">{ingredient.name}</TableCell>
                        <TableCell>
                          {ingredient.quantity.toFixed(2)} {ingredient.unit}
                          {ingredient.quantity > ingredient.current_stock && (
                            <AlertTriangle className="inline ml-2 h-4 w-4 text-red-500" />
                          )}
                        </TableCell>
                        <TableCell className={ingredient.quantity > ingredient.current_stock ? "text-red-500" : ""}>
                          {ingredient.current_stock.toFixed(2)} {ingredient.unit}
                        </TableCell>
                        <TableCell>{formatCurrency(ingredient.cost_per_unit)}</TableCell>
                        <TableCell>{formatCurrency(ingredient.cost_per_unit * ingredient.quantity)}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
