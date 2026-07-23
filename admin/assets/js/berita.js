/* ═══════════════════════════════════════════════════════════════
   BERITA CRUD MODULE
   ═══════════════════════════════════════════════════════════════ */

const Berita = {
  /**
   * Get semua berita (untuk list di admin)
   * @returns {Promise<Array>}
   */
  async getAll() {
    const { data, error } = await window.sb
      .from('berita')
      .select('*')
      .order('tanggal', { ascending: false });

    if (error) {
      console.error('Error fetching berita:', error);
      return [];
    }
    return data || [];
  },

  /**
   * Get berita by ID (untuk edit)
   */
  async getById(id) {
    const { data, error } = await window.sb
      .from('berita')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching berita:', error);
      return null;
    }
    return data;
  },

  /**
   * Create berita baru
   */
  async create(beritaData) {
    // Auto-generate slug dari judul kalau belum ada
    if (!beritaData.slug) {
      beritaData.slug = this.slugify(beritaData.judul);
    }

    const { data, error } = await window.sb
      .from('berita')
      .insert([beritaData])
      .select()
      .single();

    if (error) {
      console.error('Error creating berita:', error);
      return { success: false, error: error.message };
    }
    return { success: true, data };
  },

  /**
   * Update berita
   */
  async update(id, beritaData) {
    // Update timestamp
    beritaData.updated_at = new Date().toISOString();

    const { data, error } = await window.sb
      .from('berita')
      .update(beritaData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating berita:', error);
      return { success: false, error: error.message };
    }
    return { success: true, data };
  },

  /**
   * Delete berita
   */
  async delete(id) {
    const { error } = await window.sb
      .from('berita')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting berita:', error);
      return { success: false, error: error.message };
    }
    return { success: true };
  },

  /**
   * Generate slug dari judul
   * "Pelatihan Buket Kreatif" → "pelatihan-buket-kreatif"
   */
  slugify(text) {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')      // hapus karakter non-alphanumeric
      .replace(/[\s_-]+/g, '-')       // spasi/underscore → dash
      .replace(/^-+|-+$/g, '');       // trim dash di awal/akhir
  },

  /**
   * Format tanggal ke Bahasa Indonesia
   * "2026-07-22" → "22 Juli 2026"
   */
  formatDate(dateStr) {
    const months = [
      'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
      'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];
    const d = new Date(dateStr);
    return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
  },

  /**
   * Truncate text
   */
  truncate(text, maxLength = 100) {
    if (!text) return '';
    return text.length > maxLength ? text.substr(0, maxLength) + '...' : text;
  }
};

window.Berita = Berita;