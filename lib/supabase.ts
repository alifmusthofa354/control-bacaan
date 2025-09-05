// lib/supabase.js
import { createClient } from "@supabase/supabase-js";

// Ganti dengan URL dan API Key dari Supabase Project-mu
const supabaseUrl = process.env.supabaseUrl || "";
const supabaseAnonKey = process.env.supabaseAnonKey || "";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
