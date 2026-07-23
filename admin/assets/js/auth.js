/* ═══════════════════════════════════════════════════════════════
   AUTHENTICATION MODULE - DEBUG VERSION
   ═══════════════════════════════════════════════════════════════ */

const Auth = {
  async login(email, password) {
    try {
      console.log('🔵 [Auth] Mulai login untuk:', email);
      
      const { data, error } = await window.sb.auth.signInWithPassword({
        email: email,
        password: password
      });

      console.log('🔵 [Auth] signInWithPassword result:', { data, error });

      if (error) {
        console.error('🔴 [Auth] Sign in error:', error);
        return { success: false, error: this.translateError(error.message) };
      }

      console.log('🟢 [Auth] Login auth sukses, user ID:', data.user.id);
      console.log('🔵 [Auth] Query admins table...');

      // Verify user terdaftar di table `admins`
      const adminQuery = await window.sb
        .from('admins')
        .select('*')
        .eq('id', data.user.id)
        .single();

      console.log('🔵 [Auth] Admin query result:', adminQuery);

      if (adminQuery.error) {
        console.error('🔴 [Auth] Admin query ERROR:', adminQuery.error);
        console.error('🔴 [Auth] Error code:', adminQuery.error.code);
        console.error('🔴 [Auth] Error message:', adminQuery.error.message);
        console.error('🔴 [Auth] Error details:', adminQuery.error.details);
      }

      if (!adminQuery.data) {
        console.error('🔴 [Auth] Admin data KOSONG');
      }

      if (adminQuery.error || !adminQuery.data) {
        await window.sb.auth.signOut();
        return { success: false, error: 'Email ini tidak terdaftar sebagai admin.' };
      }

      console.log('🟢 [Auth] Admin verified:', adminQuery.data);
      return { success: true, user: data.user, admin: adminQuery.data };
    } catch (err) {
      console.error('🔴 [Auth] Exception:', err);
      return { success: false, error: 'Terjadi kesalahan. Coba lagi.' };
    }
  },

  async logout() {
    await window.sb.auth.signOut();
    window.location.href = '/admin/login.html';
  },

  async getSession() {
    const { data } = await window.sb.auth.getSession();
    return data.session;
  },

  async getCurrentUser() {
    const session = await this.getSession();
    if (!session) return null;
    return session.user;
  },

  async getAdminInfo() {
    const user = await this.getCurrentUser();
    if (!user) return null;

    const { data, error } = await window.sb
      .from('admins')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error) return null;
    return data;
  },

  async requireAuth() {
    const session = await this.getSession();
    if (!session) {
      window.location.href = '/admin/login.html';
      return false;
    }

    const admin = await this.getAdminInfo();
    if (!admin) {
      await this.logout();
      return false;
    }

    return true;
  },

  translateError(msg) {
    const translations = {
      'Invalid login credentials': 'Email atau password salah.',
      'Email not confirmed': 'Email belum dikonfirmasi.',
      'User not found': 'Email tidak ditemukan.'
    };
    return translations[msg] || 'Login gagal: ' + msg;
  }
};

window.Auth = Auth;