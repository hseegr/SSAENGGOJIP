import { useState } from 'react'
import Address from './Address'
import Transport from './Transport'
import { editTargetAddress, setDefaultAddress } from '@/services/targetService'
import { X } from 'lucide-react'

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
    latitude: number
    longitude: number
  }
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
  const [currentPage, setCurrentPage] = useState(1)
  const [address, setAddress] = useState(initialData.address)
  const [name, setName] = useState(initialData.name)
  const [transportMode, setTransportMode] = useState(initialData.transportMode)
  const [travelTime, setTravelTime] = useState(initialData.travelTime)
  const [walkTime, setWalkTime] = useState(initialData.walkTime)
  const [latitude, setLatitude] = useState(initialData.latitude)
  const [longitude, setLongitude] = useState(initialData.longitude)
  const [isDefault, setIsDefault] = useState(initialIsDefault)

  const isNextButtonDisabled = !address || !name
  const isCompleteButtonDisabled = !transportMode || travelTime === null

  if (!isOpen) return null

  const handleNextPage = () => {
    if (!isNextButtonDisabled) {
      setCurrentPage((prev) => prev + 1)
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
        return mode
    }
  }

  const handleDefaultChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const checked = event.target.checked
    setIsDefault(checked)
    if (checked) {
      try {
        await setDefaultAddress(initialData.id)
        console.log('기본 주소로 설정 요청 보냄:', initialData.id)
      } catch (error) {
        console.error('기본 주소 설정 실패:', error)
        setIsDefault(false)
      }
    }
  }

  const handleComplete = async () => {
    if (!isCompleteButtonDisabled) {
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
        await editTargetAddress(editTargetData, initialData.id)
        setCurrentPage(1)
        onClose()
        setName('')
      } catch (error) {
        console.error('주소 정보 수정 실패:', error)
      }
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="relative bg-white rounded-xl shadow-2xl w-[420px] h-[588px] max-w-md max-h-[90vh] overflow-y-auto p-6 flex flex-col">
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-xl"
          onClick={onClose}
        >
          <X />
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
        <div className="mb-4 mt-4 px-3">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="isDefault"
              checked={isDefault}
              onChange={handleDefaultChange}
              disabled={initialIsDefault}
              className="mr-2"
            />
            <label htmlFor="isDefault" className="text-sm text-gray-700">
              기본 주소로 설정
            </label>
          </div>
        </div>

        {/* 페이지네이션 버튼 */}
        <div className="mt-auto px-3">
          {currentPage === 1 && (
            <div className="flex justify-end">
              <button
                onClick={handleNextPage}
                className={`w-full py-3 bg-ssaeng-purple text-white rounded-lg font-bold hover:bg-opacity-90 transition ${
                  isNextButtonDisabled ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                disabled={isNextButtonDisabled}
              >
                다음
              </button>
            </div>
          )}
          {currentPage === 2 && (
            <div className="flex justify-between gap-2">
              <button
                onClick={handlePrevPage}
                className="w-1/2 py-3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
              >
                이전
              </button>
              <button
                onClick={handleComplete}
                className={`w-1/2 py-3 bg-ssaeng-purple text-white rounded-lg font-bold hover:bg-opacity-90 transition ${
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
