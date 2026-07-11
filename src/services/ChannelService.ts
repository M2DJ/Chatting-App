import { supabase } from "./SupabaseClient";

class ChannelService {
  async lookUpUsers(userName: string) {
    const isEmail = userName.includes("@");

    try {
      const { data, error } = await supabase
        .from("UsersPublic")
        .select("user_id, user_email, user_name")
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

  private async addRoomParticipant(
    userId: string,
    userEmail: string,
    channelId: string,
    userName?: string,
  ) {
    try {
      const { error } = await supabase.from("RoomParticipants").insert({
        user_id: userId,
        channel_id: channelId,
        user_email: userEmail,
        user_name: userName ?? null,
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

  //This function takes the user id from Supabase
  async createRoom(
    roomCreator: string,
    participantId: string,
    participantEmail: string,
    senderId: string,
    message: string,
    roomName?: string,
  ) {
    try {
      const { data: createdRoom, error } = await supabase
        .from("Rooms")
        .insert({
          channel_creater: roomCreator,
          channel_name: roomName ?? null,
        })
        .select();

      if (error) {
        console.log("Error occured: ", error.message);
        return { success: false, data: null, error: error.message };
      } else {
        try {
          const { error: roomParticipantError } = await this.addRoomParticipant(
            participantId,
            participantEmail,
            createdRoom![0].channel_id,
          );

          if (roomParticipantError) {
            console.log("Error occured: ", roomParticipantError);
            return { success: false, data: null, error: roomParticipantError };
          }

          try {
            const { error: saveFirstMessageError } = await this.saveMessage(
              createdRoom[0].channel_id,
              senderId,
              message,
            );

            if (saveFirstMessageError) {
              console.log("Error occured: ", saveFirstMessageError);
              return {
                success: false,
                data: null,
                error: saveFirstMessageError,
              };
            }
          } catch (e) {
            console.error(
              'Error saving first message in "ChatMessages" table: ',
              e,
            );
            return { success: false, data: null, error: e };
          }

          return { success: true, data: null, error: null };
        } catch (e) {
          console.error('Error adding user to "RoomParticipants" table: ', e);
          return { success: false, data: null, error: e };
        }
      }
    } catch (e) {
      console.error("Error occured while creating room: ", e);
      return { success: false, data: null, error: e };
    }
  }

  subscribeToRoomsTable(userId: string, onNewRoom: (payload: any) => void) {
    try {
      const subToRooms = supabase
        .channel("table_db_changes")
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "Rooms",
            filter: `channel_creater=eq.${userId}`,
          },
          (payload) => {
            onNewRoom(payload.new);
          },
        )
        .subscribe();

      return () => {
        supabase.removeChannel(subToRooms);
      };
    } catch (e) {
      console.error("Error subscribing to the 'Rooms' table: ", e);
      return () => {};
    }
  }

  async loadRooms(userId: string) {
    try {
      const { data: rooms, error: roomsFetchError } = await supabase
        .from("Rooms")
        .select("channel_id")
        .eq("channel_creater", userId);

      if (roomsFetchError) {
        console.log("Error fetching rooms: ", roomsFetchError.message);
        return { success: false, data: null, error: roomsFetchError.message };
      }

      const channelIds = rooms.map((room) => room.channel_id);

      const { data: roomParticipants, error: roomParticipantsError } =
        await supabase
          .from("RoomParticipants")
          .select("user_id, user_email, user_name")
          .in("channel_id", channelIds);

      if (roomParticipantsError) {
        console.log(
          "Error fetching room participants: ",
          roomParticipantsError.message,
        );

        return {
          success: false,
          data: null,
          error: roomParticipantsError.message,
        };
      }

      const data = rooms.map((room) => ({
        channel_id: room.channel_id,
        participants: roomParticipants.map((p) => ({
          user_id: p.user_id,
          user_email: p.user_email,
          user_name: p.user_name,
        })),
      }));

      return { success: true, data: data, error: null };
    } catch (e) {
      console.error("Error occured while fetching rooms: ", e);
      return { success: false, data: null, error: e };
    }
  }
}

export const channelService = new ChannelService();
