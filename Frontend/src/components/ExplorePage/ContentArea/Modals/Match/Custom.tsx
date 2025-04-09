import React, { useState } from 'react'
import DepositSlider from '../Normal/DepositSlider' // 슬라이더 컴포넌트
import usePriceStore from '@/store/matchPriceStore'
import MonthlySlider from '../Normal/MonthlySlider'
import AdditionalFilters from '../Normal/AdditionalFilter'
import ReactDOM from 'react-dom' // ReactDOM import 추가

interface ModalWithPaginationProps {
  isOpen: boolean
  onClose: () => void
}

const ModalWithPagination: React.FC<ModalWithPaginationProps> = ({
  isOpen,
  onClose,
}) => {
  const [currentPage, setCurrentPage] = useState(1)
  const [localMinDeposit, setLocalMinDeposit] = useState(0)
  const [localMaxDeposit, setLocalMaxDeposit] = useState(0)
  const [localMinMonthlyRent, setLocalMinMonthlyRent] = useState(0)
  const [localMaxMonthlyRent, setLocalMaxMonthlyRent] = useState(0)
  const [localAdditionalFilters, setLocalAdditionalFilters] = useState<
    string[]
  >([])

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

  // 모달이 열릴 때 초기값 설정
  React.useEffect(() => {
    if (isOpen) {
      setLocalMinDeposit(minDeposit)
      setLocalMaxDeposit(maxDeposit)
      setLocalMinMonthlyRent(minMonthlyRent)
      setLocalMaxMonthlyRent(maxMonthlyRent)
      setLocalAdditionalFilters(additionalFilters)
    }
  }, [
    isOpen,
    minDeposit,
    maxDeposit,
    minMonthlyRent,
    maxMonthlyRent,
    additionalFilters,
  ])

  const handleNextPage = () => setCurrentPage((prev) => prev + 1)
  const handlePreviousPage = () => setCurrentPage((prev) => prev - 1)

  const handleClose = () => {
    setCurrentPage(1)
    onClose()
  }

  const handleComplete = () => {
    // Zustand에 상태 저장
    setMinDeposit(localMinDeposit)
    setMaxDeposit(localMaxDeposit)
    setMinMonthlyRent(localMinMonthlyRent)
    setMaxMonthlyRent(localMaxMonthlyRent)
    setAdditionalFilters(localAdditionalFilters)

    // 모달 닫기
    handleClose()
  }

  if (!isOpen) return null

  return ReactDOM.createPortal(
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-[400px] relative">
        {/* 닫기 버튼 */}
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          onClick={handleClose}
        >
          ✕
        </button>

        {/* 페이지 내용 */}
        {currentPage === 1 && (
          <div>
            <h2 className="text-lg font-bold mb-4">매물</h2>
            <p className="text-sm text-gray-700 mb-6">가격</p>

            {/* 보증금 슬라이더 */}
            <DepositSlider
              minDeposit={localMinDeposit}
              maxDeposit={localMaxDeposit}
              setMinDeposit={setLocalMinDeposit}
              setMaxDeposit={setLocalMaxDeposit}
            />

            {/* 월세 슬라이더 */}
            <MonthlySlider
              minMonthlyRent={localMinMonthlyRent}
              maxMonthlyRent={localMaxMonthlyRent}
              setMinMonthlyRent={setLocalMinMonthlyRent}
              setMaxMonthlyRent={setLocalMaxMonthlyRent}
            />
          </div>
        )}
        {currentPage === 2 && (
          <div>
            <AdditionalFilters
              filters={[
                '공원',
                '관공서',
                '세탁소',
                '병원',
                '약국',
                '동물 병원',
              ]}
              selectedFilters={localAdditionalFilters}
              toggleFilterSelection={(filter) =>
                setLocalAdditionalFilters((prev) =>
                  prev.includes(filter)
                    ? prev.filter((item) => item !== filter)
                    : [...prev, filter],
                )
              }
            />
          </div>
        )}

        {/* 페이지네이션 컨트롤 */}
        <div className="flex justify-between items-center mt-6">
          {currentPage > 1 && (
            <div>
              <button
                className="px-4 py-2 bg-gray-200 text-gray-600 rounded hover:bg-gray-300"
                onClick={handlePreviousPage}
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
          )}
          {currentPage === 1 && (
            <button
              className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
              onClick={handleNextPage}
            >
              다음
            </button>
          )}
        </div>
      </div>
    </div>,
    document.body,
  )
}

export default ModalWithPagination
