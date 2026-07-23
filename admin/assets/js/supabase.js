/* ═══════════════════════════════════════════════════════════════
   SUPABASE CLIENT INITIALIZATION
   ═══════════════════════════════════════════════════════════════ */

// Import Supabase JS SDK dari CDN
const { createClient } = supabase;

const supabaseClient = createClient(
  SUPABASE_CONFIG.url,
  SUPABASE_CONFIG.anonKey
);

// Expose ke global scope biar bisa dipake di file lain
window.sb = supabaseClient; 