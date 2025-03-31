import { useState } from 'react'
import { Search } from 'lucide-react'
import DaumPostcode from 'react-daum-postcode'

// 간소화된 인터페이스
interface AddressData {
  address: string // 도로명 주소
  buildingName: string // 건물명
}

// Address 컴포넌트 Props 타입 정의
interface AddressProps {
  address: string
  setAddress: React.Dispatch<React.SetStateAction<string>>
  name: string
  setName: React.Dispatch<React.SetStateAction<string>>
}

const Address: React.FC<AddressProps> = ({
  address,
  setAddress,
  name,
  setName,
}) => {
  const [searchResult, setSearchResult] = useState<{
    name: string
    detail: string
  } | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [nameType, setNameType] = useState('')
  const [customName, setCustomName] = useState('')
  const [isValidName, setIsValidName] = useState(false)
  const [confirmedName, setConfirmedName] = useState(name)

  // 주소 검색 완료 시 처리
  const handleComplete = (data: AddressData) => {
    setSearchResult({
      name: data.buildingName || '건물명 없음',
      detail: data.address,
    })
    setAddress(data.address) // 부모 상태 업데이트
    setIsModalOpen(false) // 모달 닫기
  }

  // 모달 열기/닫기
  const openModal = () => setIsModalOpen(true)
  const closeModal = () => setIsModalOpen(false)

  // 이름 타입 변경 핸들러
  const handleNameTypeChange = (type: string) => {
    setNameType(type)
    if (type !== '직접 입력') {
      setCustomName(type)
      setConfirmedName(type)
      setName(type) // 부모 상태 업데이트
    }
  }

  // 이름 입력 핸들러
  const handleNameInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const value = event.target.value
    setCustomName(value)
    setIsValidName(value.length >= 1 && value.length <= 5) // 유효성 검사
  }

  // 이름 확인 핸들러
  const handleConfirmName = () => {
    if (isValidName) {
      setConfirmedName(customName)
      setName(customName) // 부모 상태 업데이트
    }
  }

  return (
    <div>
      <p>주소</p>
      <h2 className="text-lg font-bold mb-4">주소 설정</h2>

      {/* 주소 검색창 */}
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

        {/* 주소 검색 모달 */}
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

        {/* 검색 결과 */}
        {searchResult ? (
          <div className="p-4 bg-gray-100 rounded-lg shadow-md">
            <p className="text-lg font-semibold">{searchResult.name}</p>
            <p className="text-sm text-gray-600">{searchResult.detail}</p>
          </div>
        ) : (
          <div className="p-4 bg-gray-100 rounded-lg shadow-md text-gray-400">
            검색 결과가 없습니다.
          </div>
        )}
      </div>

      {/* 이름 설정 */}
      <div>
        <h3 className="text-sm font-medium text-gray-700">이름 설정</h3>
        <div className="flex space-x-4 mt-2">
          {['직접 입력', '직장', '학교'].map((type) => (
            <button
              key={type}
              onClick={() => handleNameTypeChange(type)}
              className={`py-2 px-4 rounded-lg ${
                nameType === type
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-700'
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        {/* 직접 입력일 때만 이름 입력창 표시 */}
        {nameType === '직접 입력' && (
          <div className="mt-4 flex items-center space-x-2">
            <input
              type="text"
              value={customName}
              onChange={handleNameInputChange}
              placeholder="이름을 입력하세요"
              className={`flex-1 border rounded-lg p-2 focus:ring-blue-500 focus:border-blue-500 ${
                !isValidName && customName.length > 5
                  ? 'border-red-500'
                  : 'border-gray-300'
              }`}
            />
            <button
              onClick={handleConfirmName}
              disabled={!isValidName}
              className={`py-2 px-4 rounded-lg ${
                confirmedName
                  ? 'bg-purple-500 text-white hover:bg-purple-600' // 이름 설정 완료 시 보라색 버튼
                  : isValidName
                    ? 'bg-green-500 text-white hover:bg-green-600' // 유효한 경우 초록색 버튼
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed' // 비활성화된 경우 회색 버튼
              }`}
            >
              확인
            </button>
          </div>
        )}

        {/* 에러 메시지 출력 */}
        {!isValidName && customName.length > 5 && (
          <p className="text-sm text-red-500 mt-1">
            5글자 이내로 입력해주세요.
          </p>
        )}
      </div>
    </div>
  )
}

export default Address
