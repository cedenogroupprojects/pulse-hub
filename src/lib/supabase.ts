import { createClient, SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string

let _client: SupabaseClient | null = null

function getClient(): SupabaseClient {
  if (_client) return _client
  if (!supabaseUrl || !supabaseAnonKey) {
    return new Proxy({} as unknown as SupabaseClient, {
      get: () => () => Promise.resolve({ data: null, error: null }),
    })
  }
  _client = createClient(supabaseUrl, supabaseAnonKey)
  return _client
}

export const supabase: SupabaseClient = new Proxy({} as unknown as SupabaseClient, {
  get(_target, prop) {
    return (getClient() as unknown as Record<string | symbol, unknown>)[prop]
  },
})
