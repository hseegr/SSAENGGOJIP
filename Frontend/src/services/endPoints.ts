export const USER_END_POINT = {
  SOCIAL_LOGIN: (socialType: string, code: string) =>
    `/auth/login/${socialType}?code=${code}`,
}

// 메인 페이지 -> mainService
// export const MAIN_END_POINT = {}

// 커뮤니티(채팅) 페이지 -> communityService
// export const COMMUNITY_END_POINT = {}
