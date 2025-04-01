import { useState } from 'react'
import StepWelcome from './steps/StepWelcome'
import StepResidentCount from './steps/StepResidentCount'
import AddressStep from './steps/Address/AddressStep'
import LabelStep from './steps/Address/LabelStep'
import TransportModeStep from './steps/Transport/TransportModeStep'
import TravelTimeStep from './steps/Transport/TravelTimeStep'
import StepFacilities from './steps/StepFacilities'
import StepComplete from './steps/StepComplete'
import { useSurveyStore } from '@/store/surveyStore'

const SurveyPage = () => {
    const { residentCount, currentPersonIndex, setCurrentPersonIndex } = useSurveyStore()
    const [step, setStep] = useState(0)

    const handleNext = () => {
        // Step 5 (2-4: 이동 시간) 후 분기 처리
        if (step === 5) {
            if (residentCount === 2 && currentPersonIndex === 1) {
                // 2인 거주이고 첫 번째 사람 정보 입력 완료 -> 두 번째 사람 시작
                setCurrentPersonIndex(2)
                setStep(2) // 다시 주소부터
                return
            } else {
                // 1인 거주이거나 두 번째 사람 정보도 입력 완료 -> 다음 단계로
                setStep(6) // 주변 시설로 이동
                return
            }
        }

        setStep((prev) => prev + 1)
    }

    const handleBack = () => {
        // 두 번째 사람인 경우 뒤로가면 첫 번째 사람의 마지막 스텝으로 이동
        if (step === 2 && currentPersonIndex === 2) {
            setCurrentPersonIndex(1)
            setStep(5)
            return
        }
        setStep((prev) => prev - 1)
    }

    const handleSkip = () => {
        window.location.href = '/main'
    }

    return (
        <div className="min-h-screen w-full bg-white">
            {step === 0 && <StepWelcome onNext={handleNext} onSkip={handleSkip} />}
            {step === 1 && <StepResidentCount onNext={handleNext} onSkip={handleSkip} />}
            {step === 2 && (
                <AddressStep
                    onNext={handleNext}
                    onBack={handleBack}
                    onSkip={handleSkip}
                />
            )}
            {step === 3 && (
                <LabelStep
                    onNext={handleNext}
                    onBack={handleBack}
                    onSkip={handleSkip}
                />
            )}
            {step === 4 && (
                <TransportModeStep
                    onNext={handleNext}
                    onBack={handleBack}
                    onSkip={handleSkip}
                />
            )}
            {step === 5 && (
                <TravelTimeStep
                    onNext={handleNext}
                    onBack={handleBack}
                    onSkip={handleSkip}
                />
            )}
            {step === 6 && (
                <StepFacilities
                    onNext={handleNext}
                    onBack={handleBack}
                    onSkip={handleSkip}
                />
            )}
            {step === 7 && <StepComplete />}
        </div>
    )
}

export default SurveyPage