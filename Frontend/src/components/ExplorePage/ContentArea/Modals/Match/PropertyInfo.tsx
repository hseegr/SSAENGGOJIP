import { useState } from 'react'
import useMatchInfoStore from '@/store/matchInfoStore'
import CustomModal from './Custom'
import usePriceStore from '@/store/matchPriceStore'
import { fetchMatchSearchResults } from '@/services/mapService'
import matchSearchStore from '@/store/matchSearchStore'
import useSearchResultStore from '@/store/searchResultStore'

const PropertyFilter = () => {
  const {
    propertyType,
    dealType,
    togglePropertyType,
    setDealType,
    matchInfos,
  } = useMatchInfoStore()

  const {
    maxDeposit,
    minDeposit,
    maxMonthlyRent,
    minMonthlyRent,
    additionalFilters,
  } = usePriceStore()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const toggleModal = () => setIsModalOpen((prev) => !prev)
  const { setIsSearching } = matchSearchStore()
  const { setResults } = useSearchResultStore()
  // 클릭 시 API 요청을 보내는 함수
  const handleSearch = async () => {
    const requestData = {
      addresses: matchInfos.map((info) => ({
        searchSet: {
          address: info.address,
          transportationType: info.transportMode,
          totalTransportTime: info.travelTime,
          walkTime: info.walkTime,
        },
      })),
      propertyType: propertyType, // ["원룸", "오피스텔", "아파트"]
      dealType: dealType, // "월세"
      minPrice: minDeposit, // 최소 보증금
      maxPrice: maxDeposit, // 최대 보증금
      minRentPrice: minMonthlyRent, // 최소 월세
      maxRentPrice: maxMonthlyRent, // 최대 월세
      facility: additionalFilters, // ["편의점", "병원", "약국"]
    }

    try {
      setIsSearching(true)
      const data = await fetchMatchSearchResults(requestData) // API 호출
      setResults(data)
      console.log('Response:', data) // 응답 데이터 출력
    } catch (error) {
      console.error('Error during search:', error) // 에러 처리
    }
  }

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
      <button
        className="w-full py-3 bg-purple-500 text-white rounded-lg font-bold hover:bg-purple-600 transition"
        onClick={handleSearch}
      >
        검색
      </button>

      {/* 모달 컴포넌트 */}
      <CustomModal isOpen={isModalOpen} onClose={toggleModal} />
    </div>
  )
}

export default PropertyFilter
