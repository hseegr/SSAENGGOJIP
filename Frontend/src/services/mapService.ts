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

// 검색 API 요청 함수
export const fetchSearchResults = async (query: string, filters: Filters) => {
  try {
    const response = await http.get(MAP_END_POINT.NORMAL_SEARCH, {
      params: {
        query,
        ...filters, // 필터 데이터를 병합
      }, // 검색어를 쿼리 파라미터로 전달
    })
    console.log(response.data)
    return [] // 응답 데이터를 반환
  } catch (error) {
    console.error('검색 API 요청 중 오류 발생:', error)
    throw error // 에러를 호출한 곳으로 전달
  }
}
