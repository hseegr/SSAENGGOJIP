import { create } from 'zustand'

interface FilterState {
  // 매물 유형 (다중 선택 가능)
  propertyTypes: string[]
  setPropertyTypes: (types: string[]) => void

  // 거래 유형
  dealType: string
  setDealType: (types: string) => void

  // 가격 (보증금과 월세)
  MindepositPrice: number
  MinmonthlyPrice: number
  MaxdepositPrice: number
  MaxmonthlyPrice: number
  setMinDepositPrice: (price: number) => void
  setMinMonthlyPrice: (price: number) => void
  setMaxDepositPrice: (price: number) => void
  setMaxMonthlyPrice: (price: number) => void

  // 추가 필터 (다중 선택 가능, 빈칸 가능)
  additionalFilters: string[]
  setAdditionalFilters: (filters: string[]) => void

  // 초기화 함수
  resetFilters: () => void
}

const useFilterStore = create<FilterState>((set) => ({
  // 초기 상태
  propertyTypes: [],
  dealType: '',
  MindepositPrice: 0,
  MinmonthlyPrice: 0,
  MaxdepositPrice: 200000000,
  MaxmonthlyPrice: 200000000,
  additionalFilters: [],

  // 매물 유형 설정
  setPropertyTypes: (types) => set({ propertyTypes: types }),

  // 거래 유형 설정
  setDealType: (types) => set({ dealType: types }),

  // 가격 설정
  setMinDepositPrice: (price) => set({ MindepositPrice: price }),
  setMaxDepositPrice: (price) => set({ MaxdepositPrice: price }),
  setMinMonthlyPrice: (price) => set({ MinmonthlyPrice: price }),
  setMaxMonthlyPrice: (price) => set({ MaxmonthlyPrice: price }),

  // 추가 필터 설정
  setAdditionalFilters: (filters) => set({ additionalFilters: filters }),

  // 초기화 함수
  resetFilters: () =>
    set({
      propertyTypes: [],
      dealType: '',
      MindepositPrice: 0,
      MinmonthlyPrice: 0,
      MaxdepositPrice: 200000000,
      MaxmonthlyPrice: 200000000,
      additionalFilters: [],
    }),
}))

export default useFilterStore
