import React, { useState } from 'react'
import Modal from './Modals/MatchModal'
import useMatchInfoStore from '@/store/matchInfoStore'
import PropertyFilter from './Modals/Match/PropertyInfo'

const CustomInfo: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedBoxId, setSelectedBoxId] = useState<number | null>(null)

  // Zustand store에서 상태 가져오기
  const { matchInfos, addMatchInfo } = useMatchInfoStore()

  const handleBoxClick = (id: number) => {
    console.log(`Selected Box ID: ${id}`) // 디버깅용 로그 출력
    setSelectedBoxId(id) // 클릭한 박스의 ID 설정
    setIsModalOpen(true) // 모달 열기
  }

  const handleCloseModal = () => {
    setIsModalOpen(false) // 모달 닫기
    setSelectedBoxId(null) // 선택된 박스 초기화
  }

  const handleAddBox = () => {
    if (matchInfos.length >= 2) {
      alert('최대 2개의 주소만 추가할 수 있습니다.')
      return
    }
    addMatchInfo() // 새로운 박스 추가
  }

  return (
    <div className="mb-6">
      {/* 상단 텍스트와 버튼 */}
      <div className="flex items-center px-4 mb-4">
        <h2 className="text-lg font-bold mr-2">맞춤 정보</h2>
        <button
          onClick={handleAddBox}
          className="flex items-center justify-center w-6 h-6 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition"
        >
          +
        </button>
      </div>

      {/* 회색 박스들 */}
      {matchInfos.length > 0 ? (
        matchInfos.map((info) => (
          <button
            key={JSON.stringify(info)}
            className="flex flex-col justify-center items-center w-full h-96 bg-gray-200 rounded-lg text-gray-700 p-4 mb-4"
            onClick={() => handleBoxClick(info.id)} // 클릭 시 해당 ID 설정 및 모달 열기
          >
            {/* 이거, 지금 도보 상관없음 또는 전체 이동시간 상관 없음 등 아무것도 선택을 안했을때 문제가 좀 생기는중 */}
            {info.address ||
            info.name ||
            info.transportMode ||
            info.travelTime ||
            info.walkTime ? (
              <>
                {/* 데이터가 있는 경우 상세 정보 표시 */}
                <h3 className="text-lg font-bold mb-2">주소</h3>
                <div className="flex items-center w-full h-24 justify-between bg-white p-4 rounded-lg shadow-md">
                  <div className="flex flex-col">
                    {/* 이름 */}
                    <span className="text-md font-semibold text-green-600 bg-green-100 px-2 py-1 rounded-lg inline-block">
                      {info.name}
                    </span>
                    {/* 주소 */}
                    <span className="text-sm text-gray-700 ml-3 truncate">
                      {info.address}
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
                      {info.transportMode}
                    </span>

                    {/* 전체 이동 시간 */}
                    <p className="text-sm mb-1">
                      전체 이동시간은{' '}
                      <span className="text-blue-600 bg-blue-100 px-2 py-1 rounded-lg inline-block">
                        {info.travelTime}분 이내
                      </span>{' '}
                      이면 좋겠고,
                    </p>

                    {/* 도보 이동 시간 */}
                    <p className="text-sm">
                      도보 이동시간은{' '}
                      <span className="text-blue-600 bg-blue-100 px-2 py-1 rounded-lg inline-block">
                        {info.walkTime}분 이내
                      </span>{' '}
                      이면 좋겠어요.
                    </p>
                  </div>
                  {/* 오른쪽 화살표 아이콘 */}
                  <span className="text-gray-400 ml-auto">{'>'}</span>
                </div>
              </>
            ) : (
              <>
                {/* 데이터가 없는 경우 메시지 표시 */}
                이곳을 클릭해 맞춤 정보를 설정하세요.
              </>
            )}
          </button>
        ))
      ) : (
        <button
          className="flex justify-center items-center w-full h-96 bg-gray-200 rounded-lg text-gray-500 cursor-pointer hover:bg-gray-300 transition"
          onClick={handleAddBox}
        >
          이곳을 클릭해 맞춤 정보를 설정해주세요.
        </button>
      )}

      {/* 공통 필터 컴포넌트 */}
      <PropertyFilter />

      {/* 모달 컴포넌트 */}
      {selectedBoxId && (
        <Modal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          boxId={selectedBoxId} // 선택된 박스 ID 전달
        />
      )}
    </div>
  )
}

export default CustomInfo
