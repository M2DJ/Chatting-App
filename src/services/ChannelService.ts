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
    roomCreatorEmail: string,
    participantId: string,
    participantEmail: string,
    senderId: string,
    message: string,
    roomCreaterName?: string,
    roomName?: string,
  ) {
    try {
      const { data: createdRoom, error } = await supabase
        .from("Rooms")
        .insert({
          channel_creater: roomCreator,
          channel_name: roomName ?? null,
          channel_creater_email: roomCreatorEmail,
          channel_creater_name: roomCreaterName ?? null,
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

      //#3 Merge both sets and remove duplicates
      const createdIds = createdRooms.map((r) => r.channel_id);
      const participatedIds = participatedRooms.map((r) => r.channel_id);
      const channelIds = [...new Set([...createdIds, ...participatedIds])];

      if (channelIds.length === 0) {
        return { success: true, data: [], error: null };
      }

      //#4 Fetch other participants for all rooms (excluding current user)
      const { data: roomParticipants, error: roomParticipantError } =
        await supabase
          .from("RoomParticipants")
          .select("channel_id, user_id, user_email, user_name")
          .in("channel_id", channelIds)
          .neq("user_id", userId);

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

      //#5 Fetch room creator info for rooms the current user didn't create
      const { data: roomCreators, error: roomCreatorsError } = await supabase
        .from("Rooms")
        .select(
          "channel_id, channel_creater, channel_creater_name, channel_creater_email",
        )
        .in("channel_id", channelIds)
        .neq("channel_creater", userId);

      if (roomCreatorsError) {
        console.log(
          "Error fetching room creators info: ",
          roomCreatorsError.message,
        );
        return { success: false, data: null, error: roomCreatorsError.message };
      }

      //#6 Fetch last messages for all rooms
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

      //#7 Put everything together
      const data = channelIds.map((channelId) => {
        // Check if there are other participants in this room (excluding current user)
        const otherParticipants = roomParticipants.filter(
          (p) => p.channel_id === channelId,
        );

        // Check if there's a creator for this room (only exists for rooms current user didn't create)
        const roomCreator = roomCreators.find(
          (c) => c.channel_id === channelId,
        );

        // Determine who the "other person" is:
        // - If there are other participants → use the first one (rooms current user created)
        // - If no other participants but there's a creator → use the creator (rooms current user joined)
        // - Otherwise → null (edge case, no other person found)
        const otherPerson =
          otherParticipants.length > 0
            ? {
                user_id: otherParticipants[0].user_id,
                user_name: otherParticipants[0].user_name,
                user_email: otherParticipants[0].user_email,
              }
            : roomCreator
              ? {
                  user_id: roomCreator.channel_creater,
                  user_name: roomCreator.channel_creater_name,
                  user_email: roomCreator.channel_creater_email,
                }
              : null;

        return {
          channel_id: channelId,
          otherPerson,
          participants: otherParticipants,
          lastMessage:
            lastMessages.find((m) => m.channel_id === channelId)?.message ??
            null,
          lastMessageTime:
            lastMessages.find((m) => m.channel_id === channelId)?.sent_at ??
            null,
        };
      });

      return { success: true, data, error: null };
    } catch (e) {
      console.error("Error occurred while fetching rooms: ", e);
      return { success: false, data: null, error: e };
    }
  }
}

export const channelService = new ChannelService();
