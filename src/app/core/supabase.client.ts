// src/app/core/supabase.client.ts
import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Read Vite-style env vars (exposed on the client) with a fallback to older names.
// Netlify + Vite require client-visible vars to be prefixed with `VITE_`.
const env = (import.meta as any).env as Record<string, unknown>;
const supabaseUrl = (env['VITE_SUPABASE_URL'] ?? env['NG_APP_SUPABASE_URL']) as string | undefined;
const supabaseAnonKey = (env['VITE_SUPABASE_ANON_KEY'] ?? env['NG_APP_SUPABASE_ANON_KEY']) as string | undefined;

if (!supabaseUrl || !supabaseAnonKey) {
	throw new Error(
		'Missing Supabase environment variables. Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` (or `NG_APP_` fallbacks) in your environment.'
	);
}

export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey);