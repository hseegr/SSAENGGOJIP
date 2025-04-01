import { useEffect, useState } from 'react'
import ProgressBar from '@/components/SurveyPage/ProgressBar'
import QuestionBox from '@/components/SurveyPage/QuestionBox'
import FooterButtons from '@/components/SurveyPage/FooterButtons'
import { useSurveyStore } from '@/store/surveyStore'

interface LabelStepProps {
    onNext: () => void
    onBack: () => void
    onSkip: () => void
}

const LabelStep = ({ onNext, onBack, onSkip }: LabelStepProps) => {
    const {
        currentPersonIndex,
        residentCount,
        getPersonData,
        setPersonData,
    } = useSurveyStore()

    const personData = getPersonData(currentPersonIndex)

    const [selected, setSelected] = useState<'직접 입력' | '직장' | '학교' | ''>('') // 초기 상태
    const [customInput, setCustomInput] = useState('')
    const [error, setError] = useState(false)

    // ✅ 전역 상태에서 label 값 기반으로 selected 및 customInput 초기화
    useEffect(() => {
        const label = personData.label

        if (label === '직장' || label === '학교') {
            setSelected(label)
            setCustomInput('')
        } else if (label) {
            setSelected('직접 입력')
            setCustomInput(label)
        }
    }, [personData.label])

    const handleClick = (value: '직접 입력' | '직장' | '학교') => {
        setSelected(value)

        if (value === '직접 입력') {
            setCustomInput('')
            setError(false)
            setPersonData(currentPersonIndex, { label: '' })
        } else {
            setCustomInput('')
            setError(false)
            setPersonData(currentPersonIndex, { label: value })
        }
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        setCustomInput(value)

        if (value.length > 5) {
            setError(true)
        } else {
            setError(false)
            setPersonData(currentPersonIndex, { label: value })
        }
    }

    const isNextDisabled =
        selected === '' || (selected === '직접 입력' && (customInput.trim() === '' || error))

    const personText =
        residentCount === 2
            ? currentPersonIndex === 1
                ? '첫 번째 사람의 '
                : '두 번째 사람의 '
            : ''

    return (
        <div className="flex flex-col justify-between items-center text-center min-h-screen w-full px-4 py-8">
            <div className="w-full flex justify-center mb-4">
                <ProgressBar step={1} />
            </div>

            <div className="mt-6">
                <QuestionBox>
                    {residentCount === 2 && (
                        <span className="text-ssaeng-purple font-bold">{personText}</span>
                    )}
                    이 위치는 어떤 곳인가요?
                    <br />
                    원하는 이름을 직접 설정할 수도 있어요.
                </QuestionBox>
            </div>

            <div className="mt-12 flex gap-3 flex-wrap justify-center">
                {['직접 입력', '직장', '학교'].map((option) => (
                    <button
                        key={option}
                        className={`w-24 py-2 rounded-lg text-sm font-medium transition-all
                            ${selected === option
                                ? 'border border-ssaeng-purple text-ssaeng-purple bg-ssaeng-purple-light'
                                : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}
                        `}
                        onClick={() => handleClick(option as '직접 입력' | '직장' | '학교')}
                    >
                        {option}
                    </button>
                ))}
            </div>

            {selected === '직접 입력' && (
                <div className="mt-4 w-80">
                    <input
                        type="text"
                        placeholder="이름을 입력해주세요."
                        value={customInput}
                        onChange={handleInputChange}
                        className="w-full border border-ssaeng-purple rounded-md py-2 px-4 text-sm focus:outline-none"
                        maxLength={5}
                    />
                    {error && (
                        <p className="text-xs text-red-500 mt-1 text-left pl-1">
                            최대 5자까지 입력할 수 있어요.
                        </p>
                    )}
                </div>
            )}

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

export default LabelStep