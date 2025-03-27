import ChatRoomModal from '@/components/CommunityPage/ChatRoomModal'
import MapView from '@/components/CommunityPage/MapView'
import Sidebar from '@/components/CommunityPage/Sidebar'
import { useState } from 'react'

const CommunityPage = () => {
  // 모달 열림 여부 상태
  const [chatOpen, setChatOpen] = useState(false)

  return (
    <div className="relative flex h-full min-w-[1440px]">
      {/* 사이드바 - 고정 너비 */}
      <div className="w-[302px]">
        <Sidebar onChatOpen={() => setChatOpen(true)} />
      </div>

      {/* 지도 */}
      <MapView onChatOpen={() => setChatOpen(true)} />

      {/* 채팅방 모달 - 지도 오른쪽에 덮어지게 absolute 위치 */}
      {chatOpen && (
        <div className="absolute top-0 left-[302px] right-10 h-full bottom-0 z-10 bg-ssaeng-gray-3 border-l">
          <ChatRoomModal onClose={() => setChatOpen(false)} />
        </div>
      )}
    </div>
  )
}

export default CommunityPage
