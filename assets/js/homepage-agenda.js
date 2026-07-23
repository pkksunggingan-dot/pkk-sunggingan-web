/* ═══════════════════════════════════════════════════════════════
   HOMEPAGE - DYNAMIC AGENDA
   Fetch upcoming agenda dari Supabase + render Section Agenda
   ═══════════════════════════════════════════════════════════════ */

(async function() {
  const SUPABASE_URL = 'https://agxvzfsxgcvkjmmceufl.supabase.co';
  const SUPABASE_ANON_KEY = 'sb_publishable_9ef_AR5NYYgDdPlDIQ2DWQ_Cgvok-RK';

  const { createClient } = supabase;
  const sb = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

  const list = document.getElementById('agendaList');
  if (!list) return;

  // Get tanggal hari ini (untuk filter upcoming)
  const today = new Date().toISOString().split('T')[0];

  // Fetch upcoming agenda (tanggal >= hari ini), max 5 event
  const { data, error } = await sb
    .from('agenda')
    .select('*')
    .gte('tanggal', today)
    .order('tanggal', { ascending: true })
    .limit(5);

  if (error) {
    console.error('Error fetching agenda:', error);
    list.innerHTML = '<div class="agenda-loading">Gagal memuat agenda. Coba refresh halaman.</div>';
    return;
  }

  if (!data || data.length === 0) {
    list.innerHTML = '<div class="agenda-loading">Belum ada agenda terdekat.</div>';
    return;
  }

  // Render card
  list.innerHTML = data.map(agenda => {
    const dateObj = new Date(agenda.tanggal);
    const day = dateObj.getDate();
    const monthShort = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Ags', 'Sep', 'Okt', 'Nov', 'Des'][dateObj.getMonth()];
    
    return `
      <article class="agenda-card ${agenda.highlight ? 'agenda-card-highlight' : ''}">
        <div class="agenda-date">
          <span class="agenda-day">${day}</span>
          <span class="agenda-month">${monthShort}</span>
        </div>
        <div class="agenda-content">
          <h3 class="agenda-title">${escapeHtml(agenda.judul)}</h3>
          <div class="agenda-meta">
            <span class="agenda-time">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              ${escapeHtml(agenda.jam || '-')}
            </span>
            <span class="agenda-location">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
              ${escapeHtml(agenda.lokasi)}
            </span>
          </div>
        </div>
        ${agenda.highlight ? '<div class="agenda-badge">Prioritas</div>' : ''}
      </article>
    `;
  }).join('');

  function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
})();