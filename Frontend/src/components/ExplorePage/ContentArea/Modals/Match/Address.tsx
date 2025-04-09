import { useState, useEffect } from 'react'
import { Search } from 'lucide-react'
import DaumPostcode from 'react-daum-postcode'

// 주소 인터페이스
interface AddressProps {
  address: string
  setAddress: React.Dispatch<React.SetStateAction<string>>
  name: string
  setName: React.Dispatch<React.SetStateAction<string>>
  setLatitude: React.Dispatch<React.SetStateAction<number>>
  setLongitude: React.Dispatch<React.SetStateAction<number>>
}

const Address: React.FC<AddressProps> = ({
  address,
  setAddress,
  name: initialName, // 이전 name prop을 initialName으로 변경
  setName,
  setLatitude,
  setLongitude,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedNameType, setSelectedNameType] = useState<
    '직접 입력' | '직장' | '학교' | ''
  >('')
  const [customNameInput, setCustomNameInput] = useState('')
  const [nameError, setNameError] = useState(false)

  // ✅ 초기 값 설정 (마운트 시 한 번만 실행)
  useEffect(() => {
    if (initialName === '직장' || initialName === '학교') {
      setSelectedNameType(initialName)
      setCustomNameInput('')
    } else if (initialName) {
      setSelectedNameType('직접 입력')
      setCustomNameInput(initialName)
    } else {
      setSelectedNameType('')
      setCustomNameInput('')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // 빈 의존성 배열로 마운트 시에만 실행

  const handleNameButtonClick = (type: '직접 입력' | '직장' | '학교') => {
    setSelectedNameType(type)
    if (type === '직접 입력') {
      setCustomNameInput('')
      setNameError(false)
      setName('') // 부모 상태 업데이트 (사용자 액션에 따른 변경)
    } else {
      setCustomNameInput('')
      setNameError(false)
      setName(type) // 부모 상태 업데이트 (사용자 액션에 따른 변경)
    }
  }

  const handleCustomNameInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const value = event.target.value
    setCustomNameInput(value)
    if (value.length > 5) {
      setNameError(true)
    } else {
      setNameError(false)
      setName(value) // 입력 중에도 부모 상태 업데이트
    }
  }

  // 좌표 변환 로직 (기존 코드 유지)
  const handleComplete = async (data: any) => {
    try {
      const { roadAddress } = data
      if (!roadAddress) throw new Error('도로명 주소 없음')

      const geoCoder = new kakao.maps.services.Geocoder()
      const coords: any = await new Promise((resolve, reject) => {
        geoCoder.addressSearch(roadAddress, (result, status) => {
          status === kakao.maps.services.Status.OK
            ? resolve(new kakao.maps.LatLng(result[0].y, result[0].x))
            : reject(new Error('좌표 조회 실패'))
        })
      })

      setLatitude(Number(coords.getLat()))
      setLongitude(Number(coords.getLng()))
      setAddress(roadAddress)
      setIsModalOpen(false)
    } catch (error) {
      console.error('좌표 변환 실패:', error)
      alert('주소를 찾을 수 없습니다.')
    }
  }

  // 모달 열기/닫기 (기존 코드 유지)
  const openModal = () => setIsModalOpen(true)
  const closeModal = () => setIsModalOpen(false)

  return (
    <div>
      <p>주소</p>
      <h2 className="text-lg font-bold mb-4">주소 설정</h2>

      {/* 주소 검색창 (기존 코드 유지) */}
      <div className="mb-4">
        <div className="relative">
          <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
            <Search size={20} strokeWidth={2} />
          </span>
          <input
            type="text"
            id="address"
            value={address}
            readOnly
            onClick={openModal}
            placeholder="주소 검색"
            className="pl-10 h-12 w-full border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-base cursor-pointer"
          />
        </div>

        {/* 주소 검색 모달 (기존 코드 유지) */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg relative w-full max-w-md">
              <button
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl"
                onClick={closeModal}
              >
                ✕
              </button>
              <DaumPostcode onComplete={handleComplete} />
            </div>
          </div>
        )}
      </div>

      {/* 이름 설정 (이전 코드 이식) */}
      <div>
        <h3 className="text-sm font-medium text-gray-700">이름 설정</h3>
        <div className="flex space-x-4 mt-2">
          {['직접 입력', '직장', '학교'].map((type) => (
            <button
              key={type}
              onClick={() =>
                handleNameButtonClick(type as '직접 입력' | '직장' | '학교')
              }
              className={`py-2 px-4 rounded-lg text-sm font-medium transition-all
                ${
                  selectedNameType === type
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
            >
              {type}
            </button>
          ))}
        </div>

        {selectedNameType === '직접 입력' && (
          <div className="mt-4">
            <input
              type="text"
              placeholder="이름을 입력해주세요."
              value={customNameInput}
              onChange={handleCustomNameInputChange}
              className={`w-full border rounded-md py-2 px-3 text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                nameError ? 'border-red-500' : 'border-gray-300'
              }`}
              maxLength={5}
            />
            {nameError && (
              <p className="text-xs text-red-500 mt-1 text-left pl-1">
                최대 5자까지 입력할 수 있어요.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default Address
