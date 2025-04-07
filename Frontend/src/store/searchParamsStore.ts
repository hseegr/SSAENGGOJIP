// src/store/searchParamsStore.ts
import { create } from 'zustand'

// 검색 파라미터를 관리하는 스토어
interface SearchParams {
  // 일반 검색 파라미터
  generalSearchQuery: string
  generalSearchLat?: number // 위도 저장 추가
  generalSearchLng?: number // 경도 저장 추가

  // 맞춤 검색 파라미터
  customSearchQuery: string
  customSearchLat?: number // 위도 저장 추가
  customSearchLng?: number // 경도 저장 추가
  travelTime: string // 시간 값 (예: "30분")

  // 액션
  setGeneralSearchParams: (query: string, lat?: number, lng?: number) => void
  setCustomSearchParams: (
    query: string,
    time: string,
    lat?: number,
    lng?: number,
  ) => void
  clearSearchParams: () => void
}

// Zustand 스토어 생성
export const useSearchParamsStore = create<SearchParams>((set) => ({
  generalSearchQuery: '',
  generalSearchLat: undefined,
  generalSearchLng: undefined,

  customSearchQuery: '',
  customSearchLat: undefined,
  customSearchLng: undefined,
  travelTime: '',

  // 일반 검색 파라미터 설정
  setGeneralSearchParams: (query, lat, lng) =>
    set({
      generalSearchQuery: query,
      generalSearchLat: lat,
      generalSearchLng: lng,
    }),

  // 맞춤 검색 파라미터 설정
  setCustomSearchParams: (query, time, lat, lng) =>
    set({
      customSearchQuery: query,
      customSearchLat: lat,
      customSearchLng: lng,
      travelTime: time,
    }),

  // 모든 검색 파라미터 초기화
  clearSearchParams: () =>
    set({
      generalSearchQuery: '',
      generalSearchLat: undefined,
      generalSearchLng: undefined,
      customSearchQuery: '',
      customSearchLat: undefined,
      customSearchLng: undefined,
      travelTime: '',
    }),
}))
