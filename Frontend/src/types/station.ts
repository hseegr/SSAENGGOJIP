// 공통 응답 타입 (이미 있다면 재사용)
export interface CommonResponse<T> {
  isSuccess: boolean
  code: string
  message: string
  result: T
}

// 전체 역 정보 타입
export interface Station {
  id: number
  name: string
  line: string // "2호선", "신분당선" 등 (문자열 1개)
  latitude: number
  longitude: number
}

// 전체 역 리스트 응답 타입
export type StationListResponse = CommonResponse<Station[]>
