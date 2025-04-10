import { useState } from 'react'
import Address from './DetailAddress'
import Transport from './DetailTransportation'
import ReactDOM from 'react-dom'
import { getTransportTime } from '@/services/propertyDetailService'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  initialPage?: number
  propertyId: number
  setTransportTime: any
  setIsLoadingTime: any
  setIsAddressSearched: any
  setTransportType: any
}

const DetailAddressModal = ({
  isOpen,
  onClose,
  initialPage = 1,
  propertyId,
  setTransportTime,
  setIsLoadingTime,
  setIsAddressSearched,
  setTransportType,
}: ModalProps) => {
  const [currentPage, setCurrentPage] = useState(initialPage) // 현재 페이지 상태
  const [address, setAddress] = useState('')
  const [transportMode, setTransportMode] = useState('')
  const [latitude, setLatitude] = useState(0)
  const [longitude, setLongitude] = useState(0)

  // 다음 버튼 활성화 상태
  const isNextButtonDisabled = !address
  // 완료 버튼 활성화 상태
  const isCompleteButtonDisabled = !transportMode

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
    const requestData = {
      latitude: latitude,
      longitude: longitude,
      transportationType: transportMode,
      propertyId: propertyId,
    }
    console.log('데이터 요청함', requestData)

    setIsLoadingTime(true) // API 요청 시작 시 로딩 상태를 true로 설정

    try {
      const response = await getTransportTime(requestData)
      console.log('받아온 데이터 확인', response)
      setTransportTime(response)
      // API 요청 성공 후 필요한 부모 상태 업데이트 함수 호출 (예: onAddressSearched)
    } catch (error) {
      console.error('API 요청 실패:', error)
      // API 요청 실패 시 에러 처리
      // 사용자에게 에러 메시지를 보여주는 등의 추가적인 처리 고려
    } finally {
      setIsAddressSearched(true)
      setTransportType(transportMode)
      setIsLoadingTime(false) // API 요청 완료 (성공 또는 실패) 후 로딩 상태를 false로 설정
      setCurrentPage(1)
      onClose() // 모달 닫기
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
            setLatitude={setLatitude}
            setLongitude={setLongitude}
          />
        )}
        {currentPage === 2 && (
          <Transport
            transportMode={transportMode}
            setTransportMode={setTransportMode}
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

export default DetailAddressModal
