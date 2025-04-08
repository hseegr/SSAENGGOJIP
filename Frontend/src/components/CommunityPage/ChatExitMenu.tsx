import { useChatSocket } from '@/hooks/useChatSocket'
import { useMyChatRoomQuery } from '@/hooks/useCommunity'
import { fetchLeaveChatRoom } from '@/services/communityService'
import axios from 'axios'

type Props = {
  chatRoomId: number
  onLeave: () => void
}

const ChatExitMenu = ({ chatRoomId, onLeave }: Props) => {
  const { unsubscribe } = useChatSocket()
  const { refetch: refetchMyChatRooms } = useMyChatRoomQuery()

  const handleLeave = async () => {
    // 1. 구독 해제
    console.log(`🚪 채팅방 ${chatRoomId} 퇴장 시작`)
    unsubscribe(chatRoomId)
    console.log(`🔌 채팅방 ${chatRoomId} 웹소켓 구독 해제 완료`)

    try {
      // 2. 퇴장 API 호출
      await fetchLeaveChatRoom(chatRoomId)
      console.log(`✅ 채팅방 ${chatRoomId} 퇴장 API 호출 성공`)
      // 퇴장 후 내 채팅방 목록 다시 불러오기
      await refetchMyChatRooms()
    } catch (err) {
      console.error('❌ 채팅방 퇴장 실패', err)

      // 오류 세부 정보 확인
      if (axios.isAxiosError(err)) {
        console.error('상태 코드:', err.response?.status)
        console.error('오류 데이터:', err.response?.data)
      }

      alert('채팅방 퇴장에 실패했습니다.')
    }
    console.log('퇴장 시도 중인 채팅방 ID:', chatRoomId, typeof chatRoomId)
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
