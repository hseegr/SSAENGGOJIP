// 공통 응답 타입
export interface CommonResponse<T> {
  isSuccess: boolean
  code: string
  message: string
  result: T
}

// 채팅방 기본 정보 타입
export interface ChatRoom {
  id: string
  name: string
  userCount: number
  lastMessage: string | null

  // ✅ locationList 필드 추가
  locationList: {
    line: string
    latitude: number
    longitude: number
  }[]
}

// 채팅방 목록 응답 타입 (내 채팅방, 인기, 검색)
export type ChatRoomListResponse = CommonResponse<ChatRoom[]>
