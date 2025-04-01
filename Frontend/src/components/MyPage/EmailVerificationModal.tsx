import { useState, useEffect } from 'react'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { sendEmailCode, verifyEmailCode } from '@/services/userService'

interface Props {
    isOpen: boolean
    onClose: () => void
    initialEmail: string
    isEditable: boolean // true면 이메일 입력 가능, false면 readonly
}

const EmailVerificationModal = ({ isOpen, onClose, initialEmail, isEditable }: Props) => {
    const [email, setEmail] = useState(initialEmail)
    const [code, setCode] = useState('')
    const [step, setStep] = useState<'input' | 'verify' | 'done'>('input')
    const [message, setMessage] = useState('')
    const [success, setSuccess] = useState(false)

    useEffect(() => {
        if (isOpen) {
            setEmail(initialEmail)
            setCode('')
            setStep('input')
            setMessage('')
            setSuccess(false)
        }
    }, [isOpen, initialEmail])

    const handleSendCode = async () => {
        try {
            await sendEmailCode(email)
            setStep('verify')
            setMessage('인증번호를 전송했어요.')
        } catch {
            setMessage('이메일 전송에 실패했어요.')
        }
    }

    const handleVerify = async () => {
        try {
            const result = await verifyEmailCode(code)
            if (result) {
                setSuccess(true)
                setMessage('이메일 인증이 완료되었어요.')
                setStep('done')
            } else {
                setMessage('인증번호를 다시 입력해 주세요.')
            }
        } catch {
            setMessage('인증에 실패했어요.')
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="w-full max-w-md p-6">
                <h2 className="text-center text-lg font-semibold mb-4">이메일 변경 및 인증</h2>

                <input
                    className="w-full border rounded px-3 py-2 mb-3"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={!isEditable}
                />

                {step === 'input' && (
                    <button
                        className="w-full bg-ssaeng-purple text-white py-2 rounded"
                        onClick={handleSendCode}
                    >
                        인증번호 발송하기
                    </button>
                )}

                {step === 'verify' && (
                    <>
                        <input
                            className="w-full border rounded px-3 py-2 mt-3"
                            placeholder="인증번호를 입력해 주세요"
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                        />
                        <button
                            className="w-full bg-ssaeng-purple text-white py-2 rounded mt-2"
                            onClick={handleVerify}
                        >
                            인증
                        </button>
                    </>
                )}

                {message && (
                    <p className={`text-sm mt-2 ${success ? 'text-green-600' : 'text-red-500'}`}>{message}</p>
                )}
            </DialogContent>
        </Dialog>
    )
}

export default EmailVerificationModal
