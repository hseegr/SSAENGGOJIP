// src/pages/Account/LoginPage/RedirectHandlerPage.tsx
import { useEffect, useRef } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { fetchSocialLogin } from '@/services/userService'
import { useUserStore } from '@/store/userStore'

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

        if (code && socialType) {
            fetchSocialLogin(socialType, code)
                .then(({ accessToken, isNew }) => {
                    setAccessToken(accessToken)
                    setIsLoggedIn(true)
                    navigate(isNew ? '/survey' : '/main')
                })
                .catch((error) => {
                    console.error('소셜 로그인 실패:', error)
                    navigate(`/account/login?message=${encodeURIComponent(error.message)}&socialType=${error.socialType}`)
                })
        }
    }, [])

    return <p className="text-center mt-10">로그인 처리 중입니다...</p>
}

export default RedirectHandlerPage
