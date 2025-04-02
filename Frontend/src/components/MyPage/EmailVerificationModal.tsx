// src/components/MyPage/EmailVerificationModal.tsx

import { useState, useEffect } from 'react'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { sendEmailCode, verifyEmailCode } from '@/services/userService'
import { toast } from 'react-toastify'

interface Props {
    isOpen: boolean
    onClose: () => void
    initialEmail: string
    isEditable: boolean
    onSuccess?: () => void // 인증 성공 시 실행될 콜백
}

const EmailVerificationModal = ({
    isOpen,
    onClose,
    initialEmail,
    isEditable,
    onSuccess,
}: Props) => {
    const [email, setEmail] = useState(initialEmail)
    const [code, setCode] = useState('')
    const [step, setStep] = useState<'input' | 'verify' | 'done'>('input')
    const [message, setMessage] = useState('')
    const [success, setSuccess] = useState(false)
    const [timer, setTimer] = useState(0)

    useEffect(() => {
        if (isOpen) {
            setEmail(initialEmail)
            setCode('')
            setStep('input')
            setMessage('')
            setSuccess(false)
            setTimer(0)
        }
    }, [isOpen, initialEmail])

    useEffect(() => {
        if (step !== 'verify' || timer <= 0) return

        const interval = setInterval(() => {
            setTimer((prev) => {
                if (prev <= 1) clearInterval(interval)
                return prev - 1
            })
        }, 1000)

        return () => clearInterval(interval)
    }, [timer, step])

    const formatTime = (seconds: number) => {
        const min = Math.floor(seconds / 60)
        const sec = seconds % 60
        return `${min}:${sec.toString().padStart(2, '0')}`
    }

    const handleSendCode = async () => {
        try {
            await sendEmailCode(email)
            setStep('verify')
            setMessage(
                step === 'verify'
                    ? '인증번호를 다시 보냈어요. 메일함을 확인해 주세요!'
                    : '인증번호를 보냈어요. 메일함을 확인해 주세요!'
            )
            toast.success('✅ 인증번호가 전송되었습니다!')
            setSuccess(true)
            setTimer(300) // 5분
        } catch {
            setMessage('인증번호 발송에 실패했어요.')
            setSuccess(false)
        }
    }

    const handleVerify = async () => {
        try {
            const result = await verifyEmailCode(code)
            if (result) {
                toast.success('이메일 인증이 완료되었어요.')
                onSuccess?.() // 인증 성공 시 콜백 호출
                onClose()
            } else {
                setMessage('인증번호가 일치하지 않습니다.')
                setSuccess(false)
            }
        } catch {
            setMessage('인증에 실패했어요. 다시 시도해 주세요.')
            setSuccess(false)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="w-full max-w-md p-8 text-center rounded-2xl">
                <h2 className="text-lg font-semibold mb-6">이메일 인증</h2>

                <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={!isEditable}
                    className="mb-3 h-10 px-4 text-sm border border-gray-300 rounded-lg"
                />

                <Button
                    onClick={handleSendCode}
                    disabled={!email}
                    className="w-full h-10 bg-ssaeng-purple text-white rounded-lg mb-3"
                >
                    {step === 'verify' ? '인증번호 재발송하기' : '인증번호 발송하기'}
                </Button>

                <div className="flex gap-2 items-center">
                    <Input
                        placeholder="인증번호를 입력해 주세요"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        disabled={step !== 'verify'}
                        className={`flex-1 h-10 px-4 text-sm border rounded-lg ${step !== 'verify'
                            ? 'bg-gray-100 border-gray-200 text-gray-400'
                            : 'border-gray-300'
                            }`}
                    />
                    {timer > 0 && (
                        <span className="text-sm text-red-500 min-w-[48px] text-right">
                            {formatTime(timer)}
                        </span>
                    )}
                    <Button
                        onClick={handleVerify}
                        disabled={step !== 'verify' || !code}
                        className="h-10 px-6 rounded-lg bg-ssaeng-purple text-white disabled:bg-gray-300"
                    >
                        인증
                    </Button>
                </div>

                {message && (
                    <p className={`text-sm mt-2 ${success ? 'text-green-600' : 'text-red-500'}`}>
                        {message}
                    </p>
                )}
            </DialogContent>
        </Dialog>
    )
}

export default EmailVerificationModal