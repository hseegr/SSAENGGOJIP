import { useState } from 'react'
import StepWelcome from './steps/StepWelcome'
import StepResidentCount from './steps/StepResidentCount'
import AddressStep from './steps/Address/AddressStep'
// 이후 단계들도 import 예정

const SurveyPage = () => {
    const [step, setStep] = useState(0)

    const handleNext = () => setStep((prev) => prev + 1)
    const handleBack = () => setStep((prev) => prev - 1)
    const handleSkip = () => {
        // 사용자가 건너뛰기를 선택한 경우 로직 (예: 메인 페이지 이동)
        window.location.href = '/main'
    }

    return (
        <div className="min-h-screen w-full bg-white py-8">
            {step === 0 && <StepWelcome onNext={handleNext} onSkip={handleSkip} />}
            {step === 1 && <StepResidentCount onNext={handleNext} onSkip={handleSkip} />}
            {step === 2 && <AddressStep onNext={handleNext} onBack={handleBack} onSkip={handleSkip} />}
        </div>
    )
}

export default SurveyPage