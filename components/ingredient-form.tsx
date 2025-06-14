"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { createBrowserClient } from "@/lib/supabase/client"
import { useToast } from "@/components/ui/use-toast"

const ingredientFormSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  unit: z.string().min(1, {
    message: "Unit is required.",
  }),
  cost_per_unit: z.coerce.number().positive({
    message: "Cost must be a positive number.",
  }),
  current_stock: z.coerce.number().nonnegative({
    message: "Stock cannot be negative.",
  }),
  min_stock: z.coerce.number().nonnegative({
    message: "Minimum stock cannot be negative.",
  }),
})

type IngredientFormValues = z.infer<typeof ingredientFormSchema>

interface IngredientFormProps {
  ingredient?: {
    id: string
    name: string
    unit: string
    cost_per_unit: number
    current_stock: number
    min_stock: number
  }
}

export function IngredientForm({ ingredient }: IngredientFormProps = {}) {
  const router = useRouter()
  const { toast } = useToast()
  const supabase = createBrowserClient()
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<IngredientFormValues>({
    resolver: zodResolver(ingredientFormSchema),
    defaultValues: {
      name: ingredient?.name || "",
      unit: ingredient?.unit || "",
      cost_per_unit: ingredient?.cost_per_unit || 0,
      current_stock: ingredient?.current_stock || 0,
      min_stock: ingredient?.min_stock || 0,
    },
  })

  async function onSubmit(data: IngredientFormValues) {
    setIsLoading(true)

    try {
      if (ingredient) {
        // Update existing ingredient
        const { error } = await supabase
          .from("ingredients")
          .update({
            name: data.name,
            unit: data.unit,
            cost_per_unit: data.cost_per_unit,
            current_stock: data.current_stock,
            min_stock: data.min_stock,
            updated_at: new Date().toISOString(),
          })
          .eq("id", ingredient.id)

        if (error) throw error

        toast({
          title: "Ingredient updated",
          description: `${data.name} has been updated successfully.`,
        })
      } else {
        // Create new ingredient
        const { error } = await supabase.from("ingredients").insert({
          name: data.name,
          unit: data.unit,
          cost_per_unit: data.cost_per_unit,
          current_stock: data.current_stock,
          min_stock: data.min_stock,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })

        if (error) throw error

        toast({
          title: "Ingredient added",
          description: `${data.name} has been added to your inventory.`,
        })
      }

      router.push("/ingredients")
      router.refresh()
    } catch (error) {
      console.error("Error saving ingredient:", error)
      toast({
        title: "Error",
        description: "There was a problem saving the ingredient.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid gap-6 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Flour" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="unit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Unit</FormLabel>
                    <FormControl>
                      <Input placeholder="kg" {...field} />
                    </FormControl>
                    <FormDescription>The unit of measurement (kg, g, l, ml, etc.)</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid gap-6 sm:grid-cols-3">
              <FormField
                control={form.control}
                name="cost_per_unit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cost per Unit (ZAR)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="current_stock"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current Stock</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="min_stock"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Minimum Stock</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" {...field} />
                    </FormControl>
                    <FormDescription>Alert when stock falls below this level</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end space-x-4">
              <Button type="button" variant="outline" onClick={() => router.back()} disabled={isLoading}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Saving..." : ingredient ? "Update Ingredient" : "Add Ingredient"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
