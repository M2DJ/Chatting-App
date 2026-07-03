import type { ChatRoomProps } from "../interfaces/ComponentsInterface"

const ChatRoom = ({ room, onClick }: ChatRoomProps) => {
  return (
    <div className="h-screen">
      {onClick && <div onClick={onClick}>on click function</div>}
      <p>Hello</p>
    </div>
  )
}

export default ChatRoom