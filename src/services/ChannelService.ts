import { supabase } from "./SupabaseClient";

class ChannelService {
  async lookUpUsers(userName: string) {
    const isEmail = userName.includes("@") && userName.includes('.');

    try {
      const { data, error } = await supabase
        .from("usersPublic")
        .select("user_email, user_name")
        .ilike(isEmail ? "user_email" : "user_name", `%${userName}%`);

        if(error) {
            return { success: false, data: null, error: error.message };
        }

        return { success: true, data: data, error: null };
    } catch (e: any) {
        console.error('Error looking up user: ', e);
        return { success: false, data: null, error: e.message };
    }
  }
}

export const channelService = new ChannelService();
