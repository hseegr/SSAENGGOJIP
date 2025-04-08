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
    latitude?: number // 추가
    longitude?: number // 추가
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
  search: string,
  filters: Filters,
) => {
  try {
    // 요청 본문 구성
    const requestBody = {
      search: search, // 검색어 (역삼역, 역삼동 등)
      propertyTypes: filters.propertyTypes ?? [], // 원룸, 오피스텔, 아파트, 단독주택, 빌라 등
      dealType: filters.dealType ?? null, // 월세, 전세 등
      minPrice: filters.MindepositPrice ?? 0,
      maxPrice: filters.MaxdepositPrice ?? 200000000,
      minRentPrice: filters.MinmonthlyPrice ?? 0,
      maxRentPrice: filters.MaxmonthlyPrice ?? 200000000,
      facilityTypes: filters.additionalFilters ?? [], // 편의점, 병원, 약국 등
    }
    console.log(requestBody)
    const response = await http.post(MAP_END_POINT.NORMAL_SEARCH, requestBody)

    console.log('검색 응답:', response.data)
    return response.data?.result // 응답 데이터의 result 속성을 안전하게 반환
  } catch (error) {
    console.error('검색 API 요청 중 오류 발생:', error)
    throw error // 에러를 호출한 곳으로 전달
  }
}

