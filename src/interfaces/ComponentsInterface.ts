import type { SearchedUsers } from "./SupabaseInterface";

export interface Chats {
  channel_id: string;
  otherPerson: SearchedUsers | null;
  participants: SearchedUsers[];
  lastMessage: string;
  lastMessageTime: string;
}

export interface ChatCardProps {
  chatterAvatarURL: string | null;
  chatterName?: string | null;
  chatterEmail: string;
  chatterLastMessage: string;
  lastMessageTime: string; //string for now
}

export interface ChatCardSearchProps {
  userName: string;
}

export interface ChatRoomProps {
  onClick?: () => void;
  room: string;
  participant: SearchedUsers | undefined;
}

export interface MessagesProps {
  content: string;
  time: Date;
  isLoading: boolean;
}
