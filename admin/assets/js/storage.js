/* ═══════════════════════════════════════════════════════════════
   SUPABASE STORAGE MODULE - UPLOAD FOTO
   ═══════════════════════════════════════════════════════════════ */

const Storage = {
  // Konfigurasi
  BUCKET_NAME: 'foto-berita',
  MAX_SIZE_MB: 3,
  ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/webp'],

  /**
   * Validate file sebelum upload
   * @param {File} file - File object dari input
   * @returns {{valid: boolean, error?: string}}
   */
  validateFile(file) {
    if (!file) {
      return { valid: false, error: 'Tidak ada file dipilih.' };
    }

    // Cek tipe file
    if (!this.ALLOWED_TYPES.includes(file.type)) {
      return { 
        valid: false, 
        error: 'Format file harus JPG, PNG, atau WebP.' 
      };
    }

    // Cek ukuran (dalam bytes)
    const maxBytes = this.MAX_SIZE_MB * 1024 * 1024;
    if (file.size > maxBytes) {
      const sizeMB = (file.size / 1024 / 1024).toFixed(2);
      return { 
        valid: false, 
        error: `Ukuran file ${sizeMB} MB terlalu besar. Maksimal ${this.MAX_SIZE_MB} MB.` 
      };
    }

    return { valid: true };
  },

  /**
   * Generate nama file unique
   * "IMG_2734.jpg" → "berita-1721735432891-a3f2.jpg"
   */
  generateFileName(originalFile) {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 6);
    
    // Extract ekstensi
    const parts = originalFile.name.split('.');
    const ext = parts[parts.length - 1].toLowerCase();
    
    return `berita-${timestamp}-${random}.${ext}`;
  },

  /**
   * Upload file ke Supabase Storage
   * @returns {Promise<{success, url?, error?}>}
   */
  async uploadFoto(file) {
    // Validate dulu
    const validation = this.validateFile(file);
    if (!validation.valid) {
      return { success: false, error: validation.error };
    }

    try {
      const fileName = this.generateFileName(file);

      // Upload ke bucket
      const { data, error } = await window.sb.storage
        .from(this.BUCKET_NAME)
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        console.error('Storage upload error:', error);
        return { success: false, error: error.message };
      }

      // Get public URL
      const { data: urlData } = window.sb.storage
        .from(this.BUCKET_NAME)
        .getPublicUrl(fileName);

      return { 
        success: true, 
        url: urlData.publicUrl,
        fileName: fileName
      };
    } catch (err) {
      console.error('Upload exception:', err);
      return { success: false, error: 'Gagal upload: ' + err.message };
    }
  },

  /**
   * Delete foto dari Storage
   * @param {string} url - Public URL yang mau di-hapus
   */
  async deleteFoto(url) {
    if (!url) return { success: true }; // Ga ada url = ga usah delete

    try {
      // Extract fileName dari public URL
      // URL format: https://xxx.supabase.co/storage/v1/object/public/foto-berita/berita-xxx.jpg
      const urlParts = url.split('/');
      const fileName = urlParts[urlParts.length - 1];

      const { error } = await window.sb.storage
        .from(this.BUCKET_NAME)
        .remove([fileName]);

      if (error) {
        console.error('Storage delete error:', error);
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (err) {
      console.error('Delete exception:', err);
      return { success: false, error: err.message };
    }
  }
};

window.Storage = Storage;