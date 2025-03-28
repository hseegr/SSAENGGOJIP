// 공통 응답 타입
export interface CommonResponse<T> {
  isSuccess: boolean
  code: string
  message: string
  result: T
}

// 채팅방 기본 정보 타입
export interface ChatRoom {
  id: number
  name: string
  line: string[]
  userCount: number
  lastMessage: string
  latitude: number
  longitude: number
}

// 채팅방 목록 응답 타입 (내 채팅방, 인기, 검색)
export type ChatRoomListResponse = CommonResponse<ChatRoom[]>
