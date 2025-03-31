import { useEffect, useState } from 'react'
import {
    getUserInfo,
    updateEmail,
    sendEmailCode,
    verifyEmailCode,
    deleteUser,
    UserInfo,
} from '@/services/userService'
import kakaoLogo from '@/assets/images/kakao.png'
import naverLogo from '@/assets/images/naver.png'
import googleLogo from '@/assets/images/google.png'
import ssafyLogo from '@/assets/images/ssafy.png'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import DeleteAccountModal from '@/components/MyPage/DeleteAccountModal'
import { useUserStore } from '@/store/userStore'

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
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isWithdrawalModalOpen, setIsWithdrawalModalOpen] = useState(false)
    const [emailInput, setEmailInput] = useState('')
    const [verificationCode, setVerificationCode] = useState('')
    const [step, setStep] = useState<'send' | 'verify'>('send')
    const [mode, setMode] = useState<'verify-only' | 'change-and-verify'>('verify-only')
    const [errorMessage, setErrorMessage] = useState('')
    const [successMessage, setSuccessMessage] = useState('')
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

    const openModal = (initialEmail: string, mode: 'verify-only' | 'change-and-verify') => {
        setEmailInput(initialEmail)
        setVerificationCode('')
        setErrorMessage('')
        setSuccessMessage('')
        setStep('send')
        setMode(mode)
        setIsModalOpen(true)
    }

    const handleSendCode = async () => {
        try {
            await sendEmailCode(emailInput) // 이메일만 전송, 아직 변경 ❌
            setStep('verify')
            setErrorMessage('')
        } catch (e) {
            setErrorMessage('인증번호 전송에 실패했어요.')
        }
    }

    const handleVerifyCode = async () => {
        try {
            const success = await verifyEmailCode(verificationCode)
            if (success) {
                // 인증 성공 후에만 이메일 변경 시도
                if (mode === 'change-and-verify' && emailInput !== userInfo?.email) {
                    await updateEmail(emailInput)
                }

                setSuccessMessage('이메일 인증이 완료되었습니다. ✔')
                setErrorMessage('')
                fetchUser()
            } else {
                setErrorMessage('인증번호를 다시 입력해 주세요. ❗')
                setSuccessMessage('')
            }
        } catch {
            setErrorMessage('인증 실패. 다시 시도해 주세요.')
            setSuccessMessage('')
        }
    }

    const handleDeleteAccount = async () => {
        try {
            await deleteUser()
            useUserStore.getState().logout() // accessToken 제거 + 상태 초기화
            setIsWithdrawalModalOpen(false)
            window.location.href = '/' // 탈퇴 후 홈으로 이동
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
                                    onClick={() => openModal(email, 'verify-only')}
                                >
                                    인증하기
                                </Button>
                            </>
                        )}
                    </div>
                    <button
                        className="text-sm text-gray-400 mt-2 hover:underline"
                        onClick={() => openModal('', 'change-and-verify')}
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

            {/* 이메일 인증/수정 모달 */}
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="w-[460px] h-[400px] rounded-2xl px-10 py-10 text-center">
                    <h3 className="text-base font-semibold mt-4 mb-2">이메일 변경 및 인증</h3>

                    {/* 이메일 입력창 */}
                    <Input
                        type="email"
                        placeholder="ssafy@ssafy.com"
                        value={emailInput}
                        onChange={(e) => setEmailInput(e.target.value)}
                        className="h-10 px-4 text-sm border border-gray-300 rounded-lg focus-visible:ring-0 focus-visible:ring-offset-0"
                    />

                    {/* 인증번호 발송 버튼 */}
                    <Button
                        onClick={handleSendCode}
                        disabled={!emailInput}
                        className="w-full h-10 bg-[#7463F6] text-white rounded-lg disabled:bg-gray-300 disabled:cursor-not-allowed mb-4"
                    >
                        인증번호 발송하기
                    </Button>

                    {/* 인증번호 입력창 + 인증 버튼 */}
                    <div className="flex gap-2">
                        <Input
                            placeholder="인증번호를 입력해 주세요"
                            value={verificationCode}
                            onChange={(e) => setVerificationCode(e.target.value)}
                            disabled={step === 'send'}
                            className={`flex-1 h-10 px-4 text-sm border rounded-lg ${step === 'send' ? 'bg-gray-100 border-gray-200 text-gray-400' : 'border-gray-300'
                                }`}
                        />
                        <Button
                            onClick={handleVerifyCode}
                            disabled={step === 'send' || !verificationCode}
                            className={`h-10 px-6 rounded-lg ${step === 'send' || !verificationCode
                                ? 'bg-gray-300 text-white'
                                : 'bg-[#7463F6] text-white'
                                }`}
                        >
                            인증
                        </Button>
                    </div>

                    {/* 메시지 영역 */}
                    {errorMessage && <p className="text-sm text-red-500 mt-2">{errorMessage}</p>}
                    {successMessage && <p className="text-sm text-green-600 mt-2">{successMessage}</p>}
                </DialogContent>
            </Dialog>

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