import ChatRoomModal from '@/components/CommunityPage/ChatRoomModal'
import MapView from '@/components/CommunityPage/MapView'
import Sidebar from '@/components/CommunityPage/Sidebar'
import { useState } from 'react'

const CommunityPage = () => {
  // 모달 열림 여부 상태
  const [chatOpen, setChatOpen] = useState(false)
  const [forceMyTab, setForceMyTab] = useState(false) // ✅ Sidebar에 전달할 상태

  return (
    <div className="relative flex h-full min-w-[1440px] px-10">
      {/* 사이드바 - 고정 너비 */}
      <div className="w-[302px]">
        <Sidebar
          onChatOpen={() => {
            setForceMyTab(true) // ✅ 모달 열기 전에 탭 전환 플래그 true로
            setChatOpen(true)
          }}
          forceMyTab={forceMyTab} // ✅ props로 전달
        />
      </div>

      {/* 지도 */}
      <div>
        <MapView
          onChatOpen={() => {
            setForceMyTab(true)
            setChatOpen(true)
          }}
        />
      </div>

      {/* 채팅방 모달 - 지도 오른쪽에 덮어지게 absolute 위치 */}
      {chatOpen && (
        <div className="absolute top-0 left-[341px] right-0 h-full bottom-0 z-10 bg-ssaeng-gray-3 border-l">
          <ChatRoomModal
            onClose={() => {
              setChatOpen(false)
              setForceMyTab(false) // ✅ 다시 초기화
            }}
          />
        </div>
      )}
    </div>
  )
}

export default CommunityPage