// 전체 매물 정보 요청 API
export const fetchAllData = async () => {
  try {
    const response = await http.get(MAP_END_POINT.GET_ALL)
    return response.data.result // 응답 데이터를 반환
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

export interface Coordinate {
  latitude: number
  longitude: number
}

export interface BoundsData {
  middle: [number, number]
  leftDown: [number, number]
  rightUp: [number, number]
}

export const fetchDataByBounds = async (
  bounds: any,
  center: Coordinate,
  southWestLatitude?: number,
  southWestLongitude?: number,
  northEastLatitude?: number,
  northEastLongitude?: number,
) => {
  try {
    const requestParams: BoundsData = {
      // middle: [center.latitude, center.longitude],
      leftDown: [
        southWestLatitude !== undefined
          ? southWestLatitude
          : bounds.getSouthWest().getLat(),
        southWestLongitude !== undefined
          ? southWestLongitude
          : bounds.getSouthWest().getLng(),
      ],
      rightUp: [
        northEastLatitude !== undefined
          ? northEastLatitude
          : bounds.getNorthEast().getLat(),
        northEastLongitude !== undefined
          ? northEastLongitude
          : bounds.getNorthEast().getLng(),
      ],
    }
    const response = await http.post(MAP_END_POINT.GET_ALL, requestParams)
    return response.data.result // 응답 데이터를 반환
  } catch (error) {
    console.error('영역 기반 매물 API 요청 중 오류 발생:', error)
    throw error // 에러를 호출한 곳으로 전달
  }
}

// 메인 페이지 검색 기능
/**
 * 일반 검색 API 호출 (좌표 정보 포함, 메인 페이지 검색용)
 * @param query 검색어 (역/동 이름)
 * @param filters 필터 옵션
 * @param latitude 위도 (옵션)
 * @param longitude 경도 (옵션)
 * @returns 검색 결과
 */
export const fetchNormalSearchWithCoords = async (
  query: string,
  filters: Filters = {},
  latitude?: number,
  longitude?: number,
) => {
  try {
    console.log('일반 검색 시작: 쿼리=', query)

    // 검색 API 요청 데이터 구성
    const requestBody = {
      search: query,
      // 좌표가 있으면 포함
      ...(latitude && longitude ? { latitude, longitude } : {}),
      // 필터 데이터
      propertyTypes: filters.propertyTypes ?? [],
      dealType: filters.dealType === '' ? null : filters.dealType, // 빈 문자열을 null로 변환
      minPrice: filters.MindepositPrice ?? 0,
      maxPrice: filters.MaxdepositPrice ?? 200000000,
      minRentPrice: filters.MinmonthlyPrice ?? 0,
      maxRentPrice: filters.MaxmonthlyPrice ?? 200000000,
      facilityTypes: filters.additionalFilters ?? [],
    }

    console.log('일반 검색 요청 데이터:', requestBody)

    // API 호출
    const response = await http.post(MAP_END_POINT.NORMAL_SEARCH, requestBody)

    return response.data.result
  } catch (error) {
    console.error('일반 검색 API 요청 중 오류 발생:', error)
    throw error
  }
}

/**
 * 맞춤 검색 API 호출 (검색어와 시간으로 간편 실행)
 * @param query 검색어 (역/동 이름)
 * @param travelTime 이동 시간 (분)
 * @param filters 필터 옵션
 * @param latitude 위도 (옵션)
 * @param longitude 경도 (옵션)
 * @returns 검색 결과
 */
export const fetchMatchSearchWithQuery = async (
  query: string,
  travelTime: number,
  filters: any = {},
  latitude?: number,
  longitude?: number,
) => {
  console.log('🔍 맞춤 검색 시작 - 쿼리:', query, '시간:', travelTime)
  console.log('🔍 맞춤 검색 좌표 정보:', { latitude, longitude })
  try {
    // 좌표가 없으면 카카오 API로 가져오기
    let lat = latitude
    let lng = longitude

    if (!lat || !lng) {
      console.log('⚠️ 좌표 정보가 없어 카카오 API로 변환 시도')
      try {
        // 카카오 Geocoder를 사용해 주소를 좌표로 변환
        lat = 37.501286 // 기본값 설정 (성공하지 못할 경우 대비)
        lng = 127.039633

        // Promise로 감싸서 비동기 처리
        await new Promise<void>((resolve) => {
          if (window.kakao && window.kakao.maps) {
            const geocoder = new window.kakao.maps.services.Geocoder()
            geocoder.addressSearch(query, (result, status) => {
              if (status === window.kakao.maps.services.Status.OK) {
                console.log('✅ 카카오맵 API 좌표 변환 성공:', { lat, lng })
                lat = parseFloat(result[0].y)
                lng = parseFloat(result[0].x)
              } else {
                console.log('❌ 카카오맵 API 좌표 변환 실패:', status)
              }
              resolve()
            })
          } else {
            console.log('❌ 카카오맵 API가 로드되지 않음')
            resolve()
          }
        })
      } catch (e) {
        console.error('좌표 변환 실패:', e)
        // 기본값 사용
      }
    }

    console.log('📌 최종 사용 좌표:', { lat, lng })
    console.log('📌 필터 정보:', filters)

    // 맞춤 검색 요청 데이터 구성
    const requestData = {
      addresses: [
        {
          latitude: lat,
          longitude: lng,
          transportationType: '지하철', // 기본값
          totalTransportTime: travelTime,
          walkTime: Math.min(travelTime / 2, 10), // 이동 시간의 절반 또는 최대 10분
        },
      ],
    }

    console.log(
      '📤 맞춤 검색 API 요청 데이터:',
      JSON.stringify(requestData, null, 2),
    )

    // API 호출
    console.log('🔄 API 호출 시작:', MAP_END_POINT.MATCH_SEARCH)
    const response = await http.post(MAP_END_POINT.MATCH_SEARCH, requestData)
    console.log('✅ API 호출 성공, 응답:', response.status)
    console.log('📥 응답 데이터:', response.data)

    return response.data.result
  } catch (error) {
    console.error('❌ 맞춤 검색 API 요청 중 오류 발생:', error)

    // 에러 상세 정보 출력
    if (error.response) {
      console.error('❌ 응답 상태:', error.response.status)
      console.error('❌ 응답 데이터:', error.response.data)
      console.error('❌ 응답 헤더:', error.response.headers)
    } else if (error.request) {
      console.error('❌ 요청은 되었으나 응답이 없음:', error.request)
    } else {
      console.error('❌ 요청 설정 중 오류 발생:', error.message)
    }

    throw error
  }
}
