import { ChatRoom } from '@/types/community'

interface Props {
  chatRoom: ChatRoom
  onClick?: (room: ChatRoom) => void
}

const ChatRoomCard = ({ chatRoom, onClick }: Props) => {
  // 최대 16자까지 보여주고 초과 시 '...' 붙이기
  const MAX_LENGTH = 16
  const trimmedMessage =
    chatRoom.lastMessage && chatRoom.lastMessage.length > MAX_LENGTH
      ? chatRoom.lastMessage.slice(0, MAX_LENGTH) + '...'
      : chatRoom.lastMessage

  return (
    <div className="mt-6">
      <li
        className="flex flex-col p-3 rounded-lg bg-white border border-ssaeng-gray-1 cursor-pointer w-64 hover:bg-ssaeng-gray-3"
        onClick={() => onClick?.(chatRoom)}
      >
        <div className="text-sm text-gray-600 font-semibold">
          🚉 {chatRoom.name}역
        </div>

        {/* 최근 메시지 (16자까지 + 말줄임) */}
        <div className="mt-1 text-xs text-gray-300 truncate whitespace-nowrap overflow-hidden">
          {trimmedMessage || '아직 메시지가 없습니다.'}
        </div>

        <div className="flex justify-end text-xs text-gray-300 font-light">
          {chatRoom.userCount}명 참여중
        </div>
      </li>
    </div>
  )
}

export default ChatRoomCard
