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
  price: number
  area: number
  address: string
  floor: number
  latitude: number
  longitude: number
}

// 매물 추천 응답의 result 필드 타입
export interface PropertyRecommendResult {
  total: number
  properties: Property[]
}

// 최종 응답 타입
export type PropertyRecommendResponse = CommonResponse<PropertyRecommendResult>
