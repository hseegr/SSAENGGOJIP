import { useEffect, useState } from 'react'
import ProgressBar from '@/components/SurveyPage/ProgressBar'
import QuestionBox from '@/components/SurveyPage/QuestionBox'
import FooterButtons from '@/components/SurveyPage/FooterButtons'
import { useSurveyStore } from '@/store/surveyStore'

interface TransportModeStepProps {
    onNext: () => void
    onBack: () => void
    onSkip: () => void
}

const TransportModeStep = ({ onNext, onBack, onSkip }: TransportModeStepProps) => {
    const {
        currentPersonIndex,
        residentCount,
        setPersonData,
        person1,
        person2,
    } = useSurveyStore()

    const personData = currentPersonIndex === 1 ? person1 : person2
    const [selectedMode, setSelectedMode] = useState<'지하철' | '자동차' | '도보' | null>(null)

    useEffect(() => {
        if (personData.transportMode) {
            setSelectedMode(personData.transportMode as '지하철' | '자동차' | '도보')
        }
    }, [personData.transportMode])

    const handleSelect = (mode: '지하철' | '자동차' | '도보') => {
        setSelectedMode(mode)
        setPersonData(currentPersonIndex, { transportMode: mode })
    }

    const isNextDisabled = selectedMode === null

    return (
        <div className="flex flex-col justify-between items-center text-center min-h-screen w-full px-4 py-8">
            <div className="w-full flex justify-center mb-4">
                <ProgressBar step={2} />
            </div>

            <div className="flex flex-col items-center gap-y-6 mt-6">
                <QuestionBox>
                    {residentCount === 2 && (
                        <span className="text-ssaeng-purple font-bold">
                            {currentPersonIndex === 1 ? '첫 번째' : '두 번째'} 사람의{' '}
                        </span>
                    )}
                    집에서 이 위치까지
                    <br />
                    어떤 교통 수단을 이용하고 싶으신가요?
                </QuestionBox>

                <div className="flex justify-center gap-4 mt-6">
                    {['지하철', '자동차', '도보'].map((mode) => (
                        <button
                            key={mode}
                            className={`w-24 px-5 py-2 rounded-md text-sm font-medium border transition-all
                                ${selectedMode === mode
                                    ? 'bg-ssaeng-purple-light text-ssaeng-purple border-ssaeng-purple'
                                    : 'bg-gray-100 text-gray-500 border-transparent hover:bg-gray-200'}`}
                            onClick={() => handleSelect(mode as '지하철' | '자동차' | '도보')}
                        >
                            {mode}
                        </button>
                    ))}
                </div>
            </div>

            <div className="mt-auto w-full flex justify-center">
                <FooterButtons
                    onNext={onNext}
                    onBack={onBack}
                    onSkip={onSkip}
                    isNextDisabled={isNextDisabled}
                />
            </div>
        </div>
    )
}

export default TransportModeStep