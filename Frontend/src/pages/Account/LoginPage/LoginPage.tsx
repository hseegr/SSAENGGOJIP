import SocialLoginButton from '@/components/common/SocialLoginButton'
import logo from '@/assets/images/logo.png'
import kakaoLogo from '@/assets/images/kakao.png'
import googleLogo from '@/assets/images/google.png'
import naverLogo from '@/assets/images/naver.png'
import ssafyLogo from '@/assets/images/ssafy.png'

const LoginPage = () => {
    const FRONT_BASE_URL = 'http://localhost:3000' // 배포된 프론트 주소
    const REDIRECT_URIS: Record<string, string> = {
        kakao: `${FRONT_BASE_URL}/account/login/kakao`,
        google: `${FRONT_BASE_URL}/account/login/google`,
        naver: `${FRONT_BASE_URL}/account/login/naver`,
        ssafy: `${FRONT_BASE_URL}/account/login/ssafy`,
    }

    const OAUTH_URLS: Record<string, string> = {
        kakao: `https://kauth.kakao.com/oauth/authorize?client_id=718ce25c291f8df2a0c47fb96b652c80&redirect_uri=${REDIRECT_URIS.kakao}&response_type=code`,
        naver: `https://nid.naver.com/oauth2.0/authorize?client_id=6_93CkviDfSFm_GrMYaL&redirect_uri=${REDIRECT_URIS.naver}&response_type=code&state=test`,
        google: `https://accounts.google.com/o/oauth2/v2/auth?client_id=YOUR_GOOGLE_CLIENT_ID&redirect_uri=${REDIRECT_URIS.google}&response_type=code&scope=profile email`,
        ssafy: `${REDIRECT_URIS.ssafy}`, // SSAFY는 우선 redirect만
    }

    const handleSocialLogin = (type: string) => {
        window.location.href = OAUTH_URLS[type]
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-[80vh]">
            <img src={logo} alt="logo" className="w-36 mb-6" />
            <p className="text-center text-gray-600 mb-4">
                간편하게 로그인하고
                <br />
                <span className="font-semibold text-black">
                    맞춤형 서비스를 경험해보세요.
                </span>
            </p>

            <div className="mt-7 flex flex-col gap-4 w-full max-w-xs">
                <SocialLoginButton
                    bgColor="bg-[#FEE500]"
                    logoSrc={kakaoLogo}
                    text="카카오로 시작하기"
                    onClick={() => handleSocialLogin('kakao')}
                />
                <SocialLoginButton
                    bgColor="bg-gray-100"
                    logoSrc={googleLogo}
                    text="구글로 시작하기"
                    onClick={() => handleSocialLogin('google')}
                />
                <SocialLoginButton
                    bgColor="bg-[#03C75A]"
                    textColor="text-white"
                    logoSrc={naverLogo}
                    text="네이버로 시작하기"
                    onClick={() => handleSocialLogin('naver')}
                />
                <SocialLoginButton
                    bgColor="bg-[#73A9F3]"
                    textColor="text-white"
                    logoSrc={ssafyLogo}
                    text="SSAFY로 시작하기"
                    onClick={() => handleSocialLogin('ssafy')}
                />
            </div>
        </div>
    )
}

export default LoginPage