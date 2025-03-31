import { useState } from 'react'
import Address from './Match/Address'
import Transport from './Match/Transport'
import useMatchInfoStore from '@/store/matchInfoStore'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  boxId: number // 선택된 박스의 ID
}

const Modal = ({ isOpen, onClose, boxId }: ModalProps) => {
  const [currentPage, setCurrentPage] = useState(1) // 현재 페이지 상태
  const [address, setAddress] = useState('')
  const [name, setName] = useState('')
  const [transportMode, setTransportMode] = useState('')
  const [travelTime, setTravelTime] = useState(0)
  const [walkTime, setWalkTime] = useState(0)

  const { updateMatchInfo } = useMatchInfoStore()

  if (!isOpen) return null

  // 페이지 이동 핸들러
  const handleNextPage = () => {
    setCurrentPage((prev) => prev + 1)
  }

  const handlePrevPage = () => {
    setCurrentPage((prev) => prev - 1)
  }

  const handleComplete = () => {
    updateMatchInfo(boxId, {
      address,
      name,
      transportMode,
      travelTime,
      walkTime,
    })
    setCurrentPage(1) // 페이지 초기화
    // 상태 변경이 반영될 시간을 주기 위해 살짝 지연
    setTimeout(() => {
      onClose()
    }, 100) // 0.1초 후 모달 닫기
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg relative h-3/4 w-1/4">
        {/* 닫기 버튼 */}
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
          onClick={onClose}
        >
          ✕
        </button>

        {/* 페이지 렌더링 */}
        {currentPage === 1 && (
          <Address
            address={address}
            setAddress={setAddress}
            name={name}
            setName={setName}
          />
        )}
        {currentPage === 2 && (
          <Transport
            transportMode={transportMode}
            setTransportMode={setTransportMode}
            travelTime={travelTime}
            setTravelTime={setTravelTime}
            walkTime={walkTime}
            setWalkTime={setWalkTime}
          />
        )}

        {/* 페이지네이션 버튼 */}
        <div className="flex justify-between mt-6">
          {currentPage === 2 && (
            <button
              onClick={handlePrevPage}
              className="py-2 px-4 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
            >
              이전
            </button>
          )}
          {currentPage === 1 && (
            <button
              onClick={handleNextPage}
              className="py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              다음
            </button>
          )}
          {currentPage === 2 && (
            <button
              onClick={handleComplete}
              className="py-2 px-4 bg-purple-500 text-white rounded-lg hover:bg-purple-600"
            >
              완료
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default Modal
