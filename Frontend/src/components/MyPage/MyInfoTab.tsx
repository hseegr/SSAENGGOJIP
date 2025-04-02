// src/components/MyPage/MyInfoTab.tsx

import { useEffect, useState } from 'react'
import {
    getUserInfo,
    deleteUser,
    UserInfo,
} from '@/services/userService'
import kakaoLogo from '@/assets/images/kakao.png'
import naverLogo from '@/assets/images/naver.png'
import googleLogo from '@/assets/images/google.png'
import ssafyLogo from '@/assets/images/ssafy.png'
import { Button } from '@/components/ui/button'
import DeleteAccountModal from '@/components/MyPage/DeleteAccountModal'
import { useUserStore } from '@/store/userStore'
import EmailVerificationModal from '@/components/MyPage/EmailVerificationModal'
import EmailEditModal from '@/components/MyPage/EmailEditModal'

const socialLoginStyles = {
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
} as const

const MyInfoTab = () => {
    const [userInfo, setUserInfo] = useState<UserInfo | null>(null)
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false)
    const [isWithdrawalModalOpen, setIsWithdrawalModalOpen] = useState(false)
    const logout = useUserStore((state) => state.logout)

    const fetchUser = async () => {
        try {
            const data = await getUserInfo()
            setUserInfo(data)
        } catch (e) {
            console.error('❌ 사용자 정보 불러오기 실패:', e)
        }
    }

    useEffect(() => {
        fetchUser()
    }, [])

    const handleDeleteAccount = async () => {
        try {
            await deleteUser()
            logout()
            setIsWithdrawalModalOpen(false)
            window.location.href = '/'
        } catch (e) {
            alert('회원 탈퇴에 실패했습니다.')
        }
    }

    if (!userInfo) return <div className="p-10">로딩 중...</div>

    const { nickname, email, emailVerified, socialLoginType } = userInfo
    const style = socialLoginStyles[socialLoginType]

    return (
        <div className="p-10">
            <h2 className="text-2xl font-bold text-ssaeng-purple mb-6">내 정보</h2>
            <div className="space-y-12">
                {/* 소셜 로그인 정보 */}
                <div>
                    <div className="text-base font-bold mb-3">연결된 소셜계정</div>
                    <button
                        className={`mt-1 py-1.5 px-3 rounded flex items-center gap-2 ${style.bgColor} ${style.textColor ?? 'text-black'}`}
                    >
                        <img src={style.logo} alt="social-logo" className="w-5 h-5" />
                        {style.label}
                    </button>
                </div>

                {/* 닉네임 */}
                <div>
                    <div className="text-base font-bold mb-2">닉네임</div>
                    <p className="text-gray-600">{nickname}</p>
                </div>

                {/* 이메일 인증 */}
                <div>
                    <div className="text-base font-bold mb-2">이메일 인증</div>
                    <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-gray-600">{email}</span>
                        {emailVerified ? (
                            <span className="text-green-500">인증 완료 ✔</span>
                        ) : (
                            <>
                                <span className="text-red-500">인증을 완료해 주세요❗</span>
                                <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => setIsVerificationModalOpen(true)}
                                >
                                    인증하기
                                </Button>
                            </>
                        )}
                    </div>
                    <button
                        className="text-sm text-gray-400 mt-2 hover:underline"
                        onClick={() => setIsEditModalOpen(true)}
                    >
                        이메일 수정하기 &gt;
                    </button>
                </div>

                {/* 회원 탈퇴 */}
                <div
                    className="text-base font-light mb-1 text-gray-400 hover:underline cursor-pointer"
                    onClick={() => setIsWithdrawalModalOpen(true)}
                >
                    회원 탈퇴 &gt;
                </div>
            </div>

            {/* 이메일 인증 모달 */}
            <EmailVerificationModal
                isOpen={isVerificationModalOpen}
                onClose={() => setIsVerificationModalOpen(false)}
                initialEmail={userInfo.email}
                isEditable={false}
                onSuccess={fetchUser} // 인증 성공 후 유저 정보 다시 불러오기
            />

            {/* 이메일 수정 모달 */}
            <EmailEditModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                currentEmail={userInfo.email}
                onSuccess={fetchUser}
            />


            {/* 회원 탈퇴 모달 */}
            <DeleteAccountModal
                open={isWithdrawalModalOpen}
                onClose={() => setIsWithdrawalModalOpen(false)}
                onConfirm={handleDeleteAccount}
            />
        </div>
    )
}

export default MyInfoTab