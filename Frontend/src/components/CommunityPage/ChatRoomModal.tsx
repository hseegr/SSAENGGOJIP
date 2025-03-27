// components/community/ChatRoomModal.tsx

import { useState } from 'react'
import ChatHeader from './ChatHeader'
import ChatMessageList from './ChatMessageList'
import ChatInput from './ChatInput'

// 메시지 타입 정의
type Message = {
  id: number // 고유 ID (key용)
  nickname: string // 닉네임 (예: 익명의 짱구)
  content: string // 메시지 내용
  time: string // 보낸 시간
  isMe: boolean // 내가 보낸 메시지 여부
}

// props: 채팅방 닫기 기능을 위한 onClose 함수
type Props = {
  onClose: () => void
}

const ChatRoomModal = ({ onClose }: Props) => {
  // 더미 메시지 상태 (초기 채팅 메시지들)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      nickname: '익명의 짱구',
      content: '출근하기 싫어~~~~~',
      time: '오전 08:14',
      isMe: false,
    },
    {
      id: 2,
      nickname: '익명의 철수',
      content: '지각이다아아',
      time: '오전 08:15',
      isMe: true,
    },
    {
      id: 3,
      nickname: '익명의 유리',
      content: '오늘 날씨 진짜 좋다 ☀️\n근데 지하철 넘 사람 많아 ㅠ',
      time: '오전 08:16',
      isMe: false,
    },
    {
      id: 4,
      nickname: '익명의 철수',
      content: 'ㅋㅋㅋㅋ 사람에 치인다 진짜',
      time: '오전 08:17',
      isMe: true,
    },
    {
      id: 5,
      nickname: '익명의 훈이',
      content:
        '혹시 9호선 급행 탈 때 사람 좀 덜 타는 시간대 아시는 분 있나요?\n처음 이용해봐서요!',
      time: '오전 08:18',
      isMe: false,
    },
  ])

  // 입력값 상태
  const [input, setInput] = useState('')

  // '익명으로 보내기' 체크 상태
  const [isAnonymous, setIsAnonymous] = useState(true)

  // 메시지 전송 핸들러
  const handleSend = () => {
    if (!input.trim()) return // 공백 메시지는 무시

    // 익명 여부에 따른 닉네임 설정
    const nickname = isAnonymous ? '익명의 철수' : '홍길동' // 실제 닉네임은 사용자 정보에서 받아야 함

    // 새로운 메시지 객체 생성
    const newMessage: Message = {
      id: Date.now(), // 임시 고유 ID (숫자형 timestamp)
      nickname,
      content: input,
      time: new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      }), // HH:MM 형식
      isMe: true,
    }

    // 메시지 목록에 추가
    setMessages((prev) => [...prev, newMessage])

    // 입력창 초기화
    setInput('')
  }

  return (
    // 전체 채팅방 컨테이너 (모달로 오른쪽에 뜬다고 가정)
    <div className="flex flex-col justify-between w-full h-full bg-ssaeng-gray-3 px-10">
      {/* 채팅방 상단 헤더 - flex-shrink-0으로 고정 크기 유지 */}
      <div className="flex-shrink-0">
        <ChatHeader onClose={onClose} />
      </div>

      {/* 메시지 리스트 (스크롤 가능한 영역) */}
      <div className="flex-1 overflow-y-auto mb-4">
        <ChatMessageList messages={messages} />
      </div>

      {/* 입력창 - 항상 보이도록 하단에 고정 */}
      <div className="flex-shrink-0 bg-ssaeng-gray-3 py-3 sticky bottom-0">
        <ChatInput
          input={input}
          setInput={setInput}
          isAnonymous={isAnonymous}
          setIsAnonymous={setIsAnonymous}
          onSend={handleSend}
        />
      </div>
    </div>
  )
}

export default ChatRoomModal
