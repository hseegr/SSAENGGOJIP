import { useState, useEffect } from 'react'
import ProgressBar from '@/components/SurveyPage/ProgressBar'
import QuestionBox from '@/components/SurveyPage/QuestionBox'
import OptionButton from '@/components/SurveyPage/OptionButton'
import FooterButtons from '@/components/SurveyPage/FooterButtons'
import { useSurveyStore } from '@/store/surveyStore'
import SkipSurveyDialog from '@/components/SurveyPage/SkipSurveyDialog'

interface StepResidentCountProps {
    onNext: () => void
    onSkip: () => void
}

const StepResidentCount = ({ onNext, onSkip }: StepResidentCountProps) => {
    const { residentCount, setResidentCount, resetSurvey } = useSurveyStore()

    // ✅ 초기값을 store의 residentCount로 설정
    const [selected, setSelected] = useState<number | null>(residentCount)
    const [showDialog, setShowDialog] = useState(false)

    useEffect(() => {
        // 첫 렌더링일 때만 초기화 (이미 선택된 값 있으면 reset 안함)
        if (residentCount === null) {
            resetSurvey()
        }
    }, [residentCount, resetSurvey])

    const handleSelect = (count: number) => {
        setSelected(count)
        setResidentCount(count) // ✅ store에도 즉시 저장
    }

    const handleNext = () => {
        onNext()
    }

    return (
        <div className="flex flex-col justify-between items-center text-center min-h-screen w-full px-4 py-8">
            <div className="w-full flex justify-center mb-4">
                <ProgressBar step={0} />
            </div>

            <div className="flex flex-col items-center gap-y-6">
                <div className="mt-6">
                    <QuestionBox>
                        누구와 함께 살 집을 찾고 계신가요?
                        <br />
                        거주 인원을 알려주세요.
                    </QuestionBox>
                </div>

                <div className="flex flex-col gap-y-4 mt-6">
                    <OptionButton
                        text="혼자 거주할 집을 찾고 있어요."
                        selected={selected === 1}
                        onClick={() => handleSelect(1)}
                    />
                    <OptionButton
                        text="2명이 함께 거주할 집을 찾고 있어요."
                        selected={selected === 2}
                        onClick={() => handleSelect(2)}
                    />
                </div>
            </div>

            <div className="mt-auto w-full flex justify-center">
                <FooterButtons
                    onNext={handleNext}
                    onSkip={() => setShowDialog(true)}
                    isNextDisabled={selected === null}
                    isFirstStep={true}
                />
            </div>

            <SkipSurveyDialog
                open={showDialog}
                onClose={() => setShowDialog(false)}
                onConfirm={onSkip}
            />
        </div>
    )
}

export default StepResidentCount