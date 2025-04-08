// src/services/searchService.ts
// 위치 검색 결과 타입 정의
export interface LocationSearchResult {
  type: '역' | '동' | '면' | '건물' // 검색 결과 타입
  name: string // 장소명 (예: 역삼역, 역삼동)
  desc?: string // 추가 설명 (예: 2호선, 서울 강남구)
  latitude: number // 위도
  longitude: number // 경도
}

// 카카오맵 API 타입 선언 (전역 window 객체 확장)
declare global {
  interface Window {
    kakao: {
      maps: {
        services: {
          Status: {
            OK: string
            ZERO_RESULT: string
            ERROR: string
          }
          Places: new () => {
            keywordSearch: (
              keyword: string,
              callback: (result: any[], status: string) => void,
              options?: any,
            ) => void
          }
          Geocoder: new () => {
            addressSearch: (
              address: string,
              callback: (result: any[], status: string) => void,
            ) => void
          }
        }
        LatLng: new (
          lat: number,
          lng: number,
        ) => {
          getLat: () => number
          getLng: () => number
        }
      }
    }
  }
}

/**
 * 카카오맵 API를 이용해 위치(동/역) 검색
 * @param keyword 검색어
 * @returns 위치 검색 결과 배열
 */
export const searchLocations = async (
  keyword: string,
): Promise<LocationSearchResult[]> => {
  if (!keyword || keyword.trim() === '') return []

  try {
    // 카카오맵 API가 로드되었는지 확인
    if (!window.kakao || !window.kakao.maps || !window.kakao.maps.services) {
      console.error('카카오맵 API가 로드되지 않았습니다.')
      return []
    }

    // Promise로 감싸 비동기 처리
    return new Promise((resolve) => {
      // 장소 검색 객체 생성
      const places = new window.kakao.maps.services.Places()

      // 키워드 검색 실행
      places.keywordSearch(keyword, (result, status) => {
        if (status === window.kakao.maps.services.Status.OK) {
          console.log('카카오맵 검색 결과:', result) // 로그로 결과 확인

          // 필터링된 결과를 저장할 배열
          const filteredResults: LocationSearchResult[] = []

          // 역 검색을 위한 별도의 검색 쿼리 추가
          const stationKeyword = keyword + ' 역'
          places.keywordSearch(
            stationKeyword,
            (stationResults, stationStatus) => {
              if (stationStatus === window.kakao.maps.services.Status.OK) {
                // 역 결과 처리
                stationResults.forEach((place) => {
                  if (
                    place.category_name &&
                    (place.category_name.includes('교통') ||
                      place.category_name.includes('역') ||
                      place.category_name.includes('지하철'))
                  ) {
                    filteredResults.push({
                      type: '역',
                      name: place.place_name,
                      desc: place.category_name.split(' > ').pop() || '',
                      latitude: parseFloat(place.y),
                      longitude: parseFloat(place.x),
                    })
                  }
                })
              }

              // 기존 검색 결과에서 동 필터링
              result.forEach((place) => {
                // 동 필터링
                if (
                  place.address_name &&
                  place.address_name.includes('동') &&
                  !place.address_name.includes('동 ') &&
                  !place.address_name.includes('동산')
                ) {
                  // 이미 추가된 역과 중복 방지
                  const isDuplicate = filteredResults.some(
                    (item) =>
                      item.name === place.place_name && item.type === '동',
                  )

                  if (!isDuplicate) {
                    filteredResults.push({
                      type: '동',
                      name: place.place_name,
                      desc: place.address_name,
                      latitude: parseFloat(place.y),
                      longitude: parseFloat(place.x),
                    })
                  }
                }
              })

              // 역 먼저, 그 다음 동 순서로 정렬
              filteredResults.sort((a, b) => {
                if (a.type === '역' && b.type !== '역') return -1
                if (a.type !== '역' && b.type === '역') return 1
                return 0
              })

              console.log('필터링된 결과:', filteredResults) // 로그로 결과 확인
              resolve(filteredResults)
            },
          )
        } else {
          // 검색 실패 시 빈 배열 반환
          console.log('카카오맵 검색 상태:', status)
          resolve([])
        }
      })
    })
  } catch (error) {
    console.error('위치 검색 중 오류 발생:', error)
    return []
  }
}
