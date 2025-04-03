import React, { useState, useEffect } from 'react'
import Modal from './Modals/MatchModal'
import AddressModal from './Modals/Match/AddressModal'
import useMatchInfoStore from '@/store/matchInfoStore'
import PropertyFilter from './Modals/Match/PropertyInfo'
import { useUserStore } from '@/store/userStore'
import matchSearchStore from '@/store/matchSearchStore'
import MatchSearchResults from './Match/MatchSearchResult'

const CustomInfo: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedBoxId, setSelectedBoxId] = useState<number | null>(null)
  const { isLoggedIn } = useUserStore()
  // Zustand store에서 상태 가져오기
  const { matchInfos, addMatchInfo, updateMatchInfo } = useMatchInfoStore()

  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false)

  const { isSearching } = matchSearchStore()

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
      {isSearching ? (
        <MatchSearchResults />
      ) : (
        <>
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
                {/* 데이터 표시 */}
                {info.address ||
                info.name ||
                info.transportMode ||
                info.travelTime ||
                info.walkTime ? (
                  <>
                    {/* 상세 정보 표시 */}
                    <h3 className="text-lg font-bold mb-2">주소</h3>
                    {/* ... 나머지 상세 정보 ... */}
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
              boxId={selectedBoxId}
            />
          )}

          {/* Address Modal 컴포넌트 */}
          {isAddressModalOpen && (
            <AddressModal
              isOpen={isAddressModalOpen}
              onClose={handleAddressModalClose}
            />
          )}
        </>
      )}
    </div>
  )
}

export default CustomInfo
