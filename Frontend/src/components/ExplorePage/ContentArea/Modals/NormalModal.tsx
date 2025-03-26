import React, { useState } from 'react'
import ReactDOM from 'react-dom'
import Slider from 'rc-slider' // React Slider 라이브러리
import 'rc-slider/assets/index.css' // 슬라이더 스타일
import useFilterStore from '@/store/filterStore'

const Modal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  const modalRoot = document.getElementById('modal-root')
  const [currentPage, setCurrentPage] = useState(1) // 페이지 네이션 상태

  const {
    propertyTypes,
    transactionTypes,
    MindepositPrice,
    MinmonthlyPrice,
    MaxdepositPrice,
    MaxmonthlyPrice,
    setPropertyTypes,
    setTransactionTypes,
    setMinDepositPrice,
    setMinMonthlyPrice,
    setMaxDepositPrice,
    setMaxMonthlyPrice,
  } = useFilterStore()

  const toggleSelection = (
    typeList: string[],
    setterFunction: (types: string[]) => void,
    value: string,
  ) => {
    if (typeList.includes(value)) {
      setterFunction(typeList.filter((item) => item !== value))
    } else {
      setterFunction([...typeList, value])
    }
  }

  if (!isOpen) return null

  return ReactDOM.createPortal(
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[1000]">
      <div className="bg-white rounded-lg shadow-lg relative w-[425px] h-[633px] px-6 py-4">
        {/* 닫기 버튼 */}
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          onClick={onClose}
        >
          ✕
        </button>

        {/* 제목 */}
        <h2 className="text-xl font-bold mb-2">가격</h2>
        {/* 매물 유형 */}
        <div className="mb-6">
          <span className="text-lg font-medium mb-2 block">매물 유형</span>
          <div className="flex items-center justify-center gap-7">
            {['아파트', '오피스텔', '빌라'].map((type) => (
              <button
                key={type}
                className={`w-[110px] h-[40px] border rounded-md flex items-center justify-center ${
                  propertyTypes.includes(type)
                    ? 'bg-ssaeng-purple text-white'
                    : 'text-gray-700 border-gray-300'
                }`}
                onClick={() =>
                  toggleSelection(propertyTypes, setPropertyTypes, type)
                }
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* 거래 유형 */}
        <div className="mb-6">
          <span className="text-lg font-medium mb-2 block">거래 유형</span>
          <div className="flex items-center justify-center gap-7">
            {['전세', '월세', '매매'].map((type) => (
              <button
                key={type}
                className={`w-[110px] h-[40px] border rounded-md flex items-center justify-center ${
                  transactionTypes.includes(type)
                    ? 'bg-ssaeng-purple text-white'
                    : 'text-gray-700 border-gray-300'
                }`}
                onClick={() =>
                  toggleSelection(transactionTypes, setTransactionTypes, type)
                }
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* 보증금 슬라이더 */}
        <div className="mb-6">
          <span className="block text-sm font-medium mb-2">
            보증금 (전세금)
          </span>
          <Slider
            range
            min={0}
            max={10000}
            value={[MindepositPrice, MaxdepositPrice]}
            onChange={(value) => {
              setMinDepositPrice(value[0])
              setMaxDepositPrice(value[1])
            }}
            trackStyle={[{ backgroundColor: '#7171D7' }]}
            handleStyle={[
              { borderColor: '#7171D7', backgroundColor: '#FFFFFF' },
              { borderColor: '#7171D7', backgroundColor: '#FFFFFF' },
            ]}
          />
          <div className="flex justify-between mt-2 text-sm text-gray-500">
            <span>{MindepositPrice}원</span>
            <span>
              {MaxdepositPrice === 10000 ? '무제한' : `${MaxdepositPrice}원`}
            </span>
          </div>
          <div className="flex items-center gap-2 mt-4">
            <button
              onClick={() =>
                setMinDepositPrice(Math.max(MindepositPrice - 1000, 0))
              }
              className="w-[39px] h-[39px] flex items-center justify-center border rounded-md text-gray-600"
            >
              -
            </button>
            <input
              type="number"
              value={MindepositPrice}
              onChange={(e) => setMinDepositPrice(Number(e.target.value))}
              className="w-full px-3 py-2 border rounded-md text-center"
            />
            <span>-</span>
            <input
              type="number"
              value={MaxdepositPrice}
              onChange={(e) => setMaxDepositPrice(Number(e.target.value))}
              className="w-full px-3 py-2 border rounded-md text-center"
            />
            <button
              onClick={() =>
                setMaxDepositPrice(Math.min(MaxdepositPrice + 1000, 10000))
              }
              className="w-[39px] h-[39px] flex items-center justify-center border rounded-md text-gray-600"
            >
              +
            </button>
          </div>
        </div>

        {/* 월세 슬라이더 */}
        <div>
          <span className="block text-sm font-medium mb-2">월세</span>
          <Slider
            range
            min={0}
            max={10000}
            value={[MinmonthlyPrice, MaxmonthlyPrice]}
            onChange={(value) => {
              setMinMonthlyPrice(value[0])
              setMaxMonthlyPrice(value[1])
            }}
            trackStyle={[{ backgroundColor: '#7171D7' }]}
            handleStyle={[
              { borderColor: '#7171D7', backgroundColor: '#FFFFFF' },
              { borderColor: '#7171D7', backgroundColor: '#FFFFFF' },
            ]}
          />
          <div className="flex justify-between mt-2 text-sm text-gray-500">
            <span>{MinmonthlyPrice}원</span>
            <span>
              {MaxmonthlyPrice === 10000 ? '무제한' : `${MaxmonthlyPrice}원`}
            </span>
          </div>
          <div className="flex items-center gap-2 mt-4">
            <button
              onClick={() =>
                setMinMonthlyPrice(Math.max(MinmonthlyPrice - 1000, 0))
              }
              className="w-[39px] h-[39px] flex items-center justify-center border rounded-md text-gray-600"
            >
              -
            </button>
            <input
              type="number"
              value={MinmonthlyPrice}
              onChange={(e) => setMinMonthlyPrice(Number(e.target.value))}
              className="w-full px-3 py-2 border rounded-md text-center"
            />
            <span>-</span>
            <input
              type="number"
              value={MaxmonthlyPrice}
              onChange={(e) => setMaxMonthlyPrice(Number(e.target.value))}
              className="w-full px-3 py-2 border rounded-md text-center"
            />
            <button
              onClick={() =>
                setMaxMonthlyPrice(Math.min(MaxmonthlyPrice + 1000, 10000))
              }
              className="w-[39px] h-[39px] flex items-center justify-center border rounded-md text-gray-600"
            >
              +
            </button>
          </div>
        </div>

        {/* 페이지 네이션 */}
        <div className="flex justify-center items-center mt-6">
          {[1, 2].map((page) => (
            <span
              key={page}
              className={`w-[10px] h-[10px] rounded-full mx-[5px] ${
                page === currentPage ? 'bg-purple-600' : 'bg-gray-300'
              }`}
            ></span>
          ))}
        </div>

        {/* 다음 버튼 */}
        {currentPage === 1 && (
          <div className="text-center mt-6">
            <button
              className="bg-purple-600 text-white px-6 py-2 rounded-md"
              onClick={() => setCurrentPage(2)}
            >
              다음
            </button>
          </div>
        )}

        {/* 추가 필터 */}
        {currentPage === 2 && (
          <>
            {/* 제목 */}
            <h2 className="text-lg font-bold mb-6">추가 필터</h2>

            {/* 필터 옵션 */}
            <div>
              {['공원', '관공서', '세탁소', '병원', '약국', '동물 병원'].map(
                (filter) => (
                  <button
                    key={filter}
                    className={`px-3 py-1 border rounded-md ${
                      additionalFilters.includes(filter)
                        ? 'bg-purple-600 text-white'
                        : 'text-gray-700 border-gray-300'
                    }`}
                    onClick={() =>
                      toggleSelection(
                        additionalFilters,
                        setAdditionalFilters,
                        filter,
                      )
                    }
                  >
                    {filter}
                  </button>
                ),
              )}
            </div>

            {/* 이전 및 완료 버튼 */}
            <div className="flex justify-between mt-6">
              <button
                className="bg-gray-300 text-black px-6 py-2 rounded-md"
                onClick={() => setCurrentPage(1)}
              >
                이전
              </button>
              <button
                className="bg-purple-600 text-white px-6 py-2 rounded-md"
                onClick={onClose}
              >
                완료
              </button>
            </div>
          </>
        )}
      </div>
    </div>,
    document.body,
  )
}

export default Modal
