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

export const fetchMatchDetailResult = async (requestData: {
  propertyId: number
  addresses: {
    latitude: number
    longitude: number
    transportationType: string
  }[]
}) => {
  try {
    const response = await http.post<ApiResponse>(
      MAP_END_POINT.MATCH_DETAIL,
      requestData,
    )
    console.log('Match Detail Response:', response)
    return response.data.result
  } catch (error) {
    console.error('맞춤 검색 상세 API 요청 중 오류 발생:', error)
    throw error
  }
}

// 직장-매물 간 거리 구하기
export const getTransportTime = async (requestData: any) => {
  try {
    const response = await http.post(
      MAP_END_POINT.GET_TRANSPORT_TIME,
      requestData,
    )
    console.log('직장-매물 간 거리 응답', response.data.result)
    return response.data.result
  } catch (error) {
    console.error('직장-매물 간 거리 API 요청 중 오류 발생:', error)
    throw error
  }
}

// 주변 선호 시설 구하기
export const getNearFacilities = async (requestData: any) => {
  try {
    const response = await http.get(
      `${MAP_END_POINT.GET_NEAR_FACILITIES}?lat=${requestData.lat}&lng=${requestData.lng}`,
    )
    return response.data.result
  } catch (error) {
    console.error('주변 시설 API 요청 오류:', error)
    throw error
  }
}
