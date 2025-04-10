import { useState } from 'react'
import useMatchInfoStore from '@/store/matchInfoStore'
import CustomModal from './Custom'
import usePriceStore from '@/store/matchPriceStore'
import { fetchMatchSearchResults } from '@/services/mapService'
import matchSearchStore from '@/store/matchSearchStore'
import useSearchResultStore from '@/store/searchResultStore'
import useMatchSearchResultStore from '@/store/searchResultStore'
import LoadingModal from '@/components/common/LoadingModal'
import { toast } from 'react-toastify'

type Props = {
  setIsLoading: (val: boolean) => void
}

const PropertyFilter = ({ setIsLoading }: Props) => {
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
        } else if (
          info.transportMode === 'WALK' ||
          info.transportMode === '도보'
        ) {
          transportationTypeForApi = '도보'
        }
        return {
          latitude: Number(info.latitude.toFixed(6)),
          longitude: Number(info.longitude.toFixed(6)),
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
      setIsLoading(true) // ✅ 상위에서 관리
      console.log(requestData)
      console.log('요청 데이터', requestData)
      const data = await fetchMatchSearchResults(requestData) // API 호출
      console.log('API 응답 데이터 구조:', data)
      console.log('properties 배열:', data.properties)
      setResults(data)
      setIsSearching(true)
      const storeState = useMatchSearchResultStore.getState()
      console.log('Current store state:', storeState)
      // 변환된 교통 수단 모드 저장
      setTransportModes(transportModes)
      console.log('Response:', data) // 응답 데이터 출력
    } catch (error) {
      console.error('Error during search:', error) // 에러 처리
      // ✅ 에러 응답 코드와 메시지 확인
      const code = error?.response?.data?.code
      const message = error?.response?.data?.message

      if (code === 'PROPERTY4013') {
        toast.error(
          '검색 결과가 너무 많아요! 조건을 조금 더 구체적으로 설정해 주세요.',
          {
            style: {
              width: '700px',
            },
          },
        )
      } else {
        toast.error('알 수 없는 오류가 발생했습니다.')
      }
      console.error('Error during search:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="px-4 bg-white rounded-lg mt-2">
      {/* 매물 유형 */}
      <div className="mb-4">
        <h2 className="text-lg font-bold mb-2">매물</h2>
        <h2 className="text-base font-medium mb-2">매물 유형</h2>
        <div className="flex gap-2">
          {['아파트', '빌라', '원룸', '오피스텔'].map((type) => (
            <button
              key={type}
              className={`w-24 py-2 text-sm rounded-lg border transition ${
                propertyType.includes(type)
                  ? 'bg-ssaeng-purple-light text-ssaeng-purple border-ssaeng-purple'
                  : 'bg-white text-gray-500 border-gray-300 hover:bg-gray-100'
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
        <h2 className="text-base font-medium mb-2">거래 유형</h2>
        <div className="flex gap-4">
          {['전세', '월세', '매매'].map((type) => (
            <button
              key={type}
              className={`w-28 py-2 text-sm rounded-lg border transition ${
                dealType === type
                  ? 'bg-ssaeng-purple-light text-ssaeng-purple border-ssaeng-purple'
                  : 'bg-white text-gray-500 border-gray-300 hover:bg-gray-100'
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
        className="text-sm text-ssaeng-purple mb-4 cursor-pointer hover:text-indigo-500"
        onClick={toggleModal}
      >
        가격 및 생활권 선호도 설정 추가하기
      </button>

      {/* 검색 버튼 */}
      <button
        className="w-full h-[44px] bg-ssaeng-purple text-white text-md rounded-md shadow hover:bg-indigo-500 hover:shadow-lg hover:scale-[1.02] transition-all"
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
