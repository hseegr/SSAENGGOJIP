import { useEffect, useState } from 'react'
import ProgressBar from '@/components/SurveyPage/ProgressBar'
import QuestionBox from '@/components/SurveyPage/QuestionBox'
import FooterButtons from '@/components/SurveyPage/FooterButtons'
import { useSurveyStore } from '@/store/surveyStore'

interface TravelTimeStepProps {
    onNext: () => void
    onBack: () => void
    onSkip: () => void
}

// 스타일
const getSliderStyle = (value: number) => ({
    background: `linear-gradient(to right, #8779f8 ${value / 120 * 100}%, #e3e0fa ${value / 120 * 100}%)`,
})

const formatTimeLabel = (value: number) => {
    if (value < 60) return `${value}분 이내`
    if (value % 60 === 0) return `${value / 60}시간 이내`
    const hours = Math.floor(value / 60)
    const minutes = value % 60
    return `${hours}시간 ${minutes}분 이내`
}

const TravelTimeStep = ({ onNext, onBack, onSkip }: TravelTimeStepProps) => {
    const {
        currentPersonIndex,
        residentCount,
        person1,
        person2,
        setPersonData,
    } = useSurveyStore()

    const personData = currentPersonIndex === 1 ? person1 : person2
    const [travelTime, setTravelTimeState] = useState(60)
    const [walkTime, setWalkTimeState] = useState<number | null>(null)

    // 초기값 설정
    useEffect(() => {
        if (personData.travelTime) {
            setTravelTimeState(personData.travelTime)
        }

        if (personData.transportMode === '지하철') {
            // 도보 시간이 선택되지 않은 상태면 null
            if (!personData.walkTime || personData.walkTime === 0) {
                setWalkTimeState(null)
            } else {
                setWalkTimeState(personData.walkTime)
            }
        } else {
            setWalkTimeState(null) // 지하철 외에는 필요 없음
        }
    }, [personData])

    const handleNext = () => {
        setPersonData(currentPersonIndex, {
            travelTime,
            ...(personData.transportMode === '지하철' && walkTime !== null ? { walkTime } : {}),
        })
        onNext()
    }

    const isNextDisabled = personData.transportMode === '지하철' && walkTime === null

    return (
        <div className="flex flex-col justify-between items-center text-center min-h-screen w-full px-4 py-8">
            <div className="w-full flex justify-center mb-4">
                <ProgressBar step={2} />
            </div>

            <div className="flex flex-col items-center gap-y-8 mt-6">
                <QuestionBox>
                    {residentCount === 2 && (
                        <span className="text-ssaeng-purple font-bold">
                            {currentPersonIndex === 1 ? '첫 번째' : '두 번째'} 사람의{' '}
                        </span>
                    )}
                    집에서 이 위치까지
                    <br />
                    희망하는 이동 시간은 몇 분인가요?
                </QuestionBox>

                {/* 전체 이동 시간 슬라이더 */}
                <div className="text-left w-80 relative">
                    <p className="text-sm font-semibold mb-2">희망 전체 이동 시간</p>
                    <div className="absolute right-0 -top-1 text-xs text-ssaeng-purple">
                        {formatTimeLabel(travelTime)}
                    </div>
                    <input
                        type="range"
                        min={0}
                        max={120}
                        step={10}
                        value={travelTime}
                        onChange={(e) => setTravelTimeState(Number(e.target.value))}
                        style={getSliderStyle(travelTime)}
                        className="w-full h-2 rounded-full bg-ssaeng-purple-light appearance-none
              [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4
              [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full
              [&::-webkit-slider-thumb]:bg-ssaeng-purple"
                    />
                    <div className="flex justify-between text-sm mt-1 text-gray-500">
                        <span>0분</span>
                        <span>2시간 이내</span>
                    </div>
                </div>

                {/* 도보 이동 시간 - 지하철일 때만 표시 */}
                {personData.transportMode === '지하철' && (
                    <div className="text-left w-70">
                        <p className="text-sm font-semibold mb-2">희망 도보 이동 시간</p>
                        <div className="flex gap-2 flex-wrap">
                            {['10분 이내', '20분 이내', '30분 이내', '상관없음'].map((label, i) => {
                                const timeValue = i < 3 ? (i + 1) * 10 : 999
                                const isSelected = walkTime === timeValue
                                return (
                                    <button
                                        key={label}
                                        onClick={() => setWalkTimeState(timeValue)}
                                        className={`w-[80px] py-1.5 rounded-md text-sm font-medium border
                      ${isSelected
                                                ? 'bg-ssaeng-purple-light text-ssaeng-purple border-ssaeng-purple'
                                                : 'bg-gray-100 text-gray-500 border-transparent hover:bg-gray-200'}`}
                                    >
                                        {label}
                                    </button>
                                )
                            })}
                        </div>
                    </div>
                )}
            </div>

            <div className="mt-auto w-full flex justify-center">
                <FooterButtons
                    onNext={handleNext}
                    onBack={onBack}
                    onSkip={onSkip}
                    isNextDisabled={isNextDisabled}
                />
            </div>
        </div>
    )
}

export default TravelTimeStep