import { ChatRoom } from '@/types/community'
import { create } from 'zustand'

// 채팅 메시지 타입 정의
export interface ChatMessage {
  id: string
  chatRoomId: string
  userId: number
  nickname: string
  content: string
  isActive: boolean
  isAnonymous: boolean
  createdAt: string
  time?: string
  isMe: boolean
}

// 웹소켓으로 받은 메시지 타입
export interface ChatSocketMessage {
  id?: string
  messageType: 'TALK' | 'DELETE'
  chatRoomId: string
  userId: number | string
  nickname: string
  content: string
  isActive?: boolean
  isAnonymous?: boolean
  createdAt?: string
}

// Zustand 상태 구조 정의
interface CommunityState {
  // 지도에 마커로 표시할 채팅방 목록
  markerChatRooms: ChatRoom[]
  setMarkerChatRooms: (room: ChatRoom[]) => void

  // 선택된 채팅방 (오버레이용)
  selectedChatRoom: ChatRoom | null
  setSelectedChatRoom: (room: ChatRoom | null) => void

  // 내가 참여 중인 채팅방 목록
  myChatRooms: ChatRoom[]
  setMyChatRooms: (rooms: ChatRoom[]) => void

  // ✅ 마지막 메시지를 갱신하는 함수
  updateLastMessage: (chatRoomId: string, message: string) => void

  // 참여하기 버튼 눌렀는지 여부
  shouldConnect: boolean
  setShouldConnect: (val: boolean) => void

  // 채팅 메시지 상태 (방별로 구분)
  chatMessages: Record<string, ChatMessage[]>
  addMessage: (chatRoomId: string, message: ChatMessage) => void
  setMessages: (chatRoomId: string, messages: ChatMessage[]) => void
  getMessagesForRoom: (chatRoomId: string) => ChatMessage[]
}

// Zustand 저장소 생성
export const useCommunityStore = create<CommunityState>((set, get) => ({
  // 초기값
  markerChatRooms: [],
  selectedChatRoom: null,
  myChatRooms: [],
  shouldConnect: false,
  chatMessages: {},

  // 지도에 표시할 마커 채팅방 목록 설정
  setMarkerChatRooms: (rooms) => set({ markerChatRooms: rooms }),

  // 선택된 채팅방 설정 (오버레이 or 모달용)
  setSelectedChatRoom: (room) => set({ selectedChatRoom: room }),

  // 내가 참여한 채팅방 리스트 설정
  setMyChatRooms: (rooms) => set({ myChatRooms: rooms }),

  // ✅ 채팅방 마지막 메시지 갱신 (채팅방 카드에 실시간 반영)
  updateLastMessage: (chatRoomId, message) =>
    set((state) => ({
      myChatRooms: state.myChatRooms.map((room) =>
        room.id === chatRoomId ? { ...room, lastMessage: message } : room,
      ),
    })),

  // 참여 버튼 누름 여부 플래그
  setShouldConnect: (val) => set({ shouldConnect: val }),

  // 채팅 메시지 추가 (중복 메시지 방지)
  addMessage: (chatRoomId, message) =>
    set((state) => {
      const roomMessages = state.chatMessages[chatRoomId] || []

      // 중복 메시지 방지
      if (roomMessages.some((msg) => msg.id === message.id)) {
        return state // 변경 없음
      }

      return {
        chatMessages: {
          ...state.chatMessages,
          [chatRoomId]: [...roomMessages, message],
        },
      }
    }),

  // 특정 채팅방의 메시지를 한꺼번에 설정
  setMessages: (chatRoomId, messages) =>
    set((state) => ({
      chatMessages: {
        ...state.chatMessages,
        [chatRoomId]: messages,
      },
    })),

  // 채팅방 ID로 메시지 조회
  getMessagesForRoom: (chatRoomId) => {
    return get().chatMessages[chatRoomId] || []
  },
}))
