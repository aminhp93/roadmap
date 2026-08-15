import { createClient, SupabaseClient } from "@supabase/supabase-js";

const SUPABASE_URL_KEY = "roadmap_supabase_url";
const SUPABASE_KEY_KEY = "roadmap_supabase_anon_key";

export function getSavedSupabaseConfig(): { url: string; key: string } {
  const envUrl = import.meta.env.VITE_SUPABASE_URL || "";
  const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "";

  const localUrl = localStorage.getItem(SUPABASE_URL_KEY) || envUrl;
  const localKey = localStorage.getItem(SUPABASE_KEY_KEY) || envKey;

  return { url: localUrl, key: localKey };
}

export function saveSupabaseConfig(url: string, key: string): void {
  localStorage.setItem(SUPABASE_URL_KEY, url.trim());
  localStorage.setItem(SUPABASE_KEY_KEY, key.trim());
}

let cachedClient: SupabaseClient | null = null;
let cachedConfigStr = "";

export function getSupabaseClient(): SupabaseClient | null {
  const { url, key } = getSavedSupabaseConfig();
  if (!url || !key) return null;

  const configStr = `${url}:${key}`;
  if (cachedClient && cachedConfigStr === configStr) {
    return cachedClient;
  }

  try {
    cachedClient = createClient(url, key);
    cachedConfigStr = configStr;
    return cachedClient;
  } catch (err) {
    console.error("Failed to initialize Supabase client:", err);
    return null;
  }
}

export function isSupabaseConfigured(): boolean {
  const { url, key } = getSavedSupabaseConfig();
  return Boolean(url && key);
}
