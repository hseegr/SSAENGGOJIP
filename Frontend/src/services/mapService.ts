import http from './http-common'
import { MAP_END_POINT } from './endPoints'

interface Filters {
  // 명확한 타입 정의
  propertyTypes?: string[]
  dealType?: string
  MindepositPrice?: number
  MinmonthlyPrice?: number
  MaxdepositPrice?: number
  MaxmonthlyPrice?: number
  additionalFilters?: string[]
}

// requestData에 대한 인터페이스 정의
interface AddressInfo {
  searchSet: {
    address: string // 주소 (예: "서울 강남구 역삼동 718-5")
    transportationType: string // 교통 수단 (예: "지하철")
    totalTransportTime: number // 총 이동 시간 (분 단위)
    walkTime: number // 도보 시간 (분 단위)
  }
}

interface RequestData {
  addresses: AddressInfo[] // 주소 정보 배열
  propertyType: string[] // 매물 유형 배열 (예: ["원룸", "오피스텔", "아파트"])
  dealType: string // 거래 유형 (예: "월세")
  minPrice: number // 최소 보증금
  maxPrice: number // 최대 보증금
  minRentPrice: number // 최소 월세
  maxRentPrice: number // 최대 월세
  facility: string[] // 시설 필터 배열 (예: ["편의점", "병원", "약국"])
}

// 일반 검색 정보 요청 API
export const fetchNormalSearchResults = async (
  query: string,
  filters: Filters,
) => {
  try {
    const response = await http.post(MAP_END_POINT.NORMAL_SEARCH, {
      params: {
        query,
        ...filters, // 필터 데이터를 병합
      }, // 검색어를 쿼리 파라미터로 전달
    })
    console.log(response.data)
    return response.data // 응답 데이터를 반환
  } catch (error) {
    console.error('검색 API 요청 중 오류 발생:', error)
    throw error // 에러를 호출한 곳으로 전달
  }
}

// 전체 매물 정보 요청 API
export const fetchAllData = async () => {
  try {
    const response = await http.get(MAP_END_POINT.GET_ALL)
    console.log(response.data)
    return response.data // 응답 데이터를 반환
  } catch (error) {
    console.error('검색 API 요청 중 오류 발생:', error)
    throw error // 에러를 호출한 곳으로 전달
  }
}

// 맞춤 검색 정보 요청 API
export const fetchMatchSearchResults = async (requestData: RequestData) => {
  try {
    // API 요청 보내기
    const response = await http.post(MAP_END_POINT.MATCH_SEARCH, requestData)

    // 응답 데이터를 반환
    return response.data.result
  } catch (error) {
    console.error('Error fetching match search results:', error)
    throw error // 에러를 다시 던져 호출한 곳에서 처리할 수 있도록 함
  }
}
