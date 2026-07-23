/* ═══════════════════════════════════════════════════════════════
   HOMEPAGE - DYNAMIC BERITA
   Fetch published berita dari Supabase + render ke Section Berita
   ═══════════════════════════════════════════════════════════════ */

(async function() {
  const SUPABASE_URL = 'https://agxvzfsxgcvkjmmceufl.supabase.co';
  const SUPABASE_ANON_KEY = 'sb_publishable_9ef_AR5NYYgDdPlDIQ2DWQ_Cgvok-RK';

  // Init Supabase client (independent dari admin panel)
  const { createClient } = supabase;
  const sb = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

  const grid = document.getElementById('beritaGrid');
  if (!grid) return;

  // Fetch 3 berita published terbaru
  const { data, error } = await sb
    .from('berita')
    .select('*')
    .eq('status', 'published')
    .order('tanggal', { ascending: false })
    .limit(3);

  if (error) {
    console.error('Error fetching berita:', error);
    grid.innerHTML = '<div class="berita-loading">Gagal memuat berita. Coba refresh halaman.</div>';
    return;
  }

  if (!data || data.length === 0) {
    grid.innerHTML = '<div class="berita-loading">Belum ada berita terkini.</div>';
    return;
  }

  // Render card
  grid.innerHTML = data.map(berita => `
    <article class="berita-card">
      <div class="berita-image">
        ${berita.foto_url ? `
          <img src="${escapeHtml(berita.foto_url)}" alt="${escapeHtml(berita.judul)}" class="berita-image-real">
        ` : `
          <div class="berita-image-placeholder">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
              <circle cx="8.5" cy="8.5" r="1.5"/>
              <polyline points="21 15 16 10 5 21"/>
            </svg>
          </div>
        `}
      </div>
      <div class="berita-content">
        <div class="berita-meta">
          <span class="berita-date">${formatDate(berita.tanggal)}</span>
          <span class="berita-tag">${escapeHtml(berita.tag || 'Sekretariat')}</span>
        </div>
        <h3 class="berita-title">${escapeHtml(berita.judul)}</h3>
        <p class="berita-excerpt">${escapeHtml(berita.excerpt || '')}</p>
        <a href="berita/${escapeHtml(berita.slug)}.html" class="berita-link">
          Baca Selengkapnya
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="5" y1="12" x2="19" y2="12"/>
            <polyline points="12 5 19 12 12 19"/>
          </svg>
        </a>
      </div>
    </article>
  `).join('');

  // ─── Helper Functions ───

  function formatDate(dateStr) {
    const months = [
      'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
      'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];
    const d = new Date(dateStr);
    return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
  }

  function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
})();