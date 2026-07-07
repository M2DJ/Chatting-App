import { data } from "react-router-dom";
import { supabase } from "./SupabaseClient";

class ChannelService {
  async lookUpUsers(userName: string) {
    const isEmail = userName.includes("@");

    try {
      const { data, error } = await supabase
        .from("UsersPublic")
        .select("user_email, user_name")
        .ilike(isEmail ? "user_email" : "user_name", `%${userName}%`);

      if (error) {
        return { success: false, data: null, error: error.message };
      }

      return { success: true, data: data, error: null };
    } catch (e: any) {
      console.error("Error looking up user: ", e);
      return { success: false, data: null, error: e.message };
    }
  }

  //This function takes the user id from Supabase
  async createRoom(roomCreator: string, roomName?: string) {
    try {
      const { data, error } = await supabase
        .from("Rooms")
        .insert({
          channel_creator: roomCreator,
          channel_name: roomName ?? null,
        })
        .select();

      if (error) {
        console.log("Error occured: ", error.message);
        return { success: false, data: null, error: error.message };
      }

      return { success: true, data: data, error: null };
    } catch (e) {
      console.error("Error occured while creating room: ", e);
      return { success: false, data: null, error: e };
    }
  }

  async addRoomParticipant(userId: string, channelId: string) {
    try {
      const { error } = await supabase.from("RoomParticipants").insert({
        user_id: userId,
        channel_id: channelId,
      });

      if (error) {
        console.log("Error occured: ", error.message);
        return { success: false, data: null, error: error.message };
      }

      return { success: true, data: null, error: null };
    } catch (e) {
      console.log("Error occured while adding room participant: ", e);
      return { success: false, data: null, error: e };
    }
  }

  async saveMessage(channelId: string, senderId: string, message: string) {
    try {
      const { error } = await supabase.from("ChatMessages").insert({
        channel_id: channelId,
        sender_id: senderId,
        message: message,
      });

      if (error) {
        console.log("Error occured: ", error.message);
        return { success: false, data: null, error: error.message };
      }

      return { success: true, data: null, error: null };
    } catch (e) {
      console.error("Error occured saving message: ", e);
      return { success: false, data: null, error: e };
    }
  }
}

export const channelService = new ChannelService();
