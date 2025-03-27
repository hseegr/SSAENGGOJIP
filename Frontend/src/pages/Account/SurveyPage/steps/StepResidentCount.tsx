import { useState } from 'react'
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
    const [selected, setSelected] = useState<number | null>(null)
    const [showDialog, setShowDialog] = useState(false)
    const { setResidentCount } = useSurveyStore()

    const handleSelect = (count: number) => {
        setSelected(count)
    }

    const handleNext = () => {
        if (selected !== null) {
            setResidentCount(selected)
            onNext()
        }
    }

    return (
        <div className="flex flex-col justify-between items-center text-center min-h-screen w-full px-4 py-8">
            {/* 상단 진행바 */}
            <div className="w-full flex justify-center mb-4">
                <ProgressBar step={0} />
            </div>

            {/* 중간 콘텐츠 */}
            <div className="flex flex-col items-center gap-y-6">
                {/* 질문 */}
                <div className="mt-6">
                    <QuestionBox>
                        누구와 함께 살 집을 찾고 계신가요?<br />
                        거주 인원을 알려주세요.
                    </QuestionBox>
                </div>

                {/* 선택지 버튼 */}
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

            {/* 하단 버튼 */}
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
