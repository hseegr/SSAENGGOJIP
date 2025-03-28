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

// 채팅방 입장/퇴장/삭제 요청 바디 타입
export interface ChatRoomActionRequest {
  memberImageUrl: string
  coordinationId: number
  itemImageUrl: string[]
}

// 합성 결과 응답 타입 (입장/퇴장/삭제 공통)
export interface ChackshotResponse {
  chackshotUrl: string
}
export type ChatRoomActionResponse = CommonResponse<ChackshotResponse>
