import { create } from 'zustand'

// 개별 매물 정보 인터페이스
interface Property {
  id: number
  isRecommend: boolean
  propertyType: string
  dealType: string
  price: number
  rentPrice: number
  totalFloor: number
  floor: number
  area: number
  builtYear: number
  address: string
  floorNum: number
  latitude: number
  longitude: number
  isInterest: boolean
  imageUrl: string
  transportTimes: number[]
}

// 검색 결과 인터페이스
interface SearchResults {
  total: number
  properties: Property[]
}

// 맞춤 상세검색 용 주소
interface MatchTarget {
  latitude: number
  longitude: number
  transportationType: string
}
// 스토어 상태 인터페이스
interface SearchResultState {
  results: SearchResults | null
  setResults: (data: SearchResults) => void
  resetResults: () => void
  transportModes: string[] // 교통 수단 모드 저장
  setTransportModes: (modes: string[]) => void // 교통 수단 모드 설정 함수
  matchTargetAddress: MatchTarget[] | null
  setMatchTargetAddress: (address: MatchTarget[] | null) => void
}

// Zustand 스토어 생성
const useMatchSearchResultStore = create<SearchResultState>((set) => ({
  results: null,
  // 받아온 데이터 저장용
  setResults: (data) => set({ results: data }),
  // 결과 초기화
  resetResults: () => set({ results: null }),
  transportModes: [],
  // 교통 수단 모드 설정
  setTransportModes: (modes) => set({ transportModes: modes }),
  matchTargetAddress: null,
  setMatchTargetAddress: (address) => set({ matchTargetAddress: address }),
}))

export default useMatchSearchResultStore
