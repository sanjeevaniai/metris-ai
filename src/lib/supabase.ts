import { createClient, SupabaseClient } from '@supabase/supabase-js';

// SANJEEVANI AI - Supabase Configuration
const supabaseUrl = 'https://gkcqzdbzandkqnvpccvv.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdrY3F6ZGJ6YW5ka3FudnBjY3Z2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg0MjMyNzgsImV4cCI6MjA4Mzk5OTI3OH0.BhCRP4eAG-lQkKftZiVvBknpjIZojzvDCWKhxnR-lcE';

export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey);

// Edge function helper for Scout AI
export async function invokeScoutAI(message: string, context?: {
  currentView?: string;
  page?: string;
  scores?: Record<string, number>;
  findings?: unknown[];
}) {
  const { data, error } = await supabase.functions.invoke('scout-ai', {
    body: { message, context }
  });
  
  if (error) throw error;
  return data;
}
