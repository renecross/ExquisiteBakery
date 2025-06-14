"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useFieldArray, useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { createBrowserClient } from "@/lib/supabase/client"
import { useToast } from "@/components/ui/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Trash2 } from "lucide-react"
import { formatCurrency } from "@/lib/utils"

const recipeIngredientSchema = z.object({
  ingredient_id: z.string().min(1, "Please select an ingredient"),
  quantity: z.coerce.number().positive("Quantity must be positive"),
})

const recipeFormSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  description: z.string(),
  instructions: z.string(),
  selling_price: z.coerce.number().nonnegative({
    message: "Selling price cannot be negative.",
  }),
  ingredients: z.array(recipeIngredientSchema).min(1, "Add at least one ingredient"),
})

type RecipeFormValues = z.infer<typeof recipeFormSchema>

interface Ingredient {
  id: string
  name: string
  unit: string
  cost_per_unit: number
}

interface RecipeFormProps {
  recipe?: {
    id: string
    name: string
    description: string
    instructions: string
    selling_price: number
  }
  recipeIngredients?: {
    ingredient_id: string
    quantity: number
  }[]
  ingredients: Ingredient[]
}

export function RecipeForm({ recipe, recipeIngredients = [], ingredients }: RecipeFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const supabase = createBrowserClient()
  const [isLoading, setIsLoading] = useState(false)
  const [totalCost, setTotalCost] = useState(0)

  const form = useForm<RecipeFormValues>({
    resolver: zodResolver(recipeFormSchema),
    defaultValues: {
      name: recipe?.name || "",
      description: recipe?.description || "",
      instructions: recipe?.instructions || "",
      selling_price: recipe?.selling_price || 0,
      ingredients: recipeIngredients.length > 0 ? recipeIngredients : [{ ingredient_id: "", quantity: 0 }],
    },
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "ingredients",
  })

  // Calculate total cost whenever ingredients change
  const calculateTotalCost = (formValues: RecipeFormValues) => {
    let cost = 0
    formValues.ingredients.forEach((item) => {
      const ingredient = ingredients.find((ing) => ing.id === item.ingredient_id)
      if (ingredient) {
        cost += ingredient.cost_per_unit * item.quantity
      }
    })
    setTotalCost(cost)
    return cost
  }

  // Watch for changes to recalculate cost
  const watchedIngredients = form.watch("ingredients")
  useState(() => {
    calculateTotalCost(form.getValues())
  })

  async function onSubmit(data: RecipeFormValues) {
    setIsLoading(true)

    try {
      let recipeId = recipe?.id

      if (recipe) {
        // Update existing recipe
        const { error } = await supabase
          .from("recipes")
          .update({
            name: data.name,
            description: data.description,
            instructions: data.instructions,
            selling_price: data.selling_price,
            updated_at: new Date().toISOString(),
          })
          .eq("id", recipe.id)

        if (error) throw error

        // Delete existing recipe ingredients
        const { error: deleteError } = await supabase.from("recipe_ingredients").delete().eq("recipe_id", recipe.id)

        if (deleteError) throw deleteError
      } else {
        // Create new recipe
        const { data: newRecipe, error } = await supabase
          .from("recipes")
          .insert({
            name: data.name,
            description: data.description,
            instructions: data.instructions,
            selling_price: data.selling_price,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
          .select()

        if (error) throw error

        recipeId = newRecipe[0].id
      }

      // Insert recipe ingredients
      const recipeIngredients = data.ingredients.map((item) => ({
        recipe_id: recipeId,
        ingredient_id: item.ingredient_id,
        quantity: item.quantity,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }))

      const { error: ingredientsError } = await supabase.from("recipe_ingredients").insert(recipeIngredients)

      if (ingredientsError) throw ingredientsError

      toast({
        title: recipe ? "Recipe updated" : "Recipe created",
        description: `${data.name} has been ${recipe ? "updated" : "added"} successfully.`,
      })

      router.push("/recipes")
      router.refresh()
    } catch (error) {
      console.error("Error saving recipe:", error)
      toast({
        title: "Error",
        description: "There was a problem saving the recipe.",
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
                    <FormLabel>Recipe Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Chocolate Cake" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="selling_price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Selling Price (ZAR)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" {...field} />
                    </FormControl>
                    <FormDescription>
                      Estimated cost: {formatCurrency(totalCost)} | Profit margin:{" "}
                      {field.value > 0 ? Math.round(((field.value - totalCost) / field.value) * 100) + "%" : "N/A"}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="A rich chocolate cake with buttercream frosting" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div>
              <h3 className="text-lg font-medium mb-4">Ingredients</h3>
              <div className="space-y-4">
                {fields.map((field, index) => (
                  <div key={field.id} className="flex items-end gap-4">
                    <FormField
                      control={form.control}
                      name={`ingredients.${index}.ingredient_id`}
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormLabel>Ingredient</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select ingredient" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {ingredients.map((ingredient) => (
                                <SelectItem key={ingredient.id} value={ingredient.id}>
                                  {ingredient.name} ({ingredient.unit})
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
                      name={`ingredients.${index}.quantity`}
                      render={({ field }) => (
                        <FormItem className="w-[150px]">
                          <FormLabel>Quantity</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              step="0.01"
                              {...field}
                              onChange={(e) => {
                                field.onChange(e)
                                calculateTotalCost(form.getValues())
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
                        calculateTotalCost(form.getValues())
                      }}
                      disabled={fields.length === 1}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}

                <Button type="button" variant="outline" onClick={() => append({ ingredient_id: "", quantity: 0 })}>
                  Add Ingredient
                </Button>
              </div>
            </div>

            <FormField
              control={form.control}
              name="instructions"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Instructions</FormLabel>
                  <FormControl>
                    <Textarea placeholder="1. Preheat oven to 180°C..." className="min-h-[200px]" {...field} />
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
                {isLoading ? "Saving..." : recipe ? "Update Recipe" : "Create Recipe"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
