export const USER_END_POINT = {
  SOCIAL_LOGIN: (socialType: string, code: string) =>
    `/auth/login/${socialType}?code=${code}`,
}

// 메인 페이지 -> mainService
// export const MAIN_END_POINT = {}

// 커뮤니티(채팅) 페이지 -> communityService
export const COMMUNITY_END_POINT = {
  // 내가 참여 중인 채팅방 목록 조회
  MY_CHAT_ROOMS: '/users/chat-rooms',

  // 인기 채팅방 목록 조회
  POPULAR_CHAT_ROOMS: '/chat-rooms/popular',

  // 채팅방 검색 (keyword는 검색어)
  SEARCH_CHAT_ROOMS: (keyword: string) =>
    `/chat-rooms/search?keyword=${keyword}`,

  // 채팅방 입장 (chatRoomId는 해당 방의 ID)
  JOIN_CHAT_ROOM: (chatRoomId: number) => `/chat-rooms/${chatRoomId}/join`,

  // 채팅방 퇴장
  LEAVE_CHAT_ROOM: '/chat-rooms/leave',

  // 채팅 메시지 삭제 (chatMessageId는 삭제할 메시지 ID)
  DELETE_CHAT_MESSAGE: (chatMessageId: number) =>
    `/chat-messages/${chatMessageId}`,
}
