"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import { Loader2 } from "lucide-react"

interface Ingredient {
  id: string
  name: string
  unit: string
}

interface RecipeScannerProps {
  ingredients: Ingredient[]
}

interface ExtractedIngredient {
  name: string
  quantity: number
  unit: string
  matched_id?: string
}

interface ExtractedRecipe {
  name: string
  ingredients: ExtractedIngredient[]
  instructions: string
}

export function RecipeScanner({ ingredients }: RecipeScannerProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [recipeText, setRecipeText] = useState("")
  const [recipeImage, setRecipeImage] = useState<File | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [extractedRecipe, setExtractedRecipe] = useState<ExtractedRecipe | null>(null)

  // This is a mock function that simulates AI extraction
  // In a real implementation, this would use an AI service
  const extractRecipeFromText = async (text: string) => {
    setIsProcessing(true)

    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Mock extraction logic
      const lines = text.split("\n").filter((line) => line.trim() !== "")

      // Extract recipe name (assume first line is the title)
      const name = lines[0].trim()

      // Extract ingredients (assume they come after "Ingredients:" and before "Instructions:")
      const ingredientsStartIndex = lines.findIndex((line) => line.toLowerCase().includes("ingredients"))

      const instructionsStartIndex = lines.findIndex(
        (line) =>
          line.toLowerCase().includes("instructions") ||
          line.toLowerCase().includes("directions") ||
          line.toLowerCase().includes("method"),
      )

      const ingredientLines = lines.slice(
        ingredientsStartIndex + 1,
        instructionsStartIndex > 0 ? instructionsStartIndex : undefined,
      )

      const extractedIngredients: ExtractedIngredient[] = ingredientLines
        .filter((line) => line.trim() !== "")
        .map((line) => {
          // Simple regex to extract quantity, unit and name
          const match = line.match(/^([\d./]+)\s*([a-zA-Z]+)?\s+(.+)$/)

          if (match) {
            const [, quantityStr, unit, name] = match

            // Convert fractions like 1/2 to decimal
            let quantity = 0
            if (quantityStr.includes("/")) {
              const [numerator, denominator] = quantityStr.split("/")
              quantity = Number.parseFloat(numerator) / Number.parseFloat(denominator)
            } else {
              quantity = Number.parseFloat(quantityStr)
            }

            // Try to match with existing ingredients
            const matchedIngredient = ingredients.find(
              (ing) =>
                ing.name.toLowerCase().includes(name.toLowerCase()) ||
                name.toLowerCase().includes(ing.name.toLowerCase()),
            )

            return {
              name: name.trim(),
              quantity,
              unit: unit || "",
              matched_id: matchedIngredient?.id,
            }
          }

          return {
            name: line.trim(),
            quantity: 1,
            unit: "",
          }
        })

      // Extract instructions
      const instructions = lines.slice(instructionsStartIndex + 1).join("\n")

      setExtractedRecipe({
        name,
        ingredients: extractedIngredients,
        instructions,
      })

      toast({
        title: "Recipe extracted",
        description: "We've extracted the recipe information. Please review and edit as needed.",
      })
    } catch (error) {
      console.error("Error extracting recipe:", error)
      toast({
        title: "Extraction failed",
        description: "We couldn't extract the recipe. Please try again or enter manually.",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setRecipeImage(e.target.files[0])
    }
  }

  const processImage = async () => {
    if (!recipeImage) return

    setIsProcessing(true)

    try {
      // In a real implementation, this would upload the image to an OCR service
      // and then process the extracted text
      toast({
        title: "Image processing",
        description: "This is a demo. In a real implementation, the image would be processed by OCR.",
      })

      // Simulate processing delay
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // For demo purposes, we'll just use a mock recipe
      const mockExtractedText = `Chocolate Cake
      
Ingredients:
2 cups all-purpose flour
2 cups sugar
3/4 cup unsweetened cocoa powder
2 teaspoons baking powder
1 1/2 teaspoons baking soda
1 teaspoon salt
2 eggs
1 cup milk
1/2 cup vegetable oil
2 teaspoons vanilla extract
1 cup boiling water

Instructions:
1. Preheat oven to 350°F (175°C). Grease and flour two 9-inch round cake pans.
2. In a large bowl, combine flour, sugar, cocoa, baking powder, baking soda, and salt.
3. Add eggs, milk, oil, and vanilla; beat on medium speed for 2 minutes.
4. Stir in boiling water (batter will be thin). Pour into prepared pans.
5. Bake for 30-35 minutes or until a toothpick inserted comes out clean.
6. Cool in pans for 10 minutes; remove to wire racks to cool completely.`

      setRecipeText(mockExtractedText)
      await extractRecipeFromText(mockExtractedText)
    } catch (error) {
      console.error("Error processing image:", error)
      toast({
        title: "Processing failed",
        description: "We couldn't process the image. Please try again or enter text manually.",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const handleContinue = () => {
    if (!extractedRecipe) return

    // In a real implementation, this would navigate to the recipe form
    // with the extracted data pre-filled
    router.push("/recipes/new")

    toast({
      title: "Recipe ready for editing",
      description: "In a real implementation, this would pre-fill the recipe form.",
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recipe Scanner</CardTitle>
        <CardDescription>
          Scan a recipe from text or upload an image to automatically extract ingredients and instructions.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="text">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="text">Text Input</TabsTrigger>
            <TabsTrigger value="image">Image Upload</TabsTrigger>
          </TabsList>
          <TabsContent value="text" className="space-y-4 pt-4">
            <div className="grid w-full gap-2">
              <Textarea
                placeholder="Paste your recipe here..."
                className="min-h-[300px]"
                value={recipeText}
                onChange={(e) => setRecipeText(e.target.value)}
              />
            </div>
            <Button onClick={() => extractRecipeFromText(recipeText)} disabled={!recipeText.trim() || isProcessing}>
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                "Extract Recipe"
              )}
            </Button>
          </TabsContent>
          <TabsContent value="image" className="space-y-4 pt-4">
            <div className="grid w-full gap-2">
              <Label htmlFor="recipe-image">Upload Recipe Image</Label>
              <Input id="recipe-image" type="file" accept="image/*" onChange={handleImageUpload} />
            </div>
            <Button onClick={processImage} disabled={!recipeImage || isProcessing}>
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                "Process Image"
              )}
            </Button>
          </TabsContent>
        </Tabs>

        {extractedRecipe && (
          <div className="mt-8 space-y-4 border-t pt-4">
            <h3 className="text-lg font-medium">Extracted Recipe</h3>

            <div className="space-y-2">
              <h4 className="font-medium">Name</h4>
              <p>{extractedRecipe.name}</p>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">Ingredients</h4>
              <ul className="list-disc pl-5 space-y-1">
                {extractedRecipe.ingredients.map((ingredient, index) => (
                  <li key={index} className={ingredient.matched_id ? "text-green-600" : ""}>
                    {ingredient.quantity} {ingredient.unit} {ingredient.name}
                    {ingredient.matched_id && " (matched)"}
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">Instructions</h4>
              <p className="whitespace-pre-line">{extractedRecipe.instructions}</p>
            </div>
          </div>
        )}
      </CardContent>

      {extractedRecipe && (
        <CardFooter>
          <Button onClick={handleContinue}>Continue to Recipe Form</Button>
        </CardFooter>
      )}
    </Card>
  )
}
