import { useEffect, useState } from 'react'
import Address from './Match/Address'
import Transport from './Match/Transport'
import useMatchInfoStore from '@/store/matchInfoStore'
import ReactDOM from 'react-dom'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  boxId: number
  initialPage?: number
}

const Modal = ({ isOpen, onClose, boxId, initialPage = 1 }: ModalProps) => {
  const [currentPage, setCurrentPage] = useState(initialPage)

  // 상태들 초기화
  const [address, setAddress] = useState('')
  const [name, setName] = useState('')
  const [transportMode, setTransportMode] = useState('')
  const [travelTime, setTravelTime] = useState(0)
  const [walkTime, setWalkTime] = useState(0)
  const [latitude, setLatitude] = useState(0)
  const [longitude, setLongitude] = useState(0)

  const { matchInfos, updateMatchInfo } = useMatchInfoStore()

  // 버튼 활성화 조건
  const isNextButtonDisabled = !address || !name
  const isCompleteButtonDisabled = !transportMode || travelTime === null

  // 마운트 시 기존 값 반영
  useEffect(() => {
    const selectedInfo = matchInfos.find((info) => info.id === boxId)
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

  // 모달 열려있지 않으면 렌더링 X
  if (!isOpen) return null

  // 페이지 이동 핸들러
  const handleNextPage = () => {
    if (!isNextButtonDisabled) setCurrentPage((prev) => prev + 1)
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

      setCurrentPage(1)
      setTimeout(() => onClose(), 100) // 살짝 지연 후 모달 닫기
    }
  }

  // ✅ 포털로 모달 렌더링
  return ReactDOM.createPortal(
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      {/* 전체 모달 박스 - 고정 높이 유지 */}
      <div className="relative bg-white rounded-xl shadow-2xl w-[420px] h-[588px] max-w-md">
        {/* 닫기 버튼 */}
        <button
          className="absolute top-5 right-5 text-gray-500 hover:text-gray-800 text-xl z-10"
          onClick={onClose}
        >
          ✕
        </button>

        {/* ✅ 내부 전체 구조: 상단/스크롤 가능한 콘텐츠/버튼 구분 */}
        <div className="h-full pt-8 pb-6 px-6 flex flex-col">
          {/* 콘텐츠 영역: 스크롤 허용 */}
          <div className="flex-1 overflow-y-auto">
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
          </div>

          {/* 페이지네이션 버튼 영역 */}
          <div className="mt-6">
            {currentPage === 1 && (
              <div className="flex justify-end">
                <button
                  onClick={handleNextPage}
                  className={`px-6 py-2 bg-ssaeng-purple text-white rounded-md text-sm shadow-md ${
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
                  className="px-6 py-2 bg-[#e5e7eb] text-[#4b5563] rounded-md text-sm"
                >
                  이전
                </button>
                <button
                  onClick={handleComplete}
                  className={`px-6 py-2 bg-ssaeng-purple text-white rounded-md text-sm shadow-md ${
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
      </div>
    </div>,
    document.body,
  )
}

export default Modal
