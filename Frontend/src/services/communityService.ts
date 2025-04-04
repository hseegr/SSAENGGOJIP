import http from './http-common'
import { COMMUNITY_END_POINT } from './endPoints'
import { ChatRoom, ChatRoomListResponse } from '@/types/community'
import { CommonResponse } from '@/types/main'

type EmptyResponse = CommonResponse<Record<string, never>>

// 내 채팅방 조회
export const fetchMyChatRooms = async (): Promise<ChatRoomListResponse> => {
  const res = await http.get(COMMUNITY_END_POINT.MY_CHAT_ROOMS)
  return res.data
}

// 인기 채팅방 조회
export const fetchPopularChatRooms =
  async (): Promise<ChatRoomListResponse> => {
    const res = await http.get(COMMUNITY_END_POINT.POPULAR_CHAT_ROOMS)
    return res.data
  }

// 채팅방 검색
export const fetchSearchChatRooms = async (
  keyword: string,
): Promise<ChatRoomListResponse> => {
  const res = await http.get(COMMUNITY_END_POINT.SEARCH_CHAT_ROOMS(keyword))
  return res.data
}

// 채팅방 입장
export const fetchEnterChatRoom = async (
  chatRoomId: number,
): Promise<EmptyResponse> => {
  const res = await http.post(
    COMMUNITY_END_POINT.ENTER_CHAT_ROOM(chatRoomId),
    {},
  )
  return res.data
}

// 채팅방 퇴장
export const fetchLeaveChatRoom = async (
  chatRoomId: number,
): Promise<EmptyResponse> => {
  const res = await http.post(COMMUNITY_END_POINT.LEAVE_CHAT_ROOM(chatRoomId))
  return res.data
}

// 채팅방의 이전 메시지 불러오기
//chatRoomId 채팅방 ID
// lastMessageId 마지막 메시지 ID (페이징용, null이면 최신 메시지부터)
export const fetchChatMessages = async (
  chatRoomId: string,
  lastMessageId?: string,
) => {
  const res = await http.get(`/chat-rooms/${chatRoomId}/chat-messages`, {
    params: lastMessageId ? { lastMessageId } : undefined,
  })
  return res.data.result // 메시지 배열 반환
}

// 채팅 메시지 삭제
//export const fetchDeleteChatMessage = async()
