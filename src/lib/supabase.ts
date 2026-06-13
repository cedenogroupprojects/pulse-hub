import { createClient, SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string

// Lazy singleton — only created when both values are present
let _client: SupabaseClient | null = null

function getClient(): SupabaseClient {
  if (_client) return _client
  if (!supabaseUrl || !supabaseAnonKey) {
    // Return a no-op proxy so components don't crash during local dev without keys
    return new Proxy({} as SupabaseClient, {
      get: () => () => Promise.resolve({ data: null, error: null }),
    })
  }
  _client = createClient(supabaseUrl, supabaseAnonKey)
  return _client
}

export const supabase: SupabaseClient = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    return (getClient() as Record<string | symbol, unknown>)[prop]
  },
})
