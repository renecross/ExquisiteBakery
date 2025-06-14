import { createBrowserClient as createClient } from "@supabase/ssr"
import type { Database } from "@/types/supabase"

let client: ReturnType<typeof createClient<Database>> | null = null

export function createBrowserClient() {
  if (client) return client

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) {
    console.warn("Supabase URL or key not found. Using mock client instead.")
    return createMockClient() as any
  }

  client = createClient<Database>(supabaseUrl, supabaseKey, {
    cookies: {
      get(name: string) {
        return document.cookie
          .split("; ")
          .find((row) => row.startsWith(`${name}=`))
          ?.split("=")[1]
      },
      set(name: string, value: string, options: { path?: string; maxAge?: number; domain?: string }) {
        document.cookie = `${name}=${value}; path=${options.path || "/"}`
      },
      remove(name: string, options: { path?: string }) {
        document.cookie = `${name}=; path=${options.path || "/"}`
      },
    },
  })

  return client
}

// Mock client for demo purposes when Supabase is not configured
function createMockClient() {
  return {
    from: (table: string) => ({
      select: () => ({
        eq: () => ({ data: [{ id: "mock-id" }], error: null }),
        order: () => ({ data: [{ id: "mock-id" }], error: null }),
        single: () => ({ data: { id: "mock-id" }, error: null }),
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
