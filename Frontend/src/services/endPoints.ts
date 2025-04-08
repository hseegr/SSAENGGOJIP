export const USER_END_POINT = {
  SOCIAL_LOGIN: (socialType: string, code: string) =>
    `/auth/login/${socialType}?code=${code}`,
  LOGOUT: '/auth/logout',
  GET_USER_INFO: '/users',
  UPDATE_EMAIL: '/users',
  SEND_EMAIL_CODE: '/users/emails/send',
  VERIFY_EMAIL_CODE: (code: string) => `/users/emails/verify?code=${code}`,
  DELETE_USER: '/users',
  FACILITY_PREFERENCES: '/recommends/facility-preferences',
}

// 설문
export const SURVEY_END_POINT = {
  ADD_TARGET_ADDRESS: '/target-addresses', // POST
  UPDATE_FACILITY_PREFERENCES: '/recommends/facility-preferences', // PATCH
  GET_FACILITY_TYPES: '/facilities/types',
}

// 메인 페이지 -> mainService
export const MAIN_END_POINT = {
  // 로그인 한 유저 선호도 기반 추천 매물
  RECOMMEND_PREFERENCE: '/recommends/by-preferences',

  // 비로그인 유저 위치 기반 추천 매물
  RECOMMEND_LOCATION: '/recommends/by-locations',
}

// 커뮤니티(채팅) 페이지 -> communityService
export const COMMUNITY_END_POINT = {
  // 내가 참여 중인 채팅방 목록 조회
  MY_CHAT_ROOMS: '/chat-rooms/mine',

  // 인기 채팅방 목록 조회
  POPULAR_CHAT_ROOMS: '/chat-rooms/popular',

  // 채팅방 검색 (keyword는 검색어)
  SEARCH_CHAT_ROOMS: (keyword: string) =>
    `/chat-rooms/search?keyword=${keyword}`,

  // 채팅방 입장 (chatRoomId는 해당 방의 ID)
  ENTER_CHAT_ROOM: (chatRoomId: string) => `/chat-rooms/${chatRoomId}/enter`,

  // 채팅방 퇴장
  LEAVE_CHAT_ROOM: (chatRoomId: number) => `/chat-rooms/${chatRoomId}/leave`,

  // 채팅 메시지 삭제 (chatMessageId는 삭제할 메시지 ID)
  DELETE_CHAT_MESSAGE: (chatMessageId: number) =>
    `/chat-messages/${chatMessageId}`,
}

// 커뮤니티 페이지
export const STATION_END_POINT = {
  // 전체 역 불러오기 함수
  ALL_STATION: '/stations',
}

// 지도 페이지 mapService.ts
export const MAP_END_POINT = {
  // 일반 검색
  NORMAL_SEARCH: '/properties/search',
  // 매물 상세 정보
  GET_DETAIL: (propertyId: number) => `/properties/${propertyId}`,
  // 전체 데이터 받기(지도에 보여주기용)
  GET_ALL: '/properties/coordinates',
  // 맞춤 검색
  MATCH_SEARCH: '/properties/recommend-search',
  // 맞춤 검색 상세
  MATCH_DETAIL: '/properties/recommend-detail',
}

// 맞춤 검색 페이지 타겟 주소 관련
export const MATCH_SEARCH_TARGET_END_POINT = {
  // 타겟 주소 조회 - GET
  GET_TARGET: '/target-addresses',
  // 타겟 주소 추가 - POST
  ADD_TARGET: '/target-addresses',
  // 타겟 주소 수정 - PATCH
  EDIT_TARGET: (targetAddressId: number) =>
    `/target-addresses/${targetAddressId}`,
  // 타겟 주소 삭제 - DELETE
  DELETE_TARGET: (targetAddressId: number) =>
    `/target-addresses/${targetAddressId}`,
  // 기본 주소 설정 - PATCH
  SET_DEFAULT: (targetAddressId: number) =>
    `/target-addresses/${targetAddressId}/default`,
}

// 관심 매물 관련 API
export const PROPERTY_END_POINT = {
  GET_LIKED_PROPERTIES: '/properties/likes',
}
