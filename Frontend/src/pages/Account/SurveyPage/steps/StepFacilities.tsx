import { useEffect, useState } from 'react'
import ProgressBar from '@/components/SurveyPage/ProgressBar'
import QuestionBox from '@/components/SurveyPage/QuestionBox'
import FooterButtons from '@/components/SurveyPage/FooterButtons'
import { useSurveyStore } from '@/store/surveyStore'
// import { mockFacilityTypes } from '@/mocks/mockFacilities'
import { getFacilityTypes } from '@/services/surveyService'

interface StepFacilitiesProps {
    onNext: () => void
    onBack: () => void
    onSkip: () => void
}

const StepFacilities = ({ onNext, onBack, onSkip }: StepFacilitiesProps) => {
    const {
        selectedFacilities,
        setSelectedFacilities,
        resetSelectedFacilities,
    } = useSurveyStore()

    const [facilities, setFacilities] = useState<string[]>([])
    // useEffect(() => {
    //     setFacilities(mockFacilityTypes)
    // }, [])

    useEffect(() => {
        const fetchFacilityTypes = async () => {
            try {
                const types = await getFacilityTypes()
                setFacilities(types)
            } catch (error) {
                console.error('시설 목록 조회 실패:', error)
            }
        }
        fetchFacilityTypes()
    }, [])


    const toggleFacility = (facility: string) => {
        if (selectedFacilities.includes(facility)) {
            setSelectedFacilities(selectedFacilities.filter((f) => f !== facility))
        } else {
            setSelectedFacilities([...selectedFacilities, facility])
        }
    }

    const handleReset = () => {
        resetSelectedFacilities()
    }

    const isNextDisabled = false

    return (
        <div className="flex flex-col justify-between items-center text-center min-h-screen w-full px-4 py-8">
            <div className="w-full flex justify-center mb-4">
                <ProgressBar step={3} />
            </div>

            <div className="flex flex-col items-center gap-y-6 mt-6">
                <QuestionBox>
                    집 주변에 있었으면 하는 시설이 있나요?
                    <br />
                    필요한 시설을 선택해주세요.
                </QuestionBox>

                <button
                    onClick={handleReset}
                    className="text-xs text-gray-400 hover:text-gray-600 transition"
                >
                    선택 초기화
                </button>

                <div className="w-full max-w-md mt-2">
                    <div className="grid grid-cols-3 gap-x-3 gap-y-8 justify-items-center">
                        {facilities.slice(0, facilities.length - (facilities.length % 3 || 3)).map((facility) => {
                            const isSelected = selectedFacilities.includes(facility)
                            return (
                                <button
                                    key={facility}
                                    onClick={() => toggleFacility(facility)}
                                    className={`w-24 h-8 px-4 py-1.5 rounded-full text-sm font-medium border
                                        ${isSelected
                                            ? 'bg-ssaeng-purple-light text-ssaeng-purple border-ssaeng-purple'
                                            : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-100'}`}
                                >
                                    {facility}
                                </button>
                            )
                        })}
                    </div>

                    {facilities.length % 3 !== 0 && (
                        <div className="flex justify-center gap-3 mt-8">
                            {facilities.slice(facilities.length - (facilities.length % 3)).map((facility) => {
                                const isSelected = selectedFacilities.includes(facility)
                                return (
                                    <button
                                        key={facility}
                                        onClick={() => toggleFacility(facility)}
                                        className={`w-24 h-8 px-4 py-1.5 rounded-full text-sm font-medium border
                                            ${isSelected
                                                ? 'bg-ssaeng-purple-light text-ssaeng-purple border-ssaeng-purple'
                                                : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-100'}`}
                                    >
                                        {facility}
                                    </button>
                                )
                            })}
                        </div>
                    )}
                </div>
            </div>

            <div className="mt-auto w-full flex flex-col items-center gap-2">
                <FooterButtons
                    onNext={onNext}
                    onBack={onBack}
                    onSkip={onSkip}
                    isNextDisabled={isNextDisabled}
                    isCompleteStep={true}
                />
            </div>
        </div>
    )
}

export default StepFacilities