export interface ChatRoom {
  id: number // 채팅방 고유 ID
  name: string // 역 이름 (ex: 강남역)
  line: string[] // 호선 배열 (ex: ["2호선", "신분당선"])
  userCount: number // 참여자 수
  lastMessage: string // 마지막 메시지
  latitude: number // 위도
  longitude: number // 경도
}

export interface Message {
  id: string
  user: string
  content: string
  createdAt: string
}
