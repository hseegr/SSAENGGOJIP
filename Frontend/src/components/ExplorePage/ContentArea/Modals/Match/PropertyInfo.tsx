import { useState } from 'react'
import useMatchInfoStore from '@/store/matchInfoStore'
import CustomModal from './Custom'

const PropertyFilter = () => {
  const { propertyType, dealType, togglePropertyType, setDealType } =
    useMatchInfoStore()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const toggleModal = () => setIsModalOpen((prev) => !prev)

  return (
    <div className="p-6 bg-white rounded-lg">
      {/* 매물 유형 */}
      <div className="mb-4">
        <h3 className="text-lg font-bold mb-2">매물</h3>
        <div className="flex space-x-2">
          {['아파트', '오피스텔', '빌라'].map((type) => (
            <button
              key={type}
              className={`px-4 py-2 rounded-lg text-sm font-semibold ${
                propertyType.includes(type)
                  ? 'bg-purple-500 text-white'
                  : 'bg-gray-200 text-gray-700'
              }`}
              onClick={() => togglePropertyType(type)}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* 거래 유형 */}
      <div className="mb-4">
        <h3 className="text-lg font-bold mb-2">거래 유형</h3>
        <div className="flex space-x-2">
          {['전세', '월세', '매매'].map((type) => (
            <button
              key={type}
              className={`px-4 py-2 rounded-lg text-sm font-semibold ${
                dealType === type
                  ? 'bg-purple-500 text-white'
                  : 'bg-gray-200 text-gray-700'
              }`}
              onClick={() => setDealType(type)}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* 추가 설정 */}
      <button
        className="text-sm text-purple-500 mb-4 cursor-pointer hover:underline"
        onClick={toggleModal}
      >
        매물 및 생활권 선호도 설정 추가하기
      </button>

      {/* 검색 버튼 */}
      <button className="w-full py-3 bg-purple-500 text-white rounded-lg font-bold hover:bg-purple-600 transition">
        검색
      </button>

      {/* 모달 컴포넌트 */}
      <CustomModal isOpen={isModalOpen} onClose={toggleModal} />
    </div>
  )
}

export default PropertyFilter
