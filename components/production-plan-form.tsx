"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useFieldArray, useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { createBrowserClient } from "@/lib/supabase/client"
import { useToast } from "@/components/ui/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Trash2 } from "lucide-react"
import { formatCurrency } from "@/lib/utils"
import { CalendarIcon } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { format } from "date-fns"

const productionItemSchema = z.object({
  recipe_id: z.string().min(1, "Please select a recipe"),
  quantity: z.coerce.number().positive("Quantity must be positive"),
})

const productionPlanFormSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  date: z.date({
    required_error: "Please select a date.",
  }),
  status: z.string().min(1, "Please select a status"),
  notes: z.string().optional(),
  items: z.array(productionItemSchema).min(1, "Add at least one item"),
})

type ProductionPlanFormValues = z.infer<typeof productionPlanFormSchema>

interface Recipe {
  id: string
  name: string
  selling_price: number
}

interface ProductionPlanFormProps {
  plan?: {
    id: string
    name: string
    date: string
    status: string
    notes: string
  }
  planItems?: {
    recipe_id: string
    quantity: number
  }[]
  recipes: Recipe[]
}

export function ProductionPlanForm({ plan, planItems = [], recipes }: ProductionPlanFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const supabase = createBrowserClient()
  const [isLoading, setIsLoading] = useState(false)
  const [totalValue, setTotalValue] = useState(0)

  const form = useForm<ProductionPlanFormValues>({
    resolver: zodResolver(productionPlanFormSchema),
    defaultValues: {
      name: plan?.name || "",
      date: plan ? new Date(plan.date) : new Date(),
      status: plan?.status || "draft",
      notes: plan?.notes || "",
      items: planItems.length > 0 ? planItems : [{ recipe_id: "", quantity: 1 }],
    },
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  })

  // Calculate total value whenever items change
  const calculateTotalValue = (formValues: ProductionPlanFormValues) => {
    let value = 0
    formValues.items.forEach((item) => {
      const recipe = recipes.find((r) => r.id === item.recipe_id)
      if (recipe) {
        value += recipe.selling_price * item.quantity
      }
    })
    setTotalValue(value)
    return value
  }

  // Watch for changes to recalculate value
  const watchedItems = form.watch("items")
  useState(() => {
    calculateTotalValue(form.getValues())
  })

  async function onSubmit(data: ProductionPlanFormValues) {
    setIsLoading(true)

    try {
      let planId = plan?.id

      if (plan) {
        // Update existing plan
        const { error } = await supabase
          .from("production_plans")
          .update({
            name: data.name,
            date: data.date.toISOString(),
            status: data.status,
            notes: data.notes || "",
            updated_at: new Date().toISOString(),
          })
          .eq("id", plan.id)

        if (error) throw error

        // Delete existing plan items
        const { error: deleteError } = await supabase
          .from("production_items")
          .delete()
          .eq("production_plan_id", plan.id)

        if (deleteError) throw deleteError
      } else {
        // Create new plan
        const { data: newPlan, error } = await supabase
          .from("production_plans")
          .insert({
            name: data.name,
            date: data.date.toISOString(),
            status: data.status,
            notes: data.notes || "",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
          .select()

        if (error) throw error

        planId = newPlan[0].id
      }

      // Insert production items
      const productionItems = data.items.map((item) => ({
        production_plan_id: planId,
        recipe_id: item.recipe_id,
        quantity: item.quantity,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }))

      const { error: itemsError } = await supabase.from("production_items").insert(productionItems)

      if (itemsError) throw itemsError

      toast({
        title: plan ? "Production plan updated" : "Production plan created",
        description: `${data.name} has been ${plan ? "updated" : "created"} successfully.`,
      })

      router.push("/production")
      router.refresh()
    } catch (error) {
      console.error("Error saving production plan:", error)
      toast({
        title: "Error",
        description: "There was a problem saving the production plan.",
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
                    <FormLabel>Plan Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Weekly Production" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Production Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
                          >
                            {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="scheduled">Scheduled</SelectItem>
                      <SelectItem value="in progress">In Progress</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div>
              <h3 className="text-lg font-medium mb-4">Production Items</h3>
              <div className="space-y-4">
                {fields.map((field, index) => (
                  <div key={field.id} className="flex items-end gap-4">
                    <FormField
                      control={form.control}
                      name={`items.${index}.recipe_id`}
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormLabel>Recipe</FormLabel>
                          <Select
                            onValueChange={(value) => {
                              field.onChange(value)
                              calculateTotalValue(form.getValues())
                            }}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select recipe" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {recipes.map((recipe) => (
                                <SelectItem key={recipe.id} value={recipe.id}>
                                  {recipe.name} ({formatCurrency(recipe.selling_price)})
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`items.${index}.quantity`}
                      render={({ field }) => (
                        <FormItem className="w-[150px]">
                          <FormLabel>Quantity</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min="1"
                              {...field}
                              onChange={(e) => {
                                field.onChange(e)
                                calculateTotalValue(form.getValues())
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        remove(index)
                        calculateTotalValue(form.getValues())
                      }}
                      disabled={fields.length === 1}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}

                <Button type="button" variant="outline" onClick={() => append({ recipe_id: "", quantity: 1 })}>
                  Add Item
                </Button>

                <div className="text-right font-medium">Total Value: {formatCurrency(totalValue)}</div>
              </div>
            </div>

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Additional notes or instructions..." className="min-h-[100px]" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-4">
              <Button type="button" variant="outline" onClick={() => router.back()} disabled={isLoading}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Saving..." : plan ? "Update Plan" : "Create Plan"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
