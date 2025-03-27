import kakaoLogo from '@/assets/images/kakao.png'
import naverLogo from '@/assets/images/naver.png'
import googleLogo from '@/assets/images/google.png'
import ssafyLogo from '@/assets/images/ssafy.png'
import { mockUserInfo, SocialLoginType } from '@/mocks/mockUser'

const socialLoginStyles: Record<SocialLoginType, { bgColor: string; textColor?: string; logo: string; label: string }> = {
    KAKAO: {
        bgColor: 'bg-[#FEE500]',
        textColor: 'text-black',
        logo: kakaoLogo,
        label: '카카오 로그인',
    },
    NAVER: {
        bgColor: 'bg-[#03C75A]',
        textColor: 'text-white',
        logo: naverLogo,
        label: '네이버 로그인',
    },
    GOOGLE: {
        bgColor: 'bg-[#F2F2F2]',
        textColor: 'text-black',
        logo: googleLogo,
        label: '구글 로그인',
    },
    SSAFY: {
        bgColor: 'bg-[#73A9F3]',
        textColor: 'text-white',
        logo: ssafyLogo,
        label: 'SSAFY 로그인',
    },
}

const MyInfoTab = () => {
    const { nickname, email, emailVerified, socialLoginType } = mockUserInfo
    const style = socialLoginStyles[socialLoginType]

    return (
        <div className="p-10">
            <h2 className="text-2xl font-bold text-ssaeng-purple mb-6">내 정보</h2>
            <div className="space-y-12">
                <div>
                    <div className="text-base font-bold mb-3">연결된 소셜계정</div>
                    <button
                        className={`mt-1 py-1.5 px-3 rounded flex items-center gap-2 ${style.bgColor} ${style.textColor ?? 'text-black'}`}
                    >
                        <img src={style.logo} alt="social-logo" className="w-5 h-5" />
                        {style.label}
                    </button>
                </div>
                <div>
                    <div className="text-base font-bold mb-2">닉네임</div>
                    <p className="text-gray-600">{nickname}</p>
                </div>
                <div>
                    <div className="text-base font-bold mb-2">이메일 인증</div>
                    <p className="text-gray-600">
                        {email}
                        {emailVerified && <span className="text-green-500 ml-2">인증 완료 ✔</span>}
                    </p>
                    <p className="text-sm text-gray-400 mt-2">이메일 수정하기 &gt;</p>
                </div>
                <div className="text-base font-light mb-1 text-gray-400">회원 탈퇴 &gt;</div>
            </div>
        </div>
    );
};

export default MyInfoTab;