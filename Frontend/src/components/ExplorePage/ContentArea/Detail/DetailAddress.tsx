import { useState } from 'react'
import { Search } from 'lucide-react'
import DaumPostcode from 'react-daum-postcode'

// 주소 인터페이스
interface AddressProps {
  address: string
  setAddress: React.Dispatch<React.SetStateAction<string>>
  setLatitude: React.Dispatch<React.SetStateAction<number>>
  setLongitude: React.Dispatch<React.SetStateAction<number>>
}

const Address: React.FC<AddressProps> = ({
  address,
  setAddress,
  setLatitude,
  setLongitude,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false)

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
    </div>
  )
}

export default Address
