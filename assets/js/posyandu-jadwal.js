/* ═══════════════════════════════════════════════════════════════
   POSYANDU - Fetch Jadwal Bulan Ini dari Supabase
   ═══════════════════════════════════════════════════════════════ */

(async function() {
  const SUPABASE_URL = 'https://agxvzfsxgcvkjmmceufl.supabase.co';
  const SUPABASE_ANON_KEY = 'sb_publishable_9ef_AR5NYYgDdPlDIQ2DWQ_Cgvok-RK';

  const { createClient } = supabase;
  const sb = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

  const container = document.getElementById('jadwalContainer');
  const titleEl = document.getElementById('jadwalTitle');
  if (!container) return;

  // Get bulan-tahun sekarang (format "2026-08")
  const now = new Date();
  const currentBulanTahun = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

  // Update title
  const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
  const monthLabel = months[now.getMonth()];
  titleEl.textContent = `Jadwal Posyandu ${monthLabel} ${now.getFullYear()}`;

  // Fetch jadwal
  const { data, error } = await sb
    .from('posyandu_jadwal')
    .select('*')
    .eq('bulan_tahun', currentBulanTahun)
    .order('rw', { ascending: true });

  if (error) {
    console.error('Error fetching jadwal:', error);
    container.innerHTML = '<div class="posyandu-loading">Gagal memuat jadwal. Coba refresh halaman.</div>';
    return;
  }

  if (!data || data.length === 0) {
    container.innerHTML = `
      <div class="posyandu-empty">
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
          <line x1="16" y1="2" x2="16" y2="6"/>
          <line x1="8" y1="2" x2="8" y2="6"/>
          <line x1="3" y1="10" x2="21" y2="10"/>
        </svg>
        <h3>Jadwal Bulan Ini Belum Diumumkan</h3>
        <p>Jadwal Posyandu bulan ${monthLabel} sedang disusun oleh kader RW. Silakan cek kembali beberapa hari lagi atau hubungi kader RW masing-masing untuk info terbaru.</p>
      </div>
    `;
    return;
  }

  // Render sebagai grid card per RW
  container.innerHTML = `
    <div class="posyandu-jadwal-grid">
      ${data.map(item => `
        <div class="posyandu-jadwal-card">
          <div class="posyandu-jadwal-rw">${escapeHtml(item.rw)}</div>
          <div class="posyandu-jadwal-detail">
            ${item.hari ? `<div class="posyandu-jadwal-hari">${escapeHtml(item.hari)}</div>` : ''}
            ${item.tanggal ? `<div class="posyandu-jadwal-tanggal">${formatDate(item.tanggal)}</div>` : ''}
            <div class="posyandu-jadwal-meta">
              <span class="posyandu-jadwal-jam">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                ${escapeHtml(item.jam)}
              </span>
              <span class="posyandu-jadwal-lokasi">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                ${escapeHtml(item.lokasi)}
              </span>
            </div>
            <div class="posyandu-jadwal-jenis-badge">${getJenisLabel(item.jenis)}</div>
            ${item.catatan ? `<div class="posyandu-jadwal-catatan">${escapeHtml(item.catatan)}</div>` : ''}
          </div>
        </div>
      `).join('')}
    </div>
  `;

  function getJenisLabel(jenis) {
    const labels = { balita: 'Balita', lansia: 'Lansia', balita_lansia: 'Balita & Lansia' };
    return labels[jenis] || 'Balita';
  }

  function formatDate(dateStr) {
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