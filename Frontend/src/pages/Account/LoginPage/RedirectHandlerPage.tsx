import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { fetchSocialLogin } from '@/services/userService'

const RedirectHandlerPage = () => {
    const [searchParams] = useSearchParams()
    const navigate = useNavigate()

    useEffect(() => {
        const code = searchParams.get('code')
        const socialType = window.location.pathname.split('/').pop()

        if (code && socialType) {
            fetchSocialLogin(socialType, code)
                .then((response) => {
                    const { accessToken, alreadyJoin } = response
                    localStorage.setItem('accessToken', accessToken)

                    // 회원가입 되어 있으면 메인으로, 아니면 설문조사 페이지로 이동
                    if (alreadyJoin) {
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
