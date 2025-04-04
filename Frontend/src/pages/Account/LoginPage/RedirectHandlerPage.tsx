import { useEffect, useRef } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { fetchSocialLogin } from '@/services/userService'
import { useUserStore } from '@/store/userStore'
import { getFacilityTypes, updateFacilityPreferences } from '@/services/surveyService'

const RedirectHandlerPage = () => {
    const [searchParams] = useSearchParams()
    const navigate = useNavigate()
    const hasRun = useRef(false)

    const { setAccessToken, setIsLoggedIn } = useUserStore()

    useEffect(() => {
        if (hasRun.current) return
        hasRun.current = true

        const code = searchParams.get('code')
        const socialType = window.location.pathname.split('/').pop()

        const handleLogin = async () => {
            try {
                if (!code || !socialType) return

                const { accessToken, userId, isNew } = await fetchSocialLogin(socialType, code)
                setAccessToken(accessToken)
                setIsLoggedIn(true)
                localStorage.setItem('userId', userId)

                // 신규 유저일 경우 초기 선호도 0으로 설정
                if (isNew) {
                    try {
                        const facilityTypes = await getFacilityTypes()
                        const emptyPreferences = facilityTypes.map(() => 0)
                        await updateFacilityPreferences(emptyPreferences)
                    } catch (prefError) {
                        console.error('초기 선호도 설정 실패:', prefError)
                    }
                }

                navigate(isNew ? '/survey' : '/main')
            } catch (error: any) {
                console.error('소셜 로그인 실패:', error)
                navigate(`/account/login?message=${encodeURIComponent(error.message)}&socialType=${error.socialType}`)
            }
        }

        handleLogin()
    }, [])

    return <p className="text-center mt-10">로그인 처리 중입니다...</p>
}

export default RedirectHandlerPage