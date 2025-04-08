import { useState } from 'react'
import Address from './Address'
import Transport from './Transport'
import { editTargetAddress, setDefaultAddress } from '@/services/targetService' // 수정 API import

interface EditTargetModalProps {
  isOpen: boolean
  onClose: () => void
  isDefault: boolean
  initialData: {
    id: number
    address: string
    name: string
    transportMode: string
    travelTime: number
    walkTime: number
  } // 초기 데이터
}

interface EditTarget {
  address: string
  name: string
  transportMode: string
  travelTime: number
  walkTime: number
  latitude: number
  longitude: number
}

const EditTargetModal = ({
  isOpen,
  onClose,
  isDefault: initialIsDefault,
  initialData,
}: EditTargetModalProps) => {
  const [currentPage, setCurrentPage] = useState(1) // 현재 페이지 상태
  const [address, setAddress] = useState(initialData.address) // 주소 초기값 설정
  const [name, setName] = useState(initialData.name) // 이름 초기값 설정
  const [transportMode, setTransportMode] = useState(initialData.transportMode) // 이동수단 초기값 설정
  const [travelTime, setTravelTime] = useState(initialData.travelTime) // 이동 시간 초기값 설정
  const [walkTime, setWalkTime] = useState(initialData.walkTime) // 걷기 시간 초기값 설정
  const [latitude, setLatitude] = useState(0)
  const [longitude, setLongitude] = useState(0)
  const [isDefault, setIsDefault] = useState(initialIsDefault) // 기본 주소 여부 상태

  // 다음 버튼 활성화 상태 (현재는 주소 또는 이름이 비어있으면 비활성화)
  const isNextButtonDisabled = !address || !name
  // 완료 버튼 활성화 상태 (현재는 transportMode가 없거나 travelTime이 null이면 비활성화)
  const isCompleteButtonDisabled = !transportMode || travelTime === null

  if (!isOpen) return null

  // 페이지 이동 핸들러
  const handleNextPage = () => {
    if (!isNextButtonDisabled) {
      setCurrentPage((prev) => prev + 1)
      console.log('이름은?', name)
      console.log('주소는?', address)
    }
  }

  const handlePrevPage = () => {
    setCurrentPage((prev) => prev - 1)
  }
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
  // 기본 주소 체크박스 변경 핸들러
  const handleDefaultChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const checked = event.target.checked
    setIsDefault(checked)
    if (checked) {
      try {
        await setDefaultAddress(initialData.id)
        console.log('기본 주소로 설정 요청 보냄:', initialData.id)
        // 성공 알림 또는 다른 UI 업데이트를 할 수 있습니다.
      } catch (error) {
        console.error('기본 주소 설정 실패:', error)
        // 에러 처리: 사용자에게 알림, 체크박스 상태 되돌리기 등
        setIsDefault(false) // 에러 발생 시 체크 상태 되돌림
      }
    }
    // 기본 주소 해제 기능이 필요하다면 여기에 로직 추가
  }

  const handleComplete = async () => {
    if (!isCompleteButtonDisabled) {
      console.log('수정 요청 보냄')
      console.log(initialData)
      console.log(name)
      const editTargetData: EditTarget = {
        address,
        name,
        transportMode: getTransportMode(transportMode),
        travelTime,
        walkTime,
        latitude: parseFloat(latitude.toFixed(6)),
        longitude: parseFloat(longitude.toFixed(6)),
      }

      try {
        console.log('수정할 데이터:', editTargetData)
        console.log('수정할 id', initialData.id)
        await editTargetAddress(editTargetData, initialData.id)
        console.log('주소 정보가 성공적으로 수정되었습니다.')
        setCurrentPage(1)
        onClose() // 모달 닫기
        setName('') // 이름 초기화
      } catch (error) {
        console.error('주소 정보 수정 실패:', error)
        // 필요하다면 사용자에게 에러를 알리는 로직 추가 (예: 알림 메시지)
      }
    }
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
        {/* 기본 주소 설정 체크박스 */}
        <div className="mb-4 flex items-center">
          <input
            type="checkbox"
            id="isDefault"
            checked={isDefault}
            onChange={handleDefaultChange}
            disabled={initialIsDefault} // 초기값이 true면 비활성화
            className="mr-2"
          />
          <label htmlFor="isDefault" className="text-sm text-gray-700">
            기본 주소로 설정
          </label>
        </div>

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
    </div>
  )
}

export default EditTargetModal
