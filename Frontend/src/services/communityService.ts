import http from './http-common'
import { COMMUNITY_END_POINT } from './endPoints'

import { ChatRoomListResponse } from '@/types/community'

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
// export const fetchJoinChatRoom = async()

// 채팅방 퇴장
// export const fetchLeaveChatRoom = async()

// 채팅 메시지 삭제
//export const fetchDeleteChatMessage = async()
