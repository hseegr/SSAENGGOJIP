import { useEffect, useRef } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { fetchSocialLogin } from '@/services/userService'
import { useUserStore } from '@/store/userStore'

const RedirectHandlerPage = () => {
    const [searchParams] = useSearchParams()
    const navigate = useNavigate()
    const hasRun = useRef(false)

    // 구조분해로 상태 훅 불러오기
    const { setAccessToken, setIsLoggedIn } = useUserStore()

    useEffect(() => {
        if (hasRun.current) return
        hasRun.current = true

        const code = searchParams.get('code')
        const socialType = window.location.pathname.split('/').pop()

        if (code && socialType) {
            fetchSocialLogin(socialType, code)
                .then((response) => {
                    const { accessToken, isNew } = response

                    // 상태 업데이트 (localStorage + zustand 동기화)
                    setAccessToken(accessToken)
                    setIsLoggedIn(true)

                    // 경로 이동
                    if (isNew) {
                        navigate('/main')
                    } else {
                        navigate('/survey')
                    }
                })
                .catch((error) => {
                    console.error('로그인 실패:', error)
                    navigate('/account/login')
                })
        }
    }, [])

    return <p className="text-center mt-10">로그인 처리 중입니다...</p>
}

export default RedirectHandlerPage
