/* ═══════════════════════════════════════════════════════════════
   AGENDA CRUD MODULE
   ═══════════════════════════════════════════════════════════════ */

const Agenda = {
  /**
   * Get semua agenda (untuk admin list)
   */
  async getAll() {
    const { data, error } = await window.sb
      .from('agenda')
      .select('*')
      .order('tanggal', { ascending: true });  // Terdekat dulu

    if (error) {
      console.error('Error fetching agenda:', error);
      return [];
    }
    return data || [];
  },

  /**
   * Get agenda by ID (untuk edit)
   */
  async getById(id) {
    const { data, error } = await window.sb
      .from('agenda')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching agenda:', error);
      return null;
    }
    return data;
  },

  /**
   * Create agenda baru
   */
  async create(agendaData) {
    const { data, error } = await window.sb
      .from('agenda')
      .insert([agendaData])
      .select()
      .single();

    if (error) {
      console.error('Error creating agenda:', error);
      return { success: false, error: error.message };
    }
    return { success: true, data };
  },

  /**
   * Update agenda
   */
  async update(id, agendaData) {
    const { data, error } = await window.sb
      .from('agenda')
      .update(agendaData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating agenda:', error);
      return { success: false, error: error.message };
    }
    return { success: true, data };
  },

  /**
   * Delete agenda
   */
  async delete(id) {
    const { error } = await window.sb
      .from('agenda')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting agenda:', error);
      return { success: false, error: error.message };
    }
    return { success: true };
  },

  /**
   * Format tanggal Indonesia
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
   * Get status label + auto-detect upcoming/past
   */
  getComputedStatus(agenda) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const eventDate = new Date(agenda.tanggal);
    
    if (eventDate < today) return 'past';
    return 'upcoming';
  }
};

window.Agenda = Agenda;