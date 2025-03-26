import http from './http-common'
import { USER_END_POINT } from './endPoints'

export const fetchSocialLogin = async (
    socialType: string,
    code: string
): Promise<{ accessToken: string; isNew: boolean }> => {
    console.log('🔽 fetchSocialLogin 호출됨')
    console.log('👉 전달된 socialType:', socialType)
    console.log('👉 전달된 code:', code)

    const response = await http.post(USER_END_POINT.SOCIAL_LOGIN(socialType, code))

    console.log('✅ 응답 결과:', response)
    const { accessToken, isNew } = response.data?.result ?? {}

    if (!accessToken) throw new Error('accessToken 없음')
    return { accessToken, isNew }
}

export const logout = async (): Promise<void> => {
    await http.post(USER_END_POINT.LOGOUT)
}
