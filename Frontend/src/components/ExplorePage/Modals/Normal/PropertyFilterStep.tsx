import { useState } from 'react'
import useFilterStore from '@/store/filterStore'
import Slider from 'rc-slider'
import 'rc-slider/assets/index.css'

interface PropertyFilterStepProps {
    onNext: () => void
    currentStep: number
    totalStep: number
}

const PropertyFilterStep = ({ onNext, currentStep, totalStep }: PropertyFilterStepProps) => {
    const {
        propertyTypes,
        dealType,
        MindepositPrice,
        MaxdepositPrice,
        MinmonthlyPrice,
        MaxmonthlyPrice,
        setPropertyTypes,
        setDealType,
        setDepositPriceRange,
        setMonthlyPriceRange,
    } = useFilterStore()

    const propertyOptions = ['아파트', '오피스텔', '빌라']
    const dealOptions = ['전세', '월세', '매매']

    const DEPOSIT_UNIT = 50_000_000
    const DEPOSIT_MAX = 2_050_000_000
    const DEPOSIT_SLIDER_MAX = 42

    const MONTHLY_UNIT = 100_000
    const MONTHLY_MAX = 4_100_000
    const MONTHLY_SLIDER_MAX = 42

    const [minDeposit, setMinDeposit] = useState(MindepositPrice)
    const [maxDeposit, setMaxDeposit] = useState(MaxdepositPrice)
    const [minMonthly, setMinMonthly] = useState(MinmonthlyPrice)
    const [maxMonthly, setMaxMonthly] = useState(MaxmonthlyPrice)

    const handleNext = () => {
        setDepositPriceRange(minDeposit, maxDeposit)
        setMonthlyPriceRange(minMonthly, maxMonthly)
        onNext()
    }

    const togglePropertyType = (type: string) => {
        if (propertyTypes.includes(type)) {
            setPropertyTypes(propertyTypes.filter((t) => t !== type))
        } else {
            setPropertyTypes([...propertyTypes, type])
        }
    }

    const handleDealSelect = (type: string) => {
        setDealType(type)
    }

    const formatAmount = (value: number, unit: number, isDeposit = true) => {
        const limit = isDeposit ? DEPOSIT_MAX : MONTHLY_MAX
        if (value >= limit) return '무제한'

        const amount = value / 10_000
        if (amount >= 10_000) {
            return `${(amount / 10_000).toFixed(amount % 10_000 === 0 ? 0 : 1)}억`
        } else {
            return `${amount.toLocaleString()}만원`
        }
    }

    const isDepositEnabled = dealType === '전세' || dealType === '매매' || dealType === '월세'
    const isMonthlyEnabled = dealType === '월세'

    const trackStyle = [{ backgroundColor: '#7171D7', height: 8 }]
    const handleStyle = [
        { backgroundColor: '#ffffff', borderColor: '#e5e5e5', opacity: 1, width: 18, height: 18, marginTop: -6 },
        { backgroundColor: '#ffffff', borderColor: '#e5e5e5', opacity: 1, width: 18, height: 18, marginTop: -6 },
    ]
    const railStyle = { backgroundColor: '#E7E7FF', height: 8 }

    return (
        <div className="flex flex-col gap-4 w-[350px] h-[540px] mx-auto">
            <h2 className="text-lg font-bold mt-4 mb-1">매물</h2>

            {/* 매물 유형 */}
            <div className="mb-2">
                <h2 className="text-base font-semibold mb-2">매물 유형</h2>
                <div className="flex gap-4">
                    {propertyOptions.map((type) => {
                        const selected = propertyTypes.includes(type)
                        return (
                            <button
                                key={type}
                                onClick={() => togglePropertyType(type)}
                                className={`w-28 py-2 text-sm rounded-lg border transition ${selected
                                    ? 'bg-ssaeng-purple-light text-ssaeng-purple border-ssaeng-purple'
                                    : 'bg-white text-gray-500 border-gray-300 hover:bg-gray-100'
                                    }`}
                            >
                                {type}
                            </button>
                        )
                    })}
                </div>
            </div>

            {/* 거래 유형 */}
            <div className="mb-2">
                <h2 className="text-base font-semibold mb-2">거래 유형</h2>
                <div className="flex gap-4">
                    {dealOptions.map((type) => (
                        <button
                            key={type}
                            onClick={() => handleDealSelect(type)}
                            className={`w-28 py-2 text-sm rounded-lg border transition ${dealType === type
                                ? 'bg-ssaeng-purple-light text-ssaeng-purple border-ssaeng-purple'
                                : 'bg-white text-gray-500 border-gray-300 hover:bg-gray-100'
                                }`}
                        >
                            {type}
                        </button>
                    ))}
                </div>
            </div>

            {/* 보증금 */}
            <div className="mb-2">
                <p className={`text-base font-medium mb-1 ${!isDepositEnabled && 'text-gray-100'}`}>보증금(전세금)</p>
                <p className={`text-xs ${isDepositEnabled ? 'text-ssaeng-purple' : 'text-gray-100'} text-right pr-4`}>
                    {formatAmount(minDeposit, DEPOSIT_UNIT)} ~ {formatAmount(maxDeposit, DEPOSIT_UNIT)}
                </p>
                <div className={`w-[332px] mx-auto ${!isDepositEnabled ? 'opacity-20' : ''}`}>
                    <Slider
                        range
                        disabled={!isDepositEnabled}
                        min={0}
                        max={DEPOSIT_SLIDER_MAX}
                        step={1}
                        value={[
                            Math.min(minDeposit / DEPOSIT_UNIT, DEPOSIT_SLIDER_MAX),
                            Math.min(maxDeposit >= DEPOSIT_MAX ? DEPOSIT_SLIDER_MAX : maxDeposit / DEPOSIT_UNIT, DEPOSIT_SLIDER_MAX),
                        ]}
                        onChange={(value) => {
                            const [min, max] = value as number[]
                            setMinDeposit(min * DEPOSIT_UNIT)
                            setMaxDeposit(max >= DEPOSIT_SLIDER_MAX ? DEPOSIT_MAX + 1 : max * DEPOSIT_UNIT)
                        }}
                        trackStyle={trackStyle}
                        handleStyle={handleStyle}
                        railStyle={railStyle}
                    />
                </div>
            </div>

            {/* 월세 */}
            <div>
                <p className={`text-base font-medium mb-1 ${!isMonthlyEnabled && 'text-gray-100'}`}>월세</p>
                <p className={`text-xs ${isMonthlyEnabled ? 'text-ssaeng-purple' : 'text-gray-100'} text-right pr-4`}>
                    {formatAmount(minMonthly, MONTHLY_UNIT, false)} ~ {formatAmount(maxMonthly, MONTHLY_UNIT, false)}
                </p>
                <div className={`w-[332px] mx-auto ${!isMonthlyEnabled ? 'opacity-20' : ''}`}>
                    <Slider
                        range
                        disabled={!isMonthlyEnabled}
                        min={0}
                        max={MONTHLY_SLIDER_MAX}
                        step={1}
                        value={[
                            Math.min(minMonthly / MONTHLY_UNIT, MONTHLY_SLIDER_MAX),
                            Math.min(maxMonthly >= MONTHLY_MAX ? MONTHLY_SLIDER_MAX : maxMonthly / MONTHLY_UNIT, MONTHLY_SLIDER_MAX),
                        ]}
                        onChange={(value) => {
                            const [min, max] = value as number[]
                            setMinMonthly(min * MONTHLY_UNIT)
                            setMaxMonthly(max >= MONTHLY_SLIDER_MAX ? MONTHLY_MAX + 1 : max * MONTHLY_UNIT)
                        }}
                        trackStyle={trackStyle}
                        handleStyle={handleStyle}
                        railStyle={railStyle}
                    />
                </div>
            </div>

            {/* 페이지 인디케이터 */}
            <div className="flex justify-center w-full mt-8 space-x-2">
                {Array.from({ length: totalStep }, (_, i) => (
                    <span
                        key={i}
                        className={`w-2 h-2 rounded-full ${currentStep === i + 1 ? 'bg-ssaeng-purple' : 'bg-gray-300'}`}
                    />
                ))}
            </div>

            {/* 다음 버튼 */}
            <div className="mt-auto w-full flex justify-end pt-4 mb-4">
                <button
                    onClick={handleNext}
                    className="px-6 py-2 bg-ssaeng-purple text-white rounded-md text-sm shadow-md"
                >
                    다음
                </button>
            </div>
        </div>
    )
}

export default PropertyFilterStep