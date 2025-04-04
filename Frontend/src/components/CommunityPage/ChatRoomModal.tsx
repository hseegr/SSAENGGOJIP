import { useEffect, useState, useRef } from 'react'
import ChatHeader from './ChatHeader'
import ChatMessageList from './ChatMessageList'
import ChatInput from './ChatInput'
import { useCommunityStore } from '@/store/communityStore'
import { fetchChatMessages } from '@/services/communityService'
import { getUserInfo } from '@/services/userService'
import { useChatSocket } from '@/hooks/useChatSocket'

// 메시지 타입 정의
type Message = {
  id: string // 고유 ID (key용)
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
  // ✅ WebSocket 전송 함수
  const { connect, sendMessage } = useChatSocket()

  const selectedChatRoom = useCommunityStore((s) => s.selectedChatRoom)

  const [messages, setMessages] = useState<Message[]>([])

  // 스크롤 관련 ref와 상태
  const messageListRef = useRef<HTMLDivElement>(null)

  // 입력값 상태
  const [input, setInput] = useState('')

  // '익명으로 보내기' 체크 상태
  const [isAnonymous, setIsAnonymous] = useState(true)

  // 사용자 닉네임 저장
  const [myNickname, setMyNickname] = useState<string>('')

  // ✅ 로그인한 사용자 ID (로컬에서 가져옴)
  const myUserId = Number(localStorage.getItem('userId'))
  const token = localStorage.getItem('accessToken')!

  // 스크롤을 맨 아래로 이동하는 함수
  const scrollToBottom = () => {
    if (messageListRef.current) {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight
    }
  }

  // ✅ 내 닉네임 불러오기 (한 번만 실행)
  useEffect(() => {
    const fetchNickname = async () => {
      try {
        const res = await getUserInfo()
        setMyNickname(res.nickname)

        // ✅ 이 부분에서 userId도 저장할 수 있습니다 (필요하다면)
        // localStorage.setItem('userId', res.userId)
      } catch (err) {
        console.error('❌ 닉네임 불러오기 실패:', err)
      }
    }

    fetchNickname()
  }, [])

  // ✅ 이전 메시지 불러오기
  useEffect(() => {
    const fetchMessages = async () => {
      if (!selectedChatRoom) return

      try {
        console.log('채팅방 메시지 불러오기:', selectedChatRoom.id)
        const result = await fetchChatMessages(String(selectedChatRoom.id))
        console.log('서버 응답 원본:', result)

        // 메시지 객체 생성
        const parsed = result.map((msg: any) => ({
          id: msg.id,
          nickname: msg.nickname, // 익명 포함
          content: msg.isActive ? msg.content : '삭제된 메시지입니다.',
          time: new Date(msg.createdAt).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          }),
          isMe: Number(msg.userId) === myUserId, // ✅ 명시적으로 숫자 변환해서 비교
        }))

        // ⭐️ 명시적으로 reverse()를 사용하여 순서를 반대로 변경
        // 최신 메시지가 아래로 가도록 순서 변경
        const reversedMessages = [...parsed].reverse()
        console.log('변환된 메시지:', reversedMessages)

        setMessages(reversedMessages)

        // 메시지 로드 후 스크롤을 아래로 이동
        setTimeout(scrollToBottom, 100)
      } catch (err) {
        console.error('❌ 메시지 불러오기 실패:', err)
      }
    }

    fetchMessages()
  }, [selectedChatRoom, myUserId])

  // ✅ WebSocket 메시지 수신 처리
  useEffect(() => {
    if (!selectedChatRoom || !token) return

    connect({
      chatRoomId: selectedChatRoom.id,
      token,
      onMessage: (msg) => {
        console.log('수신된 메시지:', msg)

        if (msg.messageType === 'TALK') {
          // 받은 메시지를 상태에 추가
          const newMsg: Message = {
            id: msg.id || Date.now().toString(), // ID가 없으면 타임스탬프 사용
            nickname: msg.nickname,
            content:
              msg.isActive !== false ? msg.content : '삭제된 메시지입니다.',
            time: new Date().toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            }),
            isMe: Number(msg.userId) === myUserId, // ✅ 명시적으로 숫자 변환
          }

          setMessages((prev) => {
            // 이미 존재하는 메시지인지 확인 (중복 방지)
            const exists = prev.some((m) => m.id === newMsg.id)
            if (exists) return prev

            // 새 메시지 추가 (최신 메시지는 배열 끝에 추가)
            return [...prev, newMsg]
          })

          // 새 메시지가 추가되면 스크롤을 아래로 이동
          setTimeout(scrollToBottom, 100)
        }
      },
    })
  }, [selectedChatRoom, myUserId])

  // 메시지 전송 핸들러
  const handleSend = () => {
    if (!input.trim() || !selectedChatRoom) return // 공백 메시지는 무시

    // 익명 여부에 따른 닉네임 설정
    const nickname = isAnonymous ? '익명' : myNickname

    // 웹소켓으로 메시지 전송
    sendMessage({
      messageType: 'TALK',
      chatRoomId: String(selectedChatRoom.id),
      isAnonymous: isAnonymous,
      content: input,
    })

    console.log('📤 전송 요청 보냄:', input)

    // ✅ 즉시 UI에 반영하기 위해 로컬 상태 업데이트
    const newMessage: Message = {
      id: Date.now().toString(), // 임시 ID (서버에서 실제 ID 부여됨)
      nickname: nickname,
      content: input,
      time: new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      }),
      isMe: true, // 내가 보낸 메시지
    }

    // 새 메시지 추가 (최신 메시지는 배열의 끝에 추가)
    setMessages((prev) => [...prev, newMessage])

    // 입력창 초기화
    setInput('')

    // 스크롤을 아래로 이동
    setTimeout(scrollToBottom, 100)
  }

  return (
    // 전체 채팅방 컨테이너 (모달로 오른쪽에 뜬다고 가정)
    <div className="flex flex-col justify-between w-full h-full bg-ssaeng-gray-3 px-10">
      {/* 채팅방 상단 헤더 - flex-shrink-0으로 고정 크기 유지 */}
      <div className="flex-shrink-0">
        <ChatHeader onClose={onClose} />
      </div>

      {/* 메시지 리스트 (스크롤 가능한 영역) - ref 추가 */}
      <div className="flex-1 overflow-y-auto mb-4" ref={messageListRef}>
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
