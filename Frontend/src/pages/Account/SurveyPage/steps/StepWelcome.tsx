import logo from '@/assets/images/logo.png'
import { Button } from '@/components/ui/button'
import { useConfetti } from '@/hooks/useConfetti'
import { useEffect } from 'react'

interface StepWelcomeProps {
    onNext: () => void
    onSkip: () => void
}

const StepWelcome = ({ onNext, onSkip }: StepWelcomeProps) => {
    const fireConfetti = useConfetti()

    useEffect(() => {
        fireConfetti()
    }, [])

    return (
        <div className="relative flex flex-col items-center justify-start min-h-[calc(100vh-160px)] text-center px-4 mt-24">
            {/* 상단 문구 */}
            <p className="text-lg text-[#242424] font-semibold mb-10">
                나에게 꼭 맞는 집을 찾는 첫걸음!
            </p>

            {/* 로고 이미지 */}
            <img src={logo} alt="쌩고집 로고" className="w-[160px] h-auto mb-16" />

            {/* 설명 텍스트 */}
            <p className="text-lg font-medium text-[#242424] leading-relaxed mb-28">
                지금 몇 가지 정보를 설정하면 <br />
                더 빠르게 맞춤 검색을 이용할 수 있어요 <span className="text-yellow-400">😊</span>
            </p>

            {/* 버튼 */}
            <div className="flex gap-6 mb-20">
                <Button
                    variant="ghost"
                    onClick={onSkip}
                    className="w-36 bg-ssaeng-gray-1 text-gray-500 hover:bg-ssaeng-gray-2"
                >
                    나중에 할래요
                </Button>
                <Button
                    variant="default"
                    onClick={onNext}
                    className="w-36 bg-ssaeng-purple text-white hover:bg-[#5f5fc7]"
                >
                    설문 시작하기
                </Button>
            </div>
        </div>
    )
}

export default StepWelcome
