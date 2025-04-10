import { useEffect, useState } from 'react'
import useFilterStore from '@/store/filterStore'

interface FacilityFilterStepProps {
    onBack: () => void
    onComplete: () => void
    currentStep: number
    totalStep: number
}

const FacilityFilterStep = ({
    onBack,
    onComplete,
    currentStep,
    totalStep,
}: FacilityFilterStepProps) => {
    const {
        additionalFilters,
        setAdditionalFilters,
        resetAdditionalFilters,
    } = useFilterStore()

    const [facilities, setFacilities] = useState<string[]>([])

    useEffect(() => {
        // 시설 종류 하드코딩 혹은 API로 가져오는 부분
        const fetchFacilities = async () => {
            setFacilities([
                '병원',
                '약국',
                '동물병원',
                '공원',
                '관공서',
                '편의점',
                '대형마트',
                '세탁소',
            ])
        }

        fetchFacilities()
    }, [])

    const toggleFacility = (facility: string) => {
        if (additionalFilters.includes(facility)) {
            setAdditionalFilters(additionalFilters.filter((f) => f !== facility))
        } else {
            setAdditionalFilters([...additionalFilters, facility])
        }
    }

    return (
        <div className="flex flex-col w-[350px] h-[540px] mx-auto gap-2">
            <h2 className="text-lg font-bold mt-4 mb-4 w-full text-left">
                주변 시설 필터
            </h2>

            {/* 시설 선택 버튼 */}
            <div className="w-full max-w-md">
                <div className="grid grid-cols-3 gap-x-3 gap-y-6 justify-items-center">
                    {facilities.map((facility) => {
                        const isSelected = additionalFilters.includes(facility)
                        return (
                            <button
                                key={facility}
                                onClick={() => toggleFacility(facility)}
                                className={`w-24 h-8 px-4 py-1.5 rounded-full text-sm font-medium border transition
                  ${isSelected
                                        ? 'bg-ssaeng-purple-light text-ssaeng-purple border-ssaeng-purple'
                                        : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-100'
                                    }`}
                            >
                                {facility}
                            </button>
                        )
                    })}
                </div>
            </div>

            {/* 선택 초기화 버튼 */}
            <button
                onClick={resetAdditionalFilters}
                className="text-xs text-center text-gray-400 hover:text-gray-600 transition mt-8 mb-1"
            >
                선택 초기화
            </button>

            {/* 페이지 인디케이터 */}
            <div className="flex justify-center w-full mt-auto space-x-2 pt-4 mb-8">
                {Array.from({ length: totalStep }, (_, i) => (
                    <span
                        key={i}
                        className={`w-2 h-2 rounded-full ${currentStep === i + 1 ? 'bg-ssaeng-purple' : 'bg-gray-300'
                            }`}
                    />
                ))}
            </div>

            {/* 하단 버튼 */}
            <div className="w-full flex justify-between items-center mb-4">
                <button
                    onClick={onBack}
                    className="px-6 py-2 bg-gray-200 text-gray-600 rounded-md text-sm"
                >
                    이전
                </button>
                <button
                    onClick={onComplete}
                    className="px-6 py-2 bg-ssaeng-purple text-white rounded-md text-sm"
                >
                    완료
                </button>
            </div>
        </div>
    )
}

export default FacilityFilterStep