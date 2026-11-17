import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://qhplndcaukifvupzicpm.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_bjDGsojxcZPg2GQ7609LPg_lnFjwJ36';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
