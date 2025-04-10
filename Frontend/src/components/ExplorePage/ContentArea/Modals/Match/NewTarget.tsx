import { useState } from 'react'
import Address from './Address'
import Transport from './Transport'
import { addTargetAddress } from '@/services/targetService'
import ReactDOM from 'react-dom'
import { X } from 'lucide-react'

interface NewAddressModalProps {
  isOpen: boolean
  onClose: () => void
}

const NewTargetModal = ({ isOpen, onClose }: NewAddressModalProps) => {
  const [currentPage, setCurrentPage] = useState(1)
  const [address, setAddress] = useState('')
  const [name, setName] = useState('')
  const [transportMode, setTransportMode] = useState('')
  const [travelTime, setTravelTime] = useState(0)
  const [walkTime, setWalkTime] = useState(0)
  const [latitude, setLatitude] = useState<number>(0)
  const [longitude, setLongitude] = useState<number>(0)

  const isNextButtonDisabled = !address || !name
  const isCompleteButtonDisabled = !transportMode || travelTime === 0

  if (!isOpen) return null

  const handleNextPage = () => {
    if (!isNextButtonDisabled) {
      setCurrentPage((prev) => prev + 1)
    }
  }

  const handlePrevPage = () => {
    setCurrentPage((prev) => prev - 1)
  }

  const handleComplete = async () => {
    if (!isCompleteButtonDisabled) {
      const getTransportMode = (mode: string): string => {
        switch (mode) {
          case '지하철':
            return 'SUBWAY'
          case '자차':
            return 'CAR'
          case '도보':
            return 'WALK'
          default:
            return mode
        }
      }

      const newAddressData = {
        address,
        name,
        transportMode: getTransportMode(transportMode),
        travelTime,
        walkTime,
        latitude: latitude.toFixed(6) ?? undefined,
        longitude: longitude.toFixed(6) ?? undefined,
      }

      try {
        await addTargetAddress(newAddressData)
      } catch (error) {
        console.error('주소 추가 실패:', error)
      }

      setCurrentPage(1)
      setTimeout(() => {
        onClose()
      }, 100)
    }
  }

  return ReactDOM.createPortal(
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      {/* ✅ 모달 박스: 높이 고정, 내부만 스크롤 */}
      <div className="relative bg-white rounded-xl shadow-2xl w-[420px] h-[588px] max-w-md">
        {/* 닫기 버튼 */}
        <button
          className="absolute top-5 right-5 text-gray-500 hover:text-gray-800 text-xl z-10"
          onClick={onClose}
        >
          <X />
        </button>

        {/* ✅ 내부 컨텐츠 wrapper (flex column + 내부 스크롤) */}
        <div className="h-full pt-8 pb-6 px-6 flex flex-col">
          {/* ✅ 콘텐츠 영역: 스크롤 가능 */}
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

          {/* ✅ 페이지네이션 버튼은 하단에 고정 */}
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

export default NewTargetModal
