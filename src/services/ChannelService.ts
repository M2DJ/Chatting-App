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
      //#1 Fetch the rooms the user has created
      const { data: createdRooms, error: roomsFetchError } = await supabase
        .from("Rooms")
        .select("channel_id")
        .eq("channel_creater", userId);

      if (roomsFetchError) {
        console.log("Error fetching rooms: ", roomsFetchError.message);
        return { success: false, data: null, error: roomsFetchError.message };
      }

      //#2 Fetch the rooms the user is a participant in
      const { data: participatedRooms, error: participatedRoomsError } =
        await supabase
          .from("RoomParticipants")
          .select("channel_id")
          .eq("user_id", userId);

      if (participatedRoomsError) {
        console.log(
          "Error fetching participated rooms: ",
          participatedRoomsError.message,
        );
        return {
          success: false,
          data: null,
          error: participatedRoomsError.message,
        };
      }

      //#3 merging both sets and removing duplication
      const createdIds = createdRooms.map((r) => r.channel_id);
      const participatedIds = participatedRooms.map((r) => r.channel_id);
      const channelIds = [...new Set([...createdIds, ...participatedIds])];

      if (channelIds.length === 0) {
        return { success: true, data: [], error: null };
      }

      //#4 Fetch participants for the rooms
      const { data: roomParticipants, error: roomParticipantError } =
        await supabase
          .from("RoomParticipants")
          .select("channel_id, user_id, user_email, user_name")
          .in("channel_id", channelIds);

      if (roomParticipantError) {
        console.log(
          "Error fetching room participants: ",
          roomParticipantError.message,
        );
        return {
          success: false,
          data: null,
          error: roomParticipantError.message,
        };
      }

      //#5 Fetch the last messages for all the rooms fetched
      const { data: lastMessages, error: lastMessagesError } = await supabase
        .from("ChatMessages")
        .select("channel_id, message, sent_at")
        .in("channel_id", channelIds)
        .order("sent_at", { ascending: false });

      if (lastMessagesError) {
        console.log(
          "Error fetching last messages: ",
          lastMessagesError.message,
        );
        return { success: false, data: null, error: lastMessagesError.message };
      }

      //#6 put everything together in an array
      const data = channelIds.map((channelId) => ({
        channel_id: channelId,
        participants: roomParticipants.filter(p => p.channel_id === channelId),
        lastMessage: lastMessages.find(m => m.channel_id === channelId)?.message ?? null,
        lastMessageTime: lastMessages.find(m => m.channel_id === channelId)?.sent_at ?? null
      }));

      return { success: true, data: data, error: null}
    } catch (e) {
      console.error("Error occured while fetching rooms: ", e);
      return { success: false, data: null, error: e };
    }
  }
}

export const channelService = new ChannelService();
