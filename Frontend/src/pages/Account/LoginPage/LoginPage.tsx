import { useEffect, useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import SocialLoginButton from '@/components/common/SocialLoginButton'
import { Dialog, DialogContent } from '@/components/ui/dialog'

import logo from '@/assets/images/logo.png'
import kakaoLogo from '@/assets/images/kakao.png'
import googleLogo from '@/assets/images/google.png'
import naverLogo from '@/assets/images/naver.png'
import ssafyLogo from '@/assets/images/ssafy.png'

const loginOptions = {
  kakao: {
    label: '카카오로 로그인',
    bgColor: 'bg-[#FEE500]',
    logo: kakaoLogo,
  },
  naver: {
    label: '네이버로 로그인',
    bgColor: 'bg-[#03C75A]',
    logo: naverLogo,
    textColor: 'text-white',
  },
  google: {
    label: '구글로 로그인',
    bgColor: 'bg-[#F2F2F2]',
    logo: googleLogo,
  },
  ssafy: {
    label: 'SSAFY로 로그인',
    bgColor: 'bg-[#73A9F3]',
    logo: ssafyLogo,
    textColor: 'text-white',
  },
} as const

type SocialType = keyof typeof loginOptions

const LoginPage = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  // 모달 관련 상태
  const [open, setOpen] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [originalSocialType, setOriginalSocialType] =
    useState<SocialType | null>(null)

  const FRONT_BASE_URL = 'http://localhost:3000'
  // const FRONT_BASE_URL = 'https://j12a406.p.ssafy.io' // 배포된 프론트 주소

  const REDIRECT_URIS: Record<SocialType, string> = {
    kakao: `${FRONT_BASE_URL}/account/login/kakao`,
    naver: `${FRONT_BASE_URL}/account/login/naver`,
    google: `${FRONT_BASE_URL}/account/login/google`,
    ssafy: `${FRONT_BASE_URL}/account/login/ssafy`,
  }

  const OAUTH_URLS: Record<SocialType, string> = {
    kakao: `https://kauth.kakao.com/oauth/authorize?client_id=718ce25c291f8df2a0c47fb96b652c80&redirect_uri=${REDIRECT_URIS.kakao}&response_type=code`,
    naver: `https://nid.naver.com/oauth2.0/authorize?client_id=6_93CkviDfSFm_GrMYaL&redirect_uri=${REDIRECT_URIS.naver}&response_type=code&state=test`,
    google: `https://accounts.google.com/o/oauth2/v2/auth?client_id=809999665942-voo0ol6ab29sin9oqh3ipjlugmg3u6jk.apps.googleusercontent.com&redirect_uri=${REDIRECT_URIS.google}&response_type=code&scope=email`,
    ssafy: `https://project.ssafy.com/oauth/sso-check?client_id=70ffec42-e719-4a38-9f27-f991ef8b1dce&redirect_uri=${REDIRECT_URIS.ssafy}&response_type=code`,
  }

  useEffect(() => {
    const msg = searchParams.get('message')
    const socialType = searchParams.get('socialType') as SocialType | null

    if (msg && socialType) {
      setErrorMessage(msg)
      setOriginalSocialType(socialType)
      setOpen(true)
    }
  }, [searchParams])

  const handleRedirectToOriginal = () => {
    if (originalSocialType) {
      window.location.href = OAUTH_URLS[originalSocialType]
    }
  }

  const handleClose = () => {
    setOpen(false)
    navigate('/account/login', { replace: true }) // 쿼리 제거
  }

  const handleSocialLogin = (type: string) => {
    handleClose()
    const selected = type as SocialType
    window.location.href = OAUTH_URLS[selected]
  }

  return (
    <>
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
            bgColor="bg-[#03C75A]"
            textColor="text-white"
            logoSrc={naverLogo}
            text="네이버로 시작하기"
            onClick={() => handleSocialLogin('naver')}
          />
          <SocialLoginButton
            bgColor="bg-[#F2F2F2]"
            logoSrc={googleLogo}
            text="구글로 시작하기"
            onClick={() => handleSocialLogin('google')}
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

      {/* 모달 영역 */}
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="w-full max-w-lg px-8 py-6 text-center">
          <p className="text-base sm:text-lg font-medium text-red-500 mb-2">
            해당 이메일은 이미{' '}
            <span className="font-semibold text-[#EA4335]">
              {originalSocialType}
            </span>
            로 로그인한 이력이 있어요.
          </p>
          <p className="text-sm text-gray-700 mb-6">
            해당 소셜 계정으로 계속 로그인하시겠어요?
          </p>

          {originalSocialType && loginOptions[originalSocialType] && (
            <SocialLoginButton
              bgColor={loginOptions[originalSocialType].bgColor}
              logoSrc={loginOptions[originalSocialType].logo}
              text={loginOptions[originalSocialType].label.replace(
                '로그인',
                '로그인하기',
              )}
              onClick={handleRedirectToOriginal}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}

export default LoginPage
