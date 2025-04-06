import http from './http-common'
import { MAP_END_POINT } from './endPoints'

// 응답 데이터의 타입 정의
interface Facility {
  facilityType: string
  longitude: number
  latitude: number
}

interface Station {
  id: number
  name: string
  line: string
}

interface Result {
  id: number
  name: string
  propertyType: string
  dealType: string
  price: number
  rentPrice: number
  maintenancePrice: number
  totalFloor: number
  floor: number
  area: number
  address: string
  stations: Station[]
  facilites: Facility[]
  imageUrls: string[]
}

interface ApiResponse {
  isSuccess: boolean
  code: string
  message: string
  result: Result
}

// 함수 수정
export const fetchDetailResult = async (
  propertyId: number,
): Promise<Result> => {
  try {
    const response = await http.get<ApiResponse>(
      MAP_END_POINT.GET_DETAIL(propertyId),
      {
        params: {},
      },
    )
    console.log(response.data.result)
    return response.data.result // 명시적으로 타입이 지정된 result 반환
  } catch (error) {
    console.error('검색 API 요청 중 오류 발생:', error)
    throw error // 에러를 호출한 곳으로 전달
  }
}
