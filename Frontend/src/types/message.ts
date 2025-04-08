export type Message = {
  id: string // 메시지 고유 ID
  nickname: string // 닉네임
  content: string // 메시지 내용
  time: string // 사용자에게 보일 시간 포맷
  isMe: boolean // 내 메시지 여부
}
