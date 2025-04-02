import React, { useState, useEffect } from 'react'
import Modal from './Modals/MatchModal'
import AddressModal from './Modals/Match/AddressModal'
import useMatchInfoStore from '@/store/matchInfoStore'
import PropertyFilter from './Modals/Match/PropertyInfo'
import { useUserStore } from '@/store/userStore'

const CustomInfo: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedBoxId, setSelectedBoxId] = useState<number | null>(null)
  const { isLoggedIn } = useUserStore()
  // Zustand store에서 상태 가져오기
  const { matchInfos, addMatchInfo, updateMatchInfo } = useMatchInfoStore()

  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false)

  // 유저 로그인 상태 확인 및 API 호출
  useEffect(() => {
    if (!isLoggedIn) return console.log('로그인 안되있어요') // 로그인이 되어 있지 않으면 요청하지 않음

    const fetchDefaultAddress = async () => {
      try {
        const response = await fetch('/api/target-address') // API 엔드포인트
        const data = await response.json()

        if (data.isSuccess && data.result) {
          // isDefault가 true인 데이터 필터링
          const defaultAddress = data.result.find((item: any) => item.isDefault)
          if (defaultAddress) {
            // 박스 정보로 추가
            const tmpId = addMatchInfo()
            updateMatchInfo(tmpId, {
              address: defaultAddress.address,
              name: defaultAddress.name,
              transportMode: defaultAddress.transportMode,
              travelTime: defaultAddress.travelTime,
              walkTime: defaultAddress.walkTime,
            })
          }
        }
      } catch (error) {
        console.error('API 호출 중 오류 발생:', error)
      }
    }

    void fetchDefaultAddress()
  }, [isLoggedIn, addMatchInfo, updateMatchInfo])

  const handleBoxClick = (id: number | void) => {
    if (id !== undefined) {
      // void(=undefined) 체크
      console.log(`Selected Box ID: ${id}`)
      setSelectedBoxId(id)
      setIsModalOpen(true)
    }
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
    const newId = addMatchInfo() // 새로운 박스를 추가하고 ID를 반환받음
    handleBoxClick(newId) // 새로 생성된 박스의 ID를 전달하여 클릭 처리
  }

  const handleAddressModalOpen = () => {
    setIsAddressModalOpen(true)
  }
  const handleAddressModalClose = () => {
    setIsAddressModalOpen(false) // AddressModal 닫기
  }

  return (
    <div className="mb-6">
      {/* 상단 텍스트와 버튼 */}
      <div className="flex items-center justify-between px-4 mb-4">
        <div className="flex">
          <h2 className="text-lg font-bold mr-2">맞춤 정보</h2>
          <button
            onClick={handleAddBox}
            className="flex items-center justify-center w-6 h-6 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition"
          >
            +
          </button>
        </div>
        <div>
          <button
            className="flex items-center justify-center bg-green-300 rounded"
            onClick={handleAddressModalOpen}
          >
            저장된 주소
          </button>
        </div>
      </div>

      {/* 회색 박스들 */}
      {matchInfos.length > 0 ? (
        matchInfos.map((info) => (
          <button
            key={JSON.stringify(info)}
            className="flex flex-col justify-center mb-3 items-center w-full h-96 bg-gray-200 rounded-lg text-gray-700"
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
                <div
                  className="z-[9999] text-red-500"
                  role="button"
                  aria-hidden="true" // 접근성 트리에서 제외
                  onClick={(e) => {
                    e.stopPropagation() // 부모 버튼의 클릭 이벤트 방지
                    const confirmed = window.confirm('정말 삭제하시겠습니까?')
                    if (confirmed) {
                      console.log(`${info.id} 삭제됨`)
                      // 여기에 삭제 로직 추가
                    }
                  }}
                >
                  X
                </div>
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
                <span className="flex justify-center items-center w-full h-96 bg-gray-200 rounded-lg text-gray-500 cursor-pointer hover:bg-gray-300 transition">
                  이곳을 클릭해 맞춤 정보를 설정하세요.
                </span>
              </>
            )}
          </button>
        ))
      ) : (
        <div className="flex flex-col justify-center mb-3 items-center w-full h-96 bg-gray-200 rounded-lg text-gray-700">
          <button
            className="flex justify-center items-center w-full h-96 bg-gray-200 rounded-lg text-gray-500 cursor-pointer hover:bg-gray-300 transition"
            onClick={handleAddBox}
          >
            이곳을 클릭해 맞춤 정보를 설정해주세요.
          </button>
        </div>
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

      {/* Address Modal 컴포넌트 */}
      {isAddressModalOpen && (
        <AddressModal
          isOpen={isAddressModalOpen}
          onClose={handleAddressModalClose}
        />
      )}
    </div>
  )
}

export default CustomInfo
