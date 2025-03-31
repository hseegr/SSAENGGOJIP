import { create } from 'zustand'

interface MatchInfo {
  id: number // 순차적으로 증가하는 ID
  address: string
  name: string
  transportMode: string
  travelTime: number
  walkTime: number
}

interface MatchInfoStore {
  matchInfos: MatchInfo[] // 여러 박스를 관리하는 배열
  propertyType: string[] // 공통 매물 유형 (배열)
  dealType: string // 공통 거래 유형 (단일 선택)
  addMatchInfo: () => void // 새로운 박스 추가
  updateMatchInfo: (id: number, updatedData: Partial<MatchInfo>) => void // 특정 박스 데이터 업데이트
  togglePropertyType: (type: string) => void // 매물 유형 추가/제거
  setDealType: (type: string) => void // 거래 유형 설정
}

const useMatchInfoStore = create<MatchInfoStore>((set) => ({
  matchInfos: [], // 초기값은 빈 배열
  propertyType: [], // 초기값은 빈 배열
  dealType: '', // 초기값은 빈 문자열

  // 새로운 박스 추가 (순차적으로 증가하는 ID 생성)
  addMatchInfo: () =>
    set((state) => ({
      matchInfos: [
        ...state.matchInfos,
        {
          id: state.matchInfos.length + 1, // ID를 배열 길이에 기반해 순차적으로 증가
          address: '',
          name: '',
          transportMode: '',
          travelTime: 0,
          walkTime: 0,
        },
      ],
    })),

  // 특정 박스 데이터 업데이트
  updateMatchInfo: (id, updatedData) =>
    set((state) => {
      const updatedMatchInfos = state.matchInfos.map((info) =>
        info.id === id ? { ...info, ...updatedData } : info,
      )
      return { matchInfos: updatedMatchInfos }
    }),

  // 매물 유형 추가/제거
  togglePropertyType: (type) =>
    set((state) => ({
      propertyType: state.propertyType.includes(type)
        ? state.propertyType.filter((item) => item !== type)
        : [...state.propertyType, type],
    })),

  // 거래 유형 설정
  setDealType: (type) =>
    set(() => ({
      dealType: type,
    })),
}))

export default useMatchInfoStore
