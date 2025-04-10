import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom'
import AdditionalFilters from '../Normal/AdditionalFilter'
import usePriceStore from '@/store/matchPriceStore'
import Slider from 'rc-slider'
import '@/styles/rc-slider.css'

interface ModalWithPaginationProps {
  isOpen: boolean
  onClose: () => void
}

const DEPOSIT_UNIT = 50_000_000
const DEPOSIT_MAX = 2_050_000_000
const DEPOSIT_SLIDER_MAX = 42

const MONTHLY_UNIT = 100_000
const MONTHLY_MAX = 4_100_000
const MONTHLY_SLIDER_MAX = 42

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

const ModalWithPagination: React.FC<ModalWithPaginationProps> = ({ isOpen, onClose }) => {
  const [currentPage, setCurrentPage] = useState(1)
  const [localMinDeposit, setLocalMinDeposit] = useState(0)
  const [localMaxDeposit, setLocalMaxDeposit] = useState(0)
  const [localMinMonthlyRent, setLocalMinMonthlyRent] = useState(0)
  const [localMaxMonthlyRent, setLocalMaxMonthlyRent] = useState(0)
  const [localAdditionalFilters, setLocalAdditionalFilters] = useState<string[]>([])

  const {
    minDeposit,
    maxDeposit,
    minMonthlyRent,
    maxMonthlyRent,
    additionalFilters,
    setMinDeposit,
    setMaxDeposit,
    setMinMonthlyRent,
    setMaxMonthlyRent,
    setAdditionalFilters,
  } = usePriceStore()

  useEffect(() => {
    if (isOpen) {
      setLocalMinDeposit(minDeposit)
      setLocalMaxDeposit(Math.min(maxDeposit, DEPOSIT_MAX))
      setLocalMinMonthlyRent(minMonthlyRent)
      setLocalMaxMonthlyRent(Math.min(maxMonthlyRent, MONTHLY_MAX))
      setLocalAdditionalFilters(additionalFilters)
    }
  }, [isOpen])

  const handleClose = () => {
    setCurrentPage(1)
    onClose()
  }

  const handleComplete = () => {
    setMinDeposit(localMinDeposit)
    setMaxDeposit(Math.min(localMaxDeposit, DEPOSIT_MAX))
    setMinMonthlyRent(localMinMonthlyRent)
    setMaxMonthlyRent(localMaxMonthlyRent)
    setAdditionalFilters(localAdditionalFilters)
    handleClose()
  }

  const trackStyle = [{ backgroundColor: '#7171D7', height: 8 }]
  const handleStyle = [
    { backgroundColor: '#ffffff', borderColor: '#e5e5e5', opacity: 1, width: 18, height: 18, marginTop: -6 },
    { backgroundColor: '#ffffff', borderColor: '#e5e5e5', opacity: 1, width: 18, height: 18, marginTop: -6 },
  ]
  const railStyle = { backgroundColor: '#E7E7FF', height: 8 }

  if (!isOpen) return null

  return ReactDOM.createPortal(
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div className="relative bg-white rounded-xl shadow-2xl w-[420px] h-[540px] overflow-y-auto p-6">
        {/* 닫기 버튼 */}
        <button
          className="absolute top-5 right-5 text-gray-500 hover:text-gray-800 text-xl"
          onClick={handleClose}
        >
          ✖
        </button>
        {currentPage === 1 && (
          <div className="flex flex-col gap-4">
            <h2 className="text-lg font-bold mt-4">매물</h2>
            <div className="mb-8">
              <p className={`text-base font-medium mb-1`}>보증금(전세금)</p>
              {/* 보증금 슬라이더 */}
              <p className={`text-xs text-right text-ssaeng-purple mb-1 pr-4`}>
                {formatAmount(localMinDeposit, DEPOSIT_UNIT)} ~ {formatAmount(localMaxDeposit, DEPOSIT_UNIT)}
              </p>
              <div className={`w-[332px] mx-auto`}>
                <Slider
                  range
                  min={0}
                  max={DEPOSIT_SLIDER_MAX}
                  step={1}
                  value={[
                    Math.min(localMinDeposit / DEPOSIT_UNIT, DEPOSIT_SLIDER_MAX),
                    Math.min(localMaxDeposit >= DEPOSIT_MAX ? DEPOSIT_SLIDER_MAX : localMaxDeposit / DEPOSIT_UNIT, DEPOSIT_SLIDER_MAX),
                  ]}
                  onChange={(value) => {
                    const [min, max] = value as number[]
                    setLocalMinDeposit(min * DEPOSIT_UNIT)
                    setLocalMaxDeposit(max >= DEPOSIT_SLIDER_MAX ? DEPOSIT_MAX + 1 : max * DEPOSIT_UNIT)
                  }}
                  trackStyle={trackStyle}
                  handleStyle={handleStyle}
                  railStyle={railStyle}
                />
              </div>
            </div>
            <div>
              <p className={`text-base font-medium mb-1`}>월세</p>
              {/* 월세 슬라이더 */}
              <p className={`text-xs text-right text-ssaeng-purple mb-1 pr-4`}>
                {formatAmount(localMinMonthlyRent, MONTHLY_UNIT, false)} ~ {formatAmount(localMaxMonthlyRent, MONTHLY_UNIT, false)}
              </p>
              <div className={`w-[332px] mx-auto`}>
                <Slider
                  range
                  min={0}
                  max={MONTHLY_SLIDER_MAX}
                  step={1}
                  value={[
                    Math.min(localMinMonthlyRent / MONTHLY_UNIT, MONTHLY_SLIDER_MAX),
                    Math.min(localMaxMonthlyRent >= MONTHLY_MAX ? MONTHLY_SLIDER_MAX : localMaxMonthlyRent / MONTHLY_UNIT, MONTHLY_SLIDER_MAX),
                  ]}
                  onChange={(value) => {
                    const [min, max] = value as number[]
                    setLocalMinMonthlyRent(min * MONTHLY_UNIT)
                    setLocalMaxMonthlyRent(max >= MONTHLY_SLIDER_MAX ? MONTHLY_MAX + 1 : max * MONTHLY_UNIT)
                  }}
                  trackStyle={trackStyle}
                  handleStyle={handleStyle}
                  railStyle={railStyle}
                />
              </div>
            </div>
          </div>
        )}

        {currentPage === 2 && (
          <div className="flex flex-col gap-4">
            <h2 className="text-lg font-bold mt-4">주변 시설 필터</h2>
            <AdditionalFilters
              filters={[
                '병원',
                '약국',
                '동물병원',
                '공원',
                '관공서',
                '편의점',
                '대형마트',
                '세탁소',
              ]}
              selectedFilters={localAdditionalFilters}
              toggleFilterSelection={(filter) =>
                setLocalAdditionalFilters((prev) =>
                  prev.includes(filter)
                    ? prev.filter((item) => item !== filter)
                    : [...prev, filter]
                )
              }
            />
          </div>
        )}

        {/* 하단 버튼 고정 영역 */}
        <div className="absolute bottom-4 left-0 w-full px-6 py-4 bg-white  flex justify-between items-center rounded-b-xl">
          {currentPage > 1 && (
            <button
              className="px-6 py-2 bg-gray-200 text-gray-600 rounded-md text-sm"
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              이전
            </button>
          )}
          {currentPage === 1 && (
            <button
              className="ml-auto px-6 py-2 bg-ssaeng-purple text-white rounded-md text-sm"
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              다음
            </button>
          )}
          {currentPage === 2 && (
            <button
              className="ml-auto px-6 py-2 bg-ssaeng-purple text-white rounded-md text-sm"
              onClick={handleComplete}
            >
              완료
            </button>
          )}
        </div>
      </div>
    </div>,
    document.body
  )
}

export default ModalWithPagination