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
  const { resetMatchInfos, matchInfos, addMatchInfo } = useMatchInfoStore()
  const { isSearching } = matchSearchStore()
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false)

  // 최초 렌더링 시 빈 맞춤 정보 슬롯 하나 추가
  useEffect(() => {
    addMatchInfo()
  }, [addMatchInfo])

  const handleBoxClick = (id: number) => {
    console.log(`Selected Box ID: ${id}`)
    setSelectedBoxId(id)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedBoxId(null)
  }

  const handleAddBox = () => {
    if (useMatchInfoStore.getState().matchInfos.length >= 2) {
      alert('최대 2개의 주소만 추가할 수 있습니다.')
      return
    }
    const newId = addMatchInfo()
    handleBoxClick(newId)
  }

  const handleAddressModalOpen = () => {
    setIsAddressModalOpen(true)
  }

  const handleAddressModalClose = () => {
    setIsAddressModalOpen(false)
  }

  const handleRemoveBox = (e: React.MouseEvent, id: number) => {
    e.stopPropagation() // 부모 div의 onClick 이벤트 방지
    const confirmed = window.confirm('정말 삭제하시겠습니까?')
    if (confirmed) {
      console.log(`${id} 삭제됨`)
      if (matchInfos.length > 1) {
        // 2개 이상일 경우 해당 박스 제거
        resetMatchInfos(matchInfos.filter((info) => info.id !== id))
      } else {
        // 1개만 있을 경우 내부 정보 초기화 (id는 유지)
        resetMatchInfos([
          {
            id: matchInfos[0].id,
            address: '',
            name: '',
            transportMode: '',
            travelTime: 0,
            walkTime: 0,
            latitude: 0,
            longitude: 0,
          },
        ])
      }
    }
  }

  return (
    <div className="mb-6">
      {isSearching ? (
        <MatchSearchResults />
      ) : (
        <>
          {/* 상단 텍스트와 버튼 */}
          <div className="flex items-center justify-between px-4 mt-8 mb-4">
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
              {isLoggedIn && (
                <button
                  className="flex items-center justify-center bg-green-300 rounded"
                  onClick={handleAddressModalOpen}
                >
                  저장된 주소
                </button>
              )}
            </div>
          </div>

          {/* 회색 박스들 */}
          {useMatchInfoStore.getState().matchInfos.map((info) => (
            <div
              key={info.id}
              className="flex flex-col justify-center mb-3 items-center w-full h-96 bg-gray-200 rounded-lg text-gray-700"
              onClick={() => handleBoxClick(info.id)}
              role="button"
              aria-hidden="true"
            >
              {info.address ||
                info.name ||
                info.transportMode ||
                info.travelTime ||
                info.walkTime ? (
                <>
                  <h3 className="text-lg font-bold mb-2">주소</h3>
                  <button
                    className="z-[9999] text-red-500"
                    onClick={(e) => handleRemoveBox(e, info.id)}
                  >
                    X
                  </button>
                  <div className="flex items-center w-full h-24 justify-between bg-white p-4 rounded-lg shadow-md">
                    <div className="flex flex-col">
                      <span className="text-md font-semibold text-green-600 bg-green-100 px-2 py-1 rounded-lg inline-block">
                        {info.name}
                      </span>
                      <span className="text-sm text-gray-700 ml-3 truncate">
                        {info.address}
                      </span>
                    </div>
                    <span className="text-gray-400 ml-auto">{'>'}</span>
                  </div>

                  <h3 className="text-lg font-bold mb-2">교통</h3>
                  <div className="flex w-full bg-white items-center p-4 rounded-lg shadow-md text-gray-700">
                    <div className="flex flex-col">
                      <span className="text-xs font-semibold text-purple-600 bg-purple-100 px-2 py-1 rounded-lg inline-block mb-2">
                        {info.transportMode}
                      </span>
                      <p className="text-sm mb-1">
                        전체 이동시간은{' '}
                        <span className="text-blue-600 bg-blue-100 px-2 py-1 rounded-lg inline-block">
                          {info.travelTime}분 이내
                        </span>{' '}
                        이면 좋겠고,
                      </p>
                      <p className="text-sm">
                        도보 이동시간은{' '}
                        <span className="text-blue-600 bg-blue-100 px-2 py-1 rounded-lg inline-block">
                          {info.walkTime}분 이내
                        </span>{' '}
                        이면 좋겠어요.
                      </p>
                    </div>
                    <span className="text-gray-400 ml-auto">{'>'}</span>
                  </div>
                </>
              ) : (
                <span className="flex justify-center items-center w-full h-96 bg-gray-200 rounded-lg text-gray-500 cursor-pointer hover:bg-gray-300 transition">
                  이곳을 클릭해 맞춤 정보를 설정해주세요.
                </span>
              )}
            </div>
          ))}

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
