import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://sxidaypymfzpzcxuqrqb.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN4aWRheXB5bWZ6cHpjeHVxcnFiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIxMTYxOTYsImV4cCI6MjA5NzY5MjE5Nn0.u5LaS6-O1d_AHaQPrLJgAkCQYYdWoSjYfUQUZVCCJO4";

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase enviroment variables");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
