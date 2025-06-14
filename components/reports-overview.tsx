"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"
import { FileText, Download, FileSpreadsheet, ArrowRight } from "lucide-react"
import Link from "next/link"

interface ProductionPlan {
  id: string
  name: string
  date: string
  status: string
}

interface ReportsOverviewProps {
  ingredientCount: number
  recipeCount: number
  completedPlansCount: number
  recentPlans: ProductionPlan[]
}

export function ReportsOverview({
  ingredientCount,
  recipeCount,
  completedPlansCount,
  recentPlans,
}: ReportsOverviewProps) {
  const { toast } = useToast()
  const [isExporting, setIsExporting] = useState(false)

  const handleExportToXero = async () => {
    setIsExporting(true)

    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1500))

      toast({
        title: "Export successful",
        description: "Data has been exported to Xero successfully.",
      })
    } catch (error) {
      toast({
        title: "Export failed",
        description: "There was a problem exporting data to Xero.",
        variant: "destructive",
      })
    } finally {
      setIsExporting(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-ZA", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

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

  return (
    <div className="grid gap-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inventory Report</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{ingredientCount}</div>
            <p className="text-xs text-muted-foreground">Ingredients in inventory</p>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" asChild>
              <Link href="/reports/inventory">
                Generate Report
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recipe Costing</CardTitle>
            <FileSpreadsheet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{recipeCount}</div>
            <p className="text-xs text-muted-foreground">Recipes with cost analysis</p>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" asChild>
              <Link href="/reports/recipes">
                Generate Report
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Production History</CardTitle>
            <Download className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedPlansCount}</div>
            <p className="text-xs text-muted-foreground">Completed production plans</p>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" asChild>
              <Link href="/reports/production">
                Generate Report
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Production Plans</CardTitle>
          <CardDescription>View and generate reports for recent production plans</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentPlans.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center">
                    No production plans found.
                  </TableCell>
                </TableRow>
              ) : (
                recentPlans.map((plan) => (
                  <TableRow key={plan.id}>
                    <TableCell className="font-medium">{plan.name}</TableCell>
                    <TableCell>{formatDate(plan.date)}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(plan.status)}>{plan.status}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/reports/production/${plan.id}`}>
                          <FileText className="mr-2 h-4 w-4" />
                          Report
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Xero Integration</CardTitle>
          <CardDescription>Export your production and inventory data to Xero</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-md bg-muted p-4">
            <div className="flex items-center space-x-4">
              <div className="rounded-full bg-background p-2">
                <FileSpreadsheet className="h-6 w-6" />
              </div>
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium leading-none">Export to Xero</p>
                <p className="text-sm text-muted-foreground">
                  Export your inventory, recipes, and production data to Xero for accounting purposes.
                </p>
              </div>
              <Button onClick={handleExportToXero} disabled={isExporting}>
                {isExporting ? "Exporting..." : "Export"}
              </Button>
            </div>
          </div>

          <div className="text-sm text-muted-foreground">
            <p>The Xero integration allows you to:</p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li>Export inventory valuation</li>
              <li>Create invoices for production plans</li>
              <li>Track ingredient purchases</li>
              <li>Generate profit and loss reports</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
