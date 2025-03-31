import React, { useState } from 'react'
import Modal from './Modals/MatchModal'
import useMatchInfoStore from '@/store/matchInfoStore'
import PropertyFilter from './Modals/Match/PropertyInfo'

const CustomInfo: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  // Zustand store에서 상태 가져오기
  const { address, name, transportMode, travelTime, walkTime } =
    useMatchInfoStore()

  const handleBoxClick = () => {
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
  }

  return (
    <div className="mb-6">
      {/* 상단 텍스트와 버튼 */}
      <div className="flex items-center px-4 mb-4">
        <h2 className="text-lg font-bold mr-2">맞춤 정보</h2>
        <button className="flex items-center justify-center w-6 h-6 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition">
          +
        </button>
      </div>

      {/* 클릭 가능한 회색 박스 */}
      {address || name || transportMode || travelTime || walkTime ? (
        <div className="flex flex-col justify-center items-start w-full h-96 bg-gray-200 rounded-lg text-gray-700 p-4">
          <h3 className="text-lg font-bold mb-2">주소</h3>
          <div className="flex items-center w-full h-24 justify-between bg-white p-4 rounded-lg shadow-md">
            <div className="flex flex-col">
              {/* 이름 */}
              <span className="text-md font-semibold text-green-600 bg-green-100 px-2 py-1 rounded-lg inline-block">
                {name}
              </span>
              {/* 주소 */}
              <span className="text-sm text-gray-700 ml-3 truncate">
                {address}
              </span>
            </div>
            {/* 오른쪽 화살표 아이콘 */}
            <span className="text-gray-400 ml-auto">{'>'}</span>
          </div>

          <h3 className="text-lg font-bold mb-2">교통</h3>
          <div className="flex w-full bg-white items-center p-4 rounded-lg shadow-md text-gray-700">
            <div className="flex flex-col">
              {/* 교통 수단 */}
              <span className="text-xs font-semibold text-purple-600 bg-purple-100 px-2 py-1 rounded-lg inline-block mb-2">
                {transportMode}
              </span>

              {/* 전체 이동 시간 */}
              <p className="text-sm mb-1">
                전체 이동시간은{' '}
                <span className="text-blue-600 bg-blue-100 px-2 py-1 rounded-lg inline-block">
                  {travelTime}분 이내
                </span>{' '}
                이면 좋겠고,
              </p>

              {/* 도보 이동 시간 */}
              <p className="text-sm">
                도보 이동시간은{' '}
                <span className="text-blue-600 bg-blue-100 px-2 py-1 rounded-lg inline-block">
                  {walkTime}분 이내
                </span>{' '}
                이면 좋겠어요.
              </p>
            </div>
            {/* 오른쪽 화살표 아이콘 */}
            <span className="text-gray-400 ml-auto">{'>'}</span>
          </div>
        </div>
      ) : (
        <button
          className="flex justify-center items-center w-full h-96 bg-gray-200 rounded-lg text-gray-500 cursor-pointer hover:bg-gray-300 transition"
          onClick={handleBoxClick}
        >
          이곳을 클릭해 맞춤 정보를 설정해주세요.
        </button>
      )}
      <PropertyFilter />

      {/* 모달 컴포넌트 */}
      <Modal isOpen={isModalOpen} onClose={handleCloseModal} />
    </div>
  )
}

export default CustomInfo
