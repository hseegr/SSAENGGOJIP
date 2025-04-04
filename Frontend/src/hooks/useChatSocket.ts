import { Client, Subscription } from '@stomp/stompjs'

// WebSocket 클라이언트 객체 전역 선언
let stompClient: Client | null = null

// ✅ 여러 채팅방을 동시에 구독할 수 있도록 Map으로 구독 정보 저장
// key: chatRoomId, value: Subscription 객체
let subscriptions = new Map<string, Subscription>()

// connect 함수에 넘겨줘야 하는 값들 타입 정의
interface UseChatSocketProps {
  chatRoomId: string // 연결할 채팅방 ID
  token: string // JWT 인증 토큰
  onMessage?: (msg: any) => void // 서버로부터 메시지를 받을 때 실행할 콜백 함수
}

export const useChatSocket = () => {
  // ✅ WebSocket + STOMP 연결 시작 함수
  const connect = ({ chatRoomId, token, onMessage }: UseChatSocketProps) => {
    // stompClient가 아직 없으면 생성
    if (!stompClient) {
      stompClient = new Client({
        // WebSocket 연결 생성자 (SockJS 제거 후 기본 WebSocket 사용)
        webSocketFactory: () => {
          console.log('🧪 WebSocket 연결 시도')
          return new WebSocket(
            `wss://j12a406.p.ssafy.io/api/ws-chat?access-token=${token}`,
          )
        },

        reconnectDelay: 5000, // 재연결 딜레이 설정

        onConnect: () => {
          console.log('✅ WebSocket 연결 성공')

          // 연결이 성공하면 해당 채팅방에 대한 구독을 시작
          subscribe(chatRoomId, onMessage)
        },

        onStompError: (frame) => {
          console.error('❌ STOMP 에러:', frame)
        },

        onWebSocketError: (event) => {
          console.error('❌ WebSocket 연결 오류:', event)
        },
      })

      // WebSocket 연결 시작
      stompClient.activate()
    } else if (stompClient.connected) {
      // 이미 연결되어 있다면 즉시 구독 시작
      console.log(`🔄 채팅방 ${chatRoomId} 기존 연결 재사용하여 구독 시작`)
      subscribe(chatRoomId, onMessage)
    }
  }

  // ✅ 특정 채팅방에 대해 구독을 시작하는 함수
  const subscribe = (chatRoomId: string, onMessage?: (msg: any) => void) => {
    if (!stompClient || !stompClient.connected) {
      console.warn('⚠️ STOMP 클라이언트가 아직 연결되지 않았습니다.')
      return
    }

    // 이미 구독한 채팅방이라면 중복 구독 방지
    if (subscriptions.has(chatRoomId)) {
      console.log(`ℹ️ 이미 구독 중인 채팅방: ${chatRoomId}`)
      return
    }

    // STOMP 구독 시작
    const subscription = stompClient.subscribe(
      `/sub/chat-room.${chatRoomId}`,
      (message) => {
        const payload = JSON.parse(message.body)
        console.log('💬 메시지 수신:', payload)

        if (onMessage) onMessage(payload)
      },
    )

    subscriptions.set(chatRoomId, subscription)
    console.log(`📡 채팅방 ${chatRoomId} 구독 시작`)
  }

  // ✅ 특정 채팅방에 대한 구독만 해제 (뒤로가기, 일시 이탈 등)
  const unsubscribe = (chatRoomId: string) => {
    const subscription = subscriptions.get(chatRoomId)

    if (subscription) {
      subscription.unsubscribe()
      subscriptions.delete(chatRoomId)
      console.log(`📴 채팅방 ${chatRoomId} 구독 해제`)
    } else {
      console.log(`⚠️ 구독된 채팅방이 아닙니다: ${chatRoomId}`)
    }
  }

  // ✅ 전체 연결 해제 및 구독 정리 (로그아웃, 앱 종료 시)
  const disconnect = () => {
    // 모든 구독 해제
    for (const [chatRoomId, subscription] of subscriptions) {
      subscription.unsubscribe()
      console.log(`📴 채팅방 ${chatRoomId} 구독 해제`)
    }

    subscriptions.clear()

    // WebSocket 연결 종료
    if (stompClient) {
      stompClient.deactivate()
      stompClient = null
      console.log('🔌 WebSocket 연결 종료')
    }
  }

  // ✅ 메시지 전송
  const sendMessage = (payload: {
    messageType: 'TALK' | 'DELETE' // 수정도 추가 예정
    chatRoomId: string
    messageId?: string | null
    content?: string
  }) => {
    if (
      !stompClient ||
      !stompClient.connected ||
      typeof stompClient.publish !== 'function'
    ) {
      console.warn('🚫 WebSocket이 연결되지 않았습니다.')
      return
    }

    stompClient.publish({
      destination: '/pub/chat-messages',
      headers: {},
      body: JSON.stringify({
        messageType: payload.messageType,
        chatRoomId: payload.chatRoomId,
        messageId: payload.messageId ?? null,
        content: payload.content ?? '',
      }),
    })
  }

  return { connect, unsubscribe, disconnect, sendMessage }
}
