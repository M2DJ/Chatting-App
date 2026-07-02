export interface ChatCardProps{
    roomId: string;
    chatterAvatarURL: string,
    chatterName: string,
    chatterLastMessage: string,
    lastMessageTime: string //string for now
}

export interface ChatRoomProps{
    room: string;
}