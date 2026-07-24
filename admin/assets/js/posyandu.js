/* ═══════════════════════════════════════════════════════════════
   POSYANDU JADWAL CRUD MODULE
   ═══════════════════════════════════════════════════════════════ */

const PosyanduJadwal = {
  async getAll(bulanTahun) {
    let query = window.sb
      .from('posyandu_jadwal')
      .select('*')
      .order('rw', { ascending: true });

    if (bulanTahun) {
      query = query.eq('bulan_tahun', bulanTahun);
    }

    const { data, error } = await query;
    if (error) {
      console.error('Error fetching jadwal:', error);
      return [];
    }
    return data || [];
  },

  async getById(id) {
    const { data, error } = await window.sb
      .from('posyandu_jadwal')
      .select('*')
      .eq('id', id)
      .single();

    if (error) return null;
    return data;
  },

  async create(jadwalData) {
    const { data, error } = await window.sb
      .from('posyandu_jadwal')
      .insert([jadwalData])
      .select()
      .single();

    if (error) {
      console.error('Error creating jadwal:', error);
      return { success: false, error: error.message };
    }
    return { success: true, data };
  },

  async update(id, jadwalData) {
    jadwalData.updated_at = new Date().toISOString();
    const { data, error } = await window.sb
      .from('posyandu_jadwal')
      .update(jadwalData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating jadwal:', error);
      return { success: false, error: error.message };
    }
    return { success: true, data };
  },

  async delete(id) {
    const { error } = await window.sb
      .from('posyandu_jadwal')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting jadwal:', error);
      return { success: false, error: error.message };
    }
    return { success: true };
  },

  /**
   * Get list bulan-tahun yang udah ada jadwalnya
   */
  async getBulanTahunList() {
    const { data, error } = await window.sb
      .from('posyandu_jadwal')
      .select('bulan_tahun');

    if (error) return [];

    // Get unique + sort DESC
    const unique = [...new Set(data.map(d => d.bulan_tahun))];
    return unique.sort().reverse();
  },

  /**
   * Format bulan-tahun ke Indonesia
   * "2026-08" → "Agustus 2026"
   */
  formatBulanTahun(bulanTahun) {
    if (!bulanTahun) return '';
    const [year, month] = bulanTahun.split('-');
    const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
    return `${months[parseInt(month) - 1]} ${year}`;
  },

  /**
   * Get current bulan-tahun "2026-08"
   */
  getCurrentBulanTahun() {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  },

  /**
   * Get available bulan-tahun options (3 bulan ke depan)
   */
  getBulanTahunOptions() {
    const options = [];
    const now = new Date();
    for (let i = 0; i < 4; i++) {
      const date = new Date(now.getFullYear(), now.getMonth() + i, 1);
      const bt = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      options.push({ value: bt, label: this.formatBulanTahun(bt) });
    }
    return options;
  },

  getJenisLabel(jenis) {
    const labels = { balita: 'Balita', lansia: 'Lansia', balita_lansia: 'Balita & Lansia' };
    return labels[jenis] || 'Balita';
  }
};

window.PosyanduJadwal = PosyanduJadwal;