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

// 채팅 메시지 삭제
//export const fetchDeleteChatMessage = async()
