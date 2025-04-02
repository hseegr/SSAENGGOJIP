import { useChatSocket } from '@/hooks/useChatSocket'
import { useMyChatRoomQuery } from '@/hooks/useCommunity'
import { fetchLeaveChatRoom } from '@/services/communityService'

type Props = {
  chatRoomId: number
  onLeave: () => void
}

const ChatExitMenu = ({ chatRoomId, onLeave }: Props) => {
  const { unsubscribe } = useChatSocket()
  const { refetch: refetchMyChatRooms } = useMyChatRoomQuery()

  const handleLeave = async () => {
    // 1. 구독 해제
    unsubscribe(chatRoomId)

    try {
      // 2. 퇴장 API 호출
      await fetchLeaveChatRoom(chatRoomId)
      console.log('✅ 채팅방 퇴장 완료')
      // 퇴장 후 내 채팅방 목록 다시 불러오기
      await refetchMyChatRooms()
    } catch (err) {
      console.error('❌ 채팅방 퇴장 실패', err)
      alert('채팅방 퇴장에 실패했습니다.')
    }

    // 3. UI 정리
    onLeave()
  }

  return (
    <div className="absolute right-0 mt-2 w-32 bg-white border border-gray-100 rounded-lg z-10">
      <button
        onClick={handleLeave}
        className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-50"
      >
        채팅방 나가기
      </button>
    </div>
  )
}

export default ChatExitMenu
