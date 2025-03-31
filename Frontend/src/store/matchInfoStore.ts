import { create } from 'zustand'

interface MatchInfoState {
  address: string
  name: string
  transportMode: string
  travelTime: number
  walkTime: number
  propertyType: string[] // 매물 유형 (여러 개 선택 가능)
  dealType: string // 거래 유형 (단일 선택)
  setModalData: (
    data: Omit<
      MatchInfoState,
      | 'setModalData'
      | 'propertyType'
      | 'dealType'
      | 'togglePropertyType'
      | 'setDealType'
    >,
  ) => void // propertyType과 dealType 제외
  togglePropertyType: (type: string) => void // 매물 유형 추가/제거
  setDealType: (type: string) => void // 거래 유형 설정
}

const useMatchInfoStore = create<MatchInfoState>((set) => ({
  address: '',
  name: '',
  transportMode: '',
  travelTime: 0,
  walkTime: 0,
  propertyType: [],
  dealType: '',

  setModalData: (data) =>
    set(() => ({
      address: data.address,
      name: data.name,
      transportMode: data.transportMode,
      travelTime: data.travelTime,
      walkTime: data.walkTime,
    })),

  togglePropertyType: (type) =>
    set((state) => ({
      propertyType: state.propertyType.includes(type)
        ? state.propertyType.filter((item) => item !== type)
        : [...state.propertyType, type],
    })),

  setDealType: (type) => set(() => ({ dealType: type })),
}))

export default useMatchInfoStore
