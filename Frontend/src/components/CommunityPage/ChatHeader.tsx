import { ArrowLeft, MoreVertical } from 'lucide-react'
import { useState } from 'react'
import ChatExitMenu from './ChatExitMenu'

type Props = {
  onClose: () => void
}

const ChatHeader = ({ onClose }: Props) => {
  const [showMenu, setShowMenu] = useState(false)

  return (
    <div className="relative overflow-visible flex items-center justify-between py-6">
      {/* 뒤로가기 */}
      <div>
        <button onClick={onClose} className="p-1">
          <ArrowLeft size={20} />
        </button>
      </div>

      {/* 공지 */}
      <div className="flex-1 mx-4 text-xs py-3 px-3 bg-[#E3FAA8] text-gray-500 rounded-full text-center">
        지역 주민과 관심 있는 분들이 함께하는 공간, 서로 존중하며 따뜻하게
        소통해요 😊
      </div>

      {/* 점 3개 나가기 버튼 */}
      <div className="relative">
        <button onClick={() => setShowMenu((prev) => !prev)} className="p-1">
          <MoreVertical size={20} />
        </button>

        {/* 드롭다운 메뉴 */}
        {showMenu && (
          <ChatExitMenu
            onLeave={() => {
              setShowMenu(false) // 메뉴 닫기
              onClose() // 채팅방 나가기 처리
            }}
          />
        )}
      </div>
    </div>
  )
}

export default ChatHeader
