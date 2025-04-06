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

export const fetchLikedProperties = async (): Promise<LikedProperty[]> => {
    const response = await http.get(PROPERTY_END_POINT.GET_LIKED_PROPERTIES)
    console.log('관심 매물 응답', response.data)
    return response.data.result.properties
}