// lib/supabaseClient.ts
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

if (!url || !anonKey) {
  // keep silent during dev, but you can log if desired
  // console.warn("Supabase env variables missing");
}

export const supabase = createClient(url, anonKey);

