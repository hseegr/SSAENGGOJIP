import { useState } from 'react'
import StepWelcome from './steps/StepWelcome'
// 이후 단계들도 import 예정

const SurveyPage = () => {
    const [step, setStep] = useState(0)

    const handleNext = () => setStep((prev) => prev + 1)
    const handleSkip = () => {
        // 사용자가 건너뛰기를 선택한 경우 로직 (예: 메인 페이지 이동)
        window.location.href = '/main'
    }

    return (
        <div className="min-h-screen bg-white px-4 py-8">
            {step === 0 && <StepWelcome onNext={handleNext} onSkip={handleSkip} />}
            {/* step === 1 이면 다른 단계 컴포넌트 렌더 */}
        </div>
    )
}

export default SurveyPage