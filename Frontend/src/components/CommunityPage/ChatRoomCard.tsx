import { ChatRoom } from '@/types/community'

interface Props {
  chatRoom: ChatRoom
  onClick?: (room: ChatRoom) => void
}

const ChatRoomCard = ({ chatRoom, onClick }: Props) => {
  return (
    <div className="mt-6">
      <li
        className="flex flex-col p-3 rounded-lg bg-white border border-ssaeng-gray-1 cursor-pointer w-64 hover:bg-ssaeng-gray-3"
        onClick={() => onClick?.(chatRoom)}
      >
        <div className="text-sm text-gray-600 font-semibold">
          🚉 {chatRoom.name}
        </div>
        <div className="flex justify-end text-xs text-gray-300 font-light">
          {chatRoom.userCount}명 참여중
        </div>
      </li>
    </div>
  )
}

export default ChatRoomCard
