import http from './http-common'
import { PROPERTY_END_POINT } from './endPoints'

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
