import { useEffect, useState } from 'react'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { updateEmail } from '@/services/userService'
import { toast } from 'react-toastify'

interface Props {
    isOpen: boolean
    onClose: () => void
    currentEmail: string
    onSuccess?: () => void
}

const EmailEditModal = ({ isOpen, onClose, currentEmail, onSuccess }: Props) => {
    const [email, setEmail] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')

    // 모달이 닫힐 때 상태 초기화
    useEffect(() => {
        if (!isOpen) {
            setEmail('')
            setErrorMessage('')
            setIsSubmitting(false)
        }
    }, [isOpen])

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value)
        setErrorMessage('')
    }

    const isValidEmail = (email: string) => {
        const regex = /^[\w-.]+@[\w-]+\.[a-z]{2,}$/i
        return regex.test(email)
    }

    const handleSubmit = async (e?: React.FormEvent) => {
        if (e) e.preventDefault()
        if (!email) return

        if (!isValidEmail(email)) {
            setErrorMessage('올바른 이메일 형식을 입력해 주세요.')
            return
        }

        if (email === currentEmail) {
            setErrorMessage('현재 사용 중인 이메일이에요.')
            return
        }

        setIsSubmitting(true)
        try {
            await updateEmail(email)
            onSuccess?.()
            toast.success('이메일이 성공적으로 변경되었어요.')
            onClose()
        } catch (err: any) {
            const serverMsg = err?.response?.data?.message
            if (serverMsg?.includes('이미 사용')) {
                setErrorMessage('이미 사용 중인 이메일이에요.')
            } else {
                setErrorMessage('이메일 변경에 실패했어요. 다시 시도해 주세요.')
            }
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="w-full max-w-md p-8 text-center rounded-2xl">
                <h2 className="text-lg font-semibold mb-6">이메일 변경</h2>

                <form onSubmit={handleSubmit}>
                    <div className="mb-4 text-left">
                        <Input
                            type="text"
                            placeholder="이메일을 입력해 주세요"
                            value={email}
                            onChange={handleEmailChange}
                            className="h-10 px-4 text-sm border border-gray-300 rounded-lg"
                        />
                        {errorMessage && (
                            <p className="text-sm text-red-500 mt-1">{errorMessage}</p>
                        )}
                    </div>

                    <Button
                        type="submit" // 엔터로도 작동
                        disabled={!email || isSubmitting}
                        className="w-full h-10 bg-ssaeng-purple text-white rounded-lg disabled:bg-gray-300"
                    >
                        변경하기
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export default EmailEditModal