import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseKey) {
  console.warn('Missing Supabase URL or Anon Key. Authentication will not work properly.');
}

export const supabase = createClient(supabaseUrl, supabaseKey);
