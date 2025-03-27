export type SocialLoginType = 'KAKAO' | 'NAVER' | 'GOOGLE' | 'SSAFY'

export interface MockUserInfo {
    nickname: string
    email: string
    emailVerified: boolean
    socialLoginType: SocialLoginType
}

export const mockUserInfo: MockUserInfo = {
    nickname: '달콤한 폭격기',
    email: 'ssafy@ssafy.com',
    emailVerified: true,
    socialLoginType: 'KAKAO'
}