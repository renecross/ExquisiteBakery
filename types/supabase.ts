export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      ingredients: {
        Row: {
          id: string
          name: string
          unit: string
          cost_per_unit: number
          current_stock: number
          min_stock: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          unit: string
          cost_per_unit: number
          current_stock: number
          min_stock: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          unit?: string
          cost_per_unit?: number
          current_stock?: number
          min_stock?: number
          created_at?: string
          updated_at?: string
        }
      }
      recipes: {
        Row: {
          id: string
          name: string
          description: string
          instructions: string
          created_at: string
          updated_at: string
          selling_price: number
        }
        Insert: {
          id?: string
          name: string
          description: string
          instructions: string
          created_at?: string
          updated_at?: string
          selling_price: number
        }
        Update: {
          id?: string
          name?: string
          description?: string
          instructions?: string
          created_at?: string
          updated_at?: string
          selling_price?: number
        }
      }
      recipe_ingredients: {
        Row: {
          id: string
          recipe_id: string
          ingredient_id: string
          quantity: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          recipe_id: string
          ingredient_id: string
          quantity: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          recipe_id?: string
          ingredient_id?: string
          quantity?: number
          created_at?: string
          updated_at?: string
        }
      }
      production_plans: {
        Row: {
          id: string
          name: string
          date: string
          notes: string
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          date: string
          notes: string
          status: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          date?: string
          notes?: string
          status?: string
          created_at?: string
          updated_at?: string
        }
      }
      production_items: {
        Row: {
          id: string
          production_plan_id: string
          recipe_id: string
          quantity: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          production_plan_id: string
          recipe_id: string
          quantity: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          production_plan_id?: string
          recipe_id?: string
          quantity?: number
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
