import http from './http-common'
import { USER_END_POINT } from './endPoints'

// 로그인
export const fetchSocialLogin = async (
    socialType: string,
    code: string
): Promise<{ accessToken: string; isNew: boolean }> => {
    try {
        const response = await http.post(USER_END_POINT.SOCIAL_LOGIN(socialType, code))

        const { accessToken, isNew } = response.data?.result ?? {}

        if (!accessToken) {
            throw new Error('accessToken 없음')
        }

        return { accessToken, isNew }
    } catch (error: any) {
        const message =
            error.response?.data?.message || '소셜 로그인 중 문제가 발생했습니다.'

        const matchedSocial =
            message.includes('GOOGLE') ? 'google' :
                message.includes('KAKAO') ? 'kakao' :
                    message.includes('NAVER') ? 'naver' :
                        message.includes('SSAFY') ? 'ssafy' :
                            null

        throw {
            message,
            socialType: matchedSocial,
        }
    }
}

// 로그아웃
export const logout = async (): Promise<void> => {
    await http.post(USER_END_POINT.LOGOUT)
}

// 내 정보 조회
export interface UserInfo {
    nickname: string
    email: string
    emailVerified: boolean
    socialLoginType: 'KAKAO' | 'NAVER' | 'GOOGLE' | 'SSAFY'
}

export const getUserInfo = async (): Promise<UserInfo> => {
    const response = await http.get(USER_END_POINT.GET_USER_INFO)
    return response.data.result
}

// 이메일 인증 관련
export const updateEmail = async (email: string): Promise<void> => {
    await http.patch(USER_END_POINT.UPDATE_EMAIL, { email });
};

export const sendEmailCode = async (email: string) => {
    return http.post(USER_END_POINT.SEND_EMAIL_CODE, { email })
}

export const verifyEmailCode = async (code: string): Promise<boolean> => {
    const response = await http.post(USER_END_POINT.VERIFY_EMAIL_CODE(code))
    return response.data.result === true
}

// 회원 탈퇴
export const deleteUser = async (): Promise<void> => {
    await http.delete(USER_END_POINT.DELETE_USER)
}