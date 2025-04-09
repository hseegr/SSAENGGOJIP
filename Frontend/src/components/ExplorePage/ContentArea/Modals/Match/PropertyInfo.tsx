import { useState } from 'react'
import useMatchInfoStore from '@/store/matchInfoStore'
import CustomModal from './Custom'
import usePriceStore from '@/store/matchPriceStore'
import { fetchMatchSearchResults } from '@/services/mapService'
import matchSearchStore from '@/store/matchSearchStore'
import useSearchResultStore from '@/store/searchResultStore'
import useMatchSearchResultStore from '@/store/searchResultStore'

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
  const { setResults, setTransportModes } = useSearchResultStore()

  // 클릭 시 API 요청을 보내는 함수
  const handleSearch = async () => {
    console.log('이거 클릭함', matchInfos)
    const requestData = {
      addresses: matchInfos.map((info) => {
        let transportationTypeForApi = '지하철' // 기본값
        if (info.transportMode === 'SUBWAY') {
          transportationTypeForApi = '지하철'
        } else if (info.transportMode === 'WALK') {
          transportationTypeForApi = '도보'
        }
        return {
          latitude: info.latitude.toFixed(6),
          longitude: info.longitude.toFixed(6),
          transportationType: transportationTypeForApi, // 변경된 부분
          totalTransportTime: info.travelTime,
          walkTime: info.walkTime,
        }
      }),
      propertyType: propertyType, // ["원룸", "오피스텔", "아파트"]
      dealType: dealType, // "월세"
      minPrice: minDeposit, // 최소 보증금
      maxPrice: maxDeposit, // 최대 보증금
      minRentPrice: minMonthlyRent, // 최소 월세
      maxRentPrice: maxMonthlyRent, // 최대 월세
      facility: [], // ["편의점", "병원", "약국"]
      // additionalFilters
    }
    // 교통 수단 모드 추출 및 변환
    const transportModes = matchInfos.map((info) => {
      if (info.transportMode === 'SUBWAY') return '지하철'
      if (info.transportMode === 'WALK') return '도보'
      return info.transportMode // 다른 경우 원래 값 유지
    })

    try {
      console.log(requestData)
      setIsSearching(true)
      const data = await fetchMatchSearchResults(requestData) // API 호출
      console.log('API 응답 데이터 구조:', data)
      console.log('properties 배열:', data.properties)
      setResults(data)
      const storeState = useMatchSearchResultStore.getState()
      console.log('Current store state:', storeState)
      // 변환된 교통 수단 모드 저장
      setTransportModes(transportModes)
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
