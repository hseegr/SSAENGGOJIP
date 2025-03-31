import { useState } from 'react'
import PropertyTransactionSelector from './Normal/PropertySelector'
import DepositSlider from './Normal/DepositSlider'
import MonthlySlider from './Normal/MonthlySlider'
import AdditionalFilters from './Normal/AdditionalFilter'
import useFilterStore from '@/store/filterStore' // Zustand Store

interface ModalProps {
  isOpen: boolean // isOpen은 boolean 타입
  onClose: () => void // onClose는 함수 타입
}

const Modal = ({ isOpen, onClose }: ModalProps) => {
  const {
    setPropertyTypes,
    setTransactionTypes,
    setMinDepositPrice,
    setMaxDepositPrice,
    setMinMonthlyPrice,
    setMaxMonthlyPrice,
    setAdditionalFilters,
  } = useFilterStore()

  const [propertyTypes, setLocalPropertyTypes] = useState<string[]>([])
  const [transactionTypes, setLocalTransactionTypes] = useState<string>('')

  const [minDepositPrice, setLocalMinDepositPrice] = useState(0)
  const [maxDepositPrice, setLocalMaxDepositPrice] = useState(10000)

  const [minMonthlyPrice, setLocalMinMonthlyPrice] = useState(0)
  const [maxMonthlyPrice, setLocalMaxMonthlyPrice] = useState(10000)

  const [additionalFilters, setLocalAdditionalFilters] = useState<string[]>([])

  // 현재 페이지 상태
  const [currentPage, setCurrentPage] = useState(1)

  if (!isOpen) return null

  const handleComplete = () => {
    // Zustand에 상태 저장
    setPropertyTypes(propertyTypes)
    setTransactionTypes(transactionTypes)
    setMinDepositPrice(minDepositPrice)
    setMaxDepositPrice(maxDepositPrice)
    setMinMonthlyPrice(minMonthlyPrice)
    setMaxMonthlyPrice(maxMonthlyPrice)
    setAdditionalFilters(additionalFilters)

    // 모달 닫기
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      {/* 모달 콘텐츠 */}
      <div className="relative bg-white w-[500px] h-[600px] rounded-lg shadow-lg p-6">
        {/* X 버튼 */}
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
          onClick={onClose}
        >
          ✕
        </button>

        {/* 페이지네이션 콘텐츠 */}
        {currentPage === 1 && (
          <>
            {/* 매물 및 거래 유형 */}
            <PropertyTransactionSelector
              propertyTypes={propertyTypes}
              transactionTypes={transactionTypes}
              setPropertyTypes={setLocalPropertyTypes}
              setTransactionTypes={setLocalTransactionTypes}
            />

            {/* 보증금 슬라이더 */}
            <DepositSlider
              minDeposit={minDepositPrice}
              maxDeposit={maxDepositPrice}
              setMinDeposit={setLocalMinDepositPrice}
              setMaxDeposit={setLocalMaxDepositPrice}
            />

            {/* 월세 슬라이더 */}
            <MonthlySlider
              minMonthlyRent={minMonthlyPrice}
              maxMonthlyRent={maxMonthlyPrice}
              setMinMonthlyRent={setLocalMinMonthlyPrice}
              setMaxMonthlyRent={setLocalMaxMonthlyPrice}
            />

            {/* 다음 버튼 */}
            <div className="flex justify-end mt-4">
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                onClick={() => setCurrentPage(2)} // 다음 페이지로 이동
              >
                다음
              </button>
            </div>
          </>
        )}

        {currentPage === 2 && (
          <>
            {/* 추가 필터 */}
            <AdditionalFilters
              filters={[
                '공원',
                '관공서',
                '세탁소',
                '병원',
                '약국',
                '동물 병원',
              ]}
              selectedFilters={additionalFilters}
              toggleFilterSelection={(filter) =>
                setLocalAdditionalFilters((prev) =>
                  prev.includes(filter)
                    ? prev.filter((item) => item !== filter)
                    : [...prev, filter],
                )
              }
            />

            {/* 이전 버튼 및 완료 버튼 */}
            <div className="flex justify-between mt-4">
              <button
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                onClick={() => setCurrentPage(1)} // 이전 페이지로 이동
              >
                이전
              </button>
              <button
                className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
                onClick={handleComplete} // 완료 시 Zustand에 저장 및 모달 닫기
              >
                완료
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default Modal
