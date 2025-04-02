import { useEffect, useState } from 'react'
import ProgressBar from '@/components/SurveyPage/ProgressBar'
import QuestionBox from '@/components/SurveyPage/QuestionBox'
import FooterButtons from '@/components/SurveyPage/FooterButtons'
import { useSurveyStore } from '@/store/surveyStore'
import { getFacilityTypes, addTargetAddress, updateFacilityPreferences } from '@/services/surveyService'

interface StepFacilitiesProps {
    onNext: () => void
    onBack: () => void
    onSkip: () => void
}

const StepFacilities = ({ onNext, onBack, onSkip }: StepFacilitiesProps) => {
    // ✅ zustand 상태를 개별적으로 가져오기
    const residentCount = useSurveyStore((state) => state.residentCount)
    const person1 = useSurveyStore((state) => state.person1)
    const person2 = useSurveyStore((state) => state.person2)
    const selectedFacilities = useSurveyStore((state) => state.selectedFacilities)
    const setSelectedFacilities = useSurveyStore((state) => state.setSelectedFacilities)
    const resetSelectedFacilities = useSurveyStore((state) => state.resetSelectedFacilities)

    const [facilities, setFacilities] = useState<string[]>([])
    const [isSubmitting, setIsSubmitting] = useState(false)

    // 주변 시설 리스트 API 호출
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

    const convertTransportMode = (mode: string): string => {
        switch (mode) {
            case '지하철':
                return 'SUBWAY'
            case '자동차':
                return 'CAR'
            case '도보':
                return 'WALK'
            default:
                return mode // fallback
        }
    }

    // 완료 버튼 클릭 시 API 호출
    const handleComplete = async () => {
        if (isSubmitting) return

        setIsSubmitting(true)
        try {
            // 타겟 주소 1개 또는 2개 호출
            const targetPeople = residentCount === 2 ? [person1, person2] : [person1]
            // console.log('타겟 주소 요청 대상:', targetPeople)

            for (const person of targetPeople) {
                const payload = {
                    address: person.address,
                    name: person.label,
                    latitude: parseFloat(Number(person.latitude).toFixed(6)),
                    longitude: parseFloat(Number(person.longitude).toFixed(6)),
                    transportMode: convertTransportMode(person.transportMode),
                    travelTime: person.travelTime,
                    walkTime: person.walkTime,
                }

                // 🔽 요청 보내기 전 콘솔에 payload 확인
                // console.log('전송할 payload:', payload)

                await addTargetAddress(payload)
            }

            // 주변 시설 선호도 전송
            const preferences = facilities.map((type) =>
                selectedFacilities.includes(type) ? 1 : 0
            )

            // 🔽 주변 시설 preference도 콘솔 확인
            // console.log('선택된 시설 preference:', preferences)
            await updateFacilityPreferences(preferences)

            onNext() // StepComplete로 이동
        } catch (error) {
            console.error('설문 완료 API 호출 실패:', error)
        } finally {
            setIsSubmitting(false)
        }
    }

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
                        {facilities
                            .slice(0, facilities.length - (facilities.length % 3 || 3))
                            .map((facility) => {
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
                            {facilities
                                .slice(facilities.length - (facilities.length % 3))
                                .map((facility) => {
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
                    onNext={handleComplete}
                    onBack={onBack}
                    onSkip={onSkip}
                    isNextDisabled={isSubmitting}
                    isCompleteStep={true}
                />
            </div>
        </div>
    )
}

export default StepFacilities
