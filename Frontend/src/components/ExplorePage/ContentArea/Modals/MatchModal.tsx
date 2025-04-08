import { useEffect, useState } from 'react'
import Address from './Match/Address'
import Transport from './Match/Transport'
import useMatchInfoStore from '@/store/matchInfoStore'
import ReactDOM from 'react-dom'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  boxId: number // 선택된 박스의 ID
  initialPage?: number
}

const Modal = ({ isOpen, onClose, boxId, initialPage = 1 }: ModalProps) => {
  const [currentPage, setCurrentPage] = useState(initialPage) // 현재 페이지 상태
  const [address, setAddress] = useState('')
  const [name, setName] = useState('')
  const [transportMode, setTransportMode] = useState('')
  const [travelTime, setTravelTime] = useState(0)
  const [walkTime, setWalkTime] = useState(0)
  const [latitude, setLatitude] = useState(0)
  const [longitude, setLongitude] = useState(0)
  const { matchInfos, updateMatchInfo } = useMatchInfoStore()

  // 다음 버튼 활성화 상태
  const isNextButtonDisabled = !address || !name
  // 완료 버튼 활성화 상태
  const isCompleteButtonDisabled = !transportMode || travelTime === null

  useEffect(() => {
    // matchInfos 배열에서 boxId와 일치하는 항목 찾기
    const selectedInfo = matchInfos.find((info) => info.id === boxId)

    // 일치하는 항목이 있으면 상태 업데이트
    if (selectedInfo) {
      setAddress(selectedInfo.address || '')
      setName(selectedInfo.name || '')
      setTransportMode(selectedInfo.transportMode || '')
      setTravelTime(selectedInfo.travelTime || 0)
      setWalkTime(selectedInfo.walkTime || 0)
      setLatitude(selectedInfo.latitude || 0)
      setLongitude(selectedInfo.longitude || 0)
    }
  }, [matchInfos, boxId])

  if (!isOpen) return null

  // 페이지 이동 핸들러
  const handleNextPage = () => {
    if (!isNextButtonDisabled) {
      setCurrentPage((prev) => prev + 1)
    }
  }

  const handlePrevPage = () => {
    setCurrentPage((prev) => prev - 1)
  }

  const handleComplete = () => {
    if (!isCompleteButtonDisabled) {
      updateMatchInfo(boxId, {
        address,
        name,
        transportMode,
        travelTime,
        walkTime,
        latitude,
        longitude,
      })
      setCurrentPage(1) // 페이지 초기화
      // 상태 변경이 반영될 시간을 주기 위해 살짝 지연
      setTimeout(() => {
        onClose()
      }, 100) // 0.1초 후 모달 닫기
    }
  }

  return ReactDOM.createPortal(
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
            setLatitude={setLatitude}
            setLongitude={setLongitude}
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
        <div className="mt-6">
          {currentPage === 1 && (
            <div className="flex justify-end">
              <button
                onClick={handleNextPage}
                className={`py-2 px-4 bg-purple-500 text-white rounded-lg hover:bg-purple-600 ${
                  isNextButtonDisabled ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                disabled={isNextButtonDisabled}
              >
                다음
              </button>
            </div>
          )}
          {currentPage === 2 && (
            <div className="flex justify-between">
              <button
                onClick={handlePrevPage}
                className="py-2 px-4 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
              >
                이전
              </button>
              <button
                onClick={handleComplete}
                className={`py-2 px-4 bg-purple-500 text-white rounded-lg hover:bg-purple-600 ${
                  isCompleteButtonDisabled
                    ? 'opacity-50 cursor-not-allowed'
                    : ''
                }`}
                disabled={isCompleteButtonDisabled}
              >
                완료
              </button>
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body,
  )
}

export default Modal
