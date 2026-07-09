import type { SearchedUsers } from "./SupabaseInterface";

export interface ChatCardProps{
    roomId: string;
    chatterAvatarURL: string;
    chatterName: string;
    chatterLastMessage: string;
    lastMessageTime: string; //string for now
}

export interface ChatCardSearchProps{
    userName: string;
}

export interface ChatRoomProps{
    onClick?: () => void;
    room: string;
    participant: SearchedUsers | undefined;
}

export interface MessagesProps{
    content: string;
    time: Date;
    isLoading: boolean;
}