import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://qhplndcaukifvupzicpm.supabase.co';
const supabaseAnonKey = 'sb_publishable_bjDGsojxcZPg2GQ7609LPg_lnFjwJ36';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false, // In React Native without async-storage configured, false avoids warning
    autoRefreshToken: false,
    detectSessionInUrl: false,
  },
});
