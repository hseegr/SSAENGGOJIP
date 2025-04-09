import { useState } from 'react'
import Address from './Address'
import Transport from './Transport'
import { addTargetAddress } from '@/services/targetService' // API 함수 import
import ReactDOM from 'react-dom'

interface NewAddressModalProps {
  isOpen: boolean
  onClose: () => void
}

const NewTargetModal = ({ isOpen, onClose }: NewAddressModalProps) => {
  const [currentPage, setCurrentPage] = useState(1) // 현재 페이지 상태
  const [address, setAddress] = useState('')
  const [name, setName] = useState('')
  const [transportMode, setTransportMode] = useState('')
  const [travelTime, setTravelTime] = useState(0)
  const [walkTime, setWalkTime] = useState(0)
  const [latitude, setLatitude] = useState<number>(0) // 위도 상태 추가
  const [longitude, setLongitude] = useState<number>(0) // 경도 상태

  // 다음 버튼 활성화 상태
  const isNextButtonDisabled = !address || !name
  // 완료 버튼 활성화 상태
  const isCompleteButtonDisabled = !transportMode || travelTime === 0

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

  const handleComplete = async () => {
    if (!isCompleteButtonDisabled) {
      console.log('완료 버튼 클릭됨')
      // transportMode 변환 로직
      const getTransportMode = (mode: string): string => {
        switch (mode) {
          case '지하철':
            return 'SUBWAY'
          case '자차':
            return 'CAR'
          case '도보':
            return 'WALK'
          default:
            return mode // 기본적으로 원래 값을 반환
        }
      }

      const newAddressData = {
        address,
        name,
        transportMode: getTransportMode(transportMode), // 변환된 transportMode 사용
        travelTime,
        walkTime,
        latitude: latitude.toFixed(6) ?? undefined, // 위도 값 전달
        longitude: longitude.toFixed(6) ?? undefined, // 경도 값 전달
      }

      try {
        // API로 데이터 전송
        await addTargetAddress(newAddressData)
        console.log('주소가 성공적으로 추가되었습니다.')
      } catch (error) {
        console.error('주소 추가 실패:', error)
        // 필요하다면 사용자에게 에러를 알리는 로직 추가
      }

      setCurrentPage(1) // 페이지 초기화

      // 상태 변경이 반영될 시간을 주기 위해 살짝 지연
      setTimeout(() => {
        onClose()
      }, 100) // 0.1초 후 모달 닫기
    }
  }

  return ReactDOM.createPortal(
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 ">
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
            setLatitude={setLatitude} // 위도 업데이트 핸들러 전달
            setLongitude={setLongitude} // 경도 업데이트 핸들러 전달
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
                className={`py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 ${
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

export default NewTargetModal
