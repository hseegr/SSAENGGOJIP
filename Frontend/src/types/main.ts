// 공통 응답 타입
export interface CommonResponse<T> {
  isSuccess: boolean
  code: string
  message: string
  result: T
}

// 개별 매물 정보 타입
export interface Property {
  id: number
  name: string
  price: string
  area: number
  address: string
  floor: string
  latitude: number
  longitude: number
  mainImage: string | null
  dealType: string
  propertyType: string
}

// 매물 추천 응답의 result 필드 타입
export interface PropertyRecommendResult {
  total: number
  properties: Property[]
}

// 최종 응답 타입
export type PropertyRecommendResponse = CommonResponse<PropertyRecommendResult>
