import {
  fetchMyChatRooms,
  fetchPopularChatRooms,
  fetchSearchChatRooms,
} from '@/services/communityService'
import { useQuery } from '@tanstack/react-query'

// 내 채팅방 조회
export const useMyChatRoomQuery = () => {
  return useQuery({
    queryKey: ['myChatRooms'],
    queryFn: fetchMyChatRooms,
  })
}

// 인기 채팅방 조회
export const usePopularChatRoomsQuery = () => {
  return useQuery({
    queryKey: ['popularChatRooms'],
    queryFn: fetchPopularChatRooms,
  })
}

// 채팅방 검색 (keyword를 파라미터로 받음)
export const useSearchChatRoomsQuery = (keyword: string) => {
  return useQuery({
    queryKey: ['searchChatRooms', keyword],
    queryFn: () => fetchSearchChatRooms(keyword),
    enabled: !!keyword, // 검색어 없으면 요청 비활성화
  })
}

// 채팅방 입장
// export const useJoinChatRoomMutation
