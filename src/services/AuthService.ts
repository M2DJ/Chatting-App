import { supabase } from "./SupabaseClient";

class SupabaseAuthService {
  async signUpWithEmail(email: string, password: string) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
      });

      if (error) throw error;

      return { success: true, data: data, error: null };
    } catch (e: any) {
      console.error("Error Signing up with email: ", e);
      return { success: false, data: null, error: e.message };
    }
  }

  async loginWithEmail(email: string, password: string) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (error) throw error;

      return { success: true, data: data, error: null };
    } catch (e: any) {
      console.error("Error logging in: ", e);
      return { success: false, data: null, error: e.message };
    }
  }

  async logout() {
    try {
      const { error } = await supabase.auth.signOut();

      if (error) throw error;

      return { success: true, data: null, error: null };
    } catch (e: any) {
      console.error("Error signing out: ", e);
      return { success: false, data: null, error: e.message };
    }
  }

  async sendPasswordResetEmail(email: string, redirectTo: string) {
    try {
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: redirectTo,
      });

      if (error) throw error;

      return { success: true, data: data, error: null };
    } catch (e: any) {
      console.error("Error sending reset email: ", e);
      return { success: false, data: null, error: e.message };
    }
  }

  async updateUserPassword(newPassword: string) {
    try {
      const { data, error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) throw error;

      return { success: true, data: data, error: null };
    } catch (e: any) {
      console.error("Error updating user password: ", e);
      return { success: false, data: null, error: e.message };
    }
  }
}

export const authService = new SupabaseAuthService();
