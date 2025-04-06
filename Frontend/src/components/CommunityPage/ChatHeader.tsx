import { ArrowLeft, MoreVertical } from 'lucide-react'
import { useState } from 'react'
import ChatExitMenu from './ChatExitMenu'
import { useChatSocket } from '@/hooks/useChatSocket'
import { useCommunityStore } from '@/store/communityStore'

type Props = {
  onClose: () => void
}

const ChatHeader = ({ onClose }: Props) => {
  const [showMenu, setShowMenu] = useState(false)
  const { unsubscribe } = useChatSocket()
  const selectedChatRoom = useCommunityStore((s) => s.selectedChatRoom)

  // 🔁 뒤로가기 누르면 단순 구독 해제만 실행
  const handleBack = () => {
    if (selectedChatRoom) {
      console.log(
        `◀️ 뒤로가기: 채팅방 ${selectedChatRoom.id} 구독 해제 (UI만 닫음)`,
      )
      unsubscribe(String(selectedChatRoom.id))
    }
    onClose() // 채팅 모달 닫기
  }

  return (
    <div className="relative overflow-visible flex items-center justify-between py-6">
      {/* 뒤로가기 */}
      <div>
        <button onClick={handleBack} className="p-1">
          <ArrowLeft size={20} />
        </button>
      </div>

      {/* 공지 */}
      <div className="flex-1 mx-4 text-sm py-3 px-3 bg-[#E3FAA8] text-green-700 rounded-full text-center">
        지역 주민과 관심 있는 분들이 함께하는
        <span className="font-bold text-base text-[#242424] px-1">
          {selectedChatRoom?.name || ''}역
        </span>
        커뮤니티, 서로 존중하며 따뜻하게 소통해요 😊
      </div>

      {/* 점 3개 나가기 버튼 */}
      <div className="relative">
        <button onClick={() => setShowMenu((prev) => !prev)} className="p-1">
          <MoreVertical size={20} />
        </button>

        {/* 드롭다운 메뉴 */}
        {showMenu && selectedChatRoom && (
          <ChatExitMenu
            chatRoomId={selectedChatRoom.id}
            onLeave={() => {
              setShowMenu(false)
              onClose()
            }}
          />
        )}
      </div>
    </div>
  )
}

export default ChatHeader
