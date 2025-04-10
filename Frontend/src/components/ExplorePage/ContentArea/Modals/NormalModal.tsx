import { useState } from 'react'
import ReactDOM from 'react-dom'
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
    setDealType,
    setMinDepositPrice,
    setMaxDepositPrice,
    setMinMonthlyPrice,
    setMaxMonthlyPrice,
    setAdditionalFilters,
  } = useFilterStore()

  const [propertyTypes, setLocalPropertyTypes] = useState<string[]>([])
  const [transactionTypes, setLocalTransactionTypes] = useState<string>('')

  const [minDepositPrice, setLocalMinDepositPrice] = useState(0)
  const [maxDepositPrice, setLocalMaxDepositPrice] = useState(200000000)

  const [minMonthlyPrice, setLocalMinMonthlyPrice] = useState(0)
  const [maxMonthlyPrice, setLocalMaxMonthlyPrice] = useState(200000000)

  const [additionalFilters, setLocalAdditionalFilters] = useState<string[]>([])

  // 현재 페이지 상태
  const [currentPage, setCurrentPage] = useState(1)

  if (!isOpen) return null

  const handleComplete = () => {
    // Zustand에 상태 저장
    setPropertyTypes(propertyTypes)
    setDealType(transactionTypes)
    setMinDepositPrice(minDepositPrice)
    setMaxDepositPrice(maxDepositPrice)
    setMinMonthlyPrice(minMonthlyPrice)
    setMaxMonthlyPrice(maxMonthlyPrice)
    setAdditionalFilters(additionalFilters)
    // 페이지 초기화
    setCurrentPage(1)
    // 모달 닫기
    onClose()
  }

  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto p-6">
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-xl"
          onClick={onClose}
        >
          ✕
        </button>

        {currentPage === 1 && (
          <>
            <PropertyTransactionSelector
              propertyTypes={propertyTypes}
              transactionTypes={transactionTypes}
              setPropertyTypes={setLocalPropertyTypes}
              setTransactionTypes={setLocalTransactionTypes}
            />
            <DepositSlider
              minDeposit={minDepositPrice}
              maxDeposit={maxDepositPrice}
              setMinDeposit={setLocalMinDepositPrice}
              setMaxDeposit={setLocalMaxDepositPrice}
            />
            <MonthlySlider
              minMonthlyRent={minMonthlyPrice}
              maxMonthlyRent={maxMonthlyPrice}
              setMinMonthlyRent={setLocalMinMonthlyPrice}
              setMaxMonthlyRent={setLocalMaxMonthlyPrice}
            />
            <div className="flex justify-end mt-4">
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                onClick={() => setCurrentPage(2)}
              >
                다음
              </button>
            </div>
          </>
        )}

        {currentPage === 2 && (
          <>
            <AdditionalFilters
              filters={['공원', '관공서', '세탁소', '병원', '약국', '동물 병원']}
              selectedFilters={additionalFilters}
              toggleFilterSelection={(filter) =>
                setLocalAdditionalFilters((prev) =>
                  prev.includes(filter)
                    ? prev.filter((item) => item !== filter)
                    : [...prev, filter],
                )
              }
            />
            <div className="flex justify-between mt-4">
              <button
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                onClick={() => setCurrentPage(1)}
              >
                이전
              </button>
              <button
                className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
                onClick={handleComplete}
              >
                완료
              </button>
            </div>
          </>
        )}
      </div>
    </div>,
    document.body // 이게 핵심! body에 직접 렌더링
  )
}

export default Modal
