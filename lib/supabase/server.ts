import { createServerClient as createClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import type { Database } from "@/types/supabase"

export function createServerClient() {
  const cookieStore = cookies()

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) {
    console.warn("Supabase URL or key not found. Using mock data instead.")
    return createMockClient()
  }

  return createClient<Database>(supabaseUrl, supabaseKey, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value
      },
    },
  })
}

// Mock client for demo purposes when Supabase is not configured
function createMockClient() {
  return {
    from: (table: string) => ({
      select: (columns?: string) => ({
        eq: () => ({ data: getMockData(table, "single"), error: null }),
        order: () => ({ data: getMockData(table), error: null }),
        in: () => ({ data: getMockData(table), error: null }),
        lt: () => ({ data: getMockData(table).slice(0, 2), error: null }),
        single: () => ({ data: getMockData(table, "single"), error: null }),
        count: "exact",
        head: true,
      }),
      insert: () => ({ data: { id: "new-mock-id" }, error: null }),
      update: () => ({ data: null, error: null }),
      delete: () => ({ data: null, error: null }),
    }),
    auth: {
      signOut: async () => ({ error: null }),
    },
  }
}

function getMockData(table: string, type: "single" | "multiple" = "multiple") {
  const mockData: Record<string, any> = {
    ingredients: [
      {
        id: "1",
        name: "Flour",
        unit: "kg",
        cost_per_unit: 15.5,
        current_stock: 25,
        min_stock: 10,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: "2",
        name: "Sugar",
        unit: "kg",
        cost_per_unit: 22.0,
        current_stock: 20,
        min_stock: 8,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: "3",
        name: "Butter",
        unit: "kg",
        cost_per_unit: 120.0,
        current_stock: 5,
        min_stock: 10,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ],
    recipes: [
      {
        id: "1",
        name: "Chocolate Cake",
        description: "Rich chocolate cake",
        instructions: "Mix and bake",
        selling_price: 250.0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: "2",
        name: "Vanilla Cupcakes",
        description: "Light and fluffy",
        instructions: "Mix and bake in cups",
        selling_price: 25.0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ],
    production_plans: [
      {
        id: "1",
        name: "Weekend Special",
        date: new Date().toISOString(),
        status: "scheduled",
        notes: "For weekend",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: "2",
        name: "Corporate Order",
        date: new Date().toISOString(),
        status: "in progress",
        notes: "For ABC Corp",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ],
    production_items: [
      {
        id: "1",
        production_plan_id: "1",
        quantity: 5,
        recipes: { id: "1", name: "Chocolate Cake", selling_price: 250.0 },
      },
      {
        id: "2",
        production_plan_id: "1",
        quantity: 24,
        recipes: { id: "2", name: "Vanilla Cupcakes", selling_price: 25.0 },
      },
    ],
    recipe_ingredients: [
      {
        quantity: 2,
        recipes: { id: "1", name: "Chocolate Cake" },
        ingredients: { id: "1", name: "Flour", unit: "kg", cost_per_unit: 15.5, current_stock: 25 },
      },
      {
        quantity: 1,
        recipes: { id: "1", name: "Chocolate Cake" },
        ingredients: { id: "2", name: "Sugar", unit: "kg", cost_per_unit: 22.0, current_stock: 20 },
      },
    ],
  }

  if (type === "single" && mockData[table]?.length > 0) {
    return mockData[table][0]
  }

  return mockData[table] || []
}
