import http from './http-common'
import { PROPERTY_END_POINT } from './endPoints'
import { SearchFilters } from '@/utils/filterUtils'

// 관심 매물 Property 타입
export interface LikedProperty {
  id: number
  isRecommend: boolean
  propertyType: string
  dealType: string
  price: number
  rentPrice: number
  maintenancePrice: number
  totalFloor: number
  floor: number
  area: number
  address: string
  latitude: number
  longitude: number
  isInterest: boolean
  imageUrl: string
}

// 관심 매물 리스트 받아오기 - GET
export const fetchLikedProperties = async (): Promise<LikedProperty[]> => {
    const response = await http.get(PROPERTY_END_POINT.GET_LIKED_PROPERTIES)
  console.log('관심 매물 응답', response.data)
  return response.data.result
}

export const fetchNormalSearchResults = async (
    search: string,
    filters: SearchFilters
) => {
    const body: any = {
        ...(search && { search }),
        ...(filters.propertyTypes && { propertyTypes: filters.propertyTypes }),
        ...(filters.dealType && { dealType: filters.dealType }),
        ...(filters.minPrice !== undefined && { minPrice: filters.minPrice }),
        ...(filters.maxPrice !== undefined && filters.maxPrice < 2_050_000_000 && { maxPrice: filters.maxPrice }),
        ...(filters.minRentPrice !== undefined && { minRentPrice: filters.minRentPrice }),
        ...(filters.maxRentPrice !== undefined && filters.maxRentPrice < 4_100_000 && { maxRentPrice: filters.maxRentPrice }),
        ...(filters.facilityTypes && filters.facilityTypes.length > 0 && {
            facilityTypes: filters.facilityTypes.map(mapToEnum),
        }),
    }

    console.log('📦 API 전송 바디:', body)

    const response = await http.post(PROPERTY_END_POINT.NORMAL_SEARCH, body)
    return response.data.result
}

// 한글 필터명을 API용 영문 enum으로 변환
const mapToEnum = (facility: string): string => {
    switch (facility) {
        case '편의점': return 'CONVENIENT'
        case '병원': return 'HOSPITAL'
        case '약국': return 'PHARMACY'
        case '공원': return 'PARK'
        case '관공서': return 'PUBLIC'
        case '세탁소': return 'LAUNDRY'
        case '동물 병원': return 'ANIMAL_HOSPITAL'
        case '대형 마트': return 'MART'
        default: return facility
    }
}

// 좋아요 상태 반영 - POST
export const toggleLike = async (propertyId: number) => {
  try {
    const response = await http.post(PROPERTY_END_POINT.TOGGLE_LIKE(propertyId)) // 함수를 호출하여 문자열 주소 획득
    console.log('좋아요 요청', response)
    return
  } catch (error) {
    console.log('좋아요 반영 중 에러: ', error)
    throw error
  }
}

