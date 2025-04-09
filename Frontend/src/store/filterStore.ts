import { create } from 'zustand'

const DEPOSIT_UNIT = 50_000_000
const DEPOSIT_MAX = 2_000_000_000 + DEPOSIT_UNIT // 마지막은 무제한을 의미

const MONTHLY_UNIT = 100_000
const MONTHLY_MAX = 4_000_000 + MONTHLY_UNIT // 마지막은 무제한을 의미

interface FilterState {
  // 매물 유형 (예: 아파트, 오피스텔, 빌라 등)
  propertyTypes: string[]
  setPropertyTypes: (types: string[]) => void
  togglePropertyType: (type: string) => void

  // 거래 유형 (예: 전세, 월세, 매매 중 하나만 선택)
  dealType: string
  setDealType: (type: string) => void

  // 가격 필터
  MindepositPrice: number
  MaxdepositPrice: number
  MinmonthlyPrice: number
  MaxmonthlyPrice: number
  setDepositPriceRange: (min: number, max: number) => void
  setMonthlyPriceRange: (min: number, max: number) => void

  // 추가 필터 (주변 시설)
  additionalFilters: string[]
  setAdditionalFilters: (filters: string[]) => void
  resetAdditionalFilters: () => void
  toggleAdditionalFilter: (filter: string) => void

  // 전체 초기화
  resetAllFilters: () => void
}

export const useFilterStore = create<FilterState>((set) => ({
  propertyTypes: [],
  setPropertyTypes: (types) => set({ propertyTypes: types }),
  togglePropertyType: (type) =>
    set((state) => ({
      propertyTypes: state.propertyTypes.includes(type)
        ? state.propertyTypes.filter((t) => t !== type)
        : [...state.propertyTypes, type],
    })),

  dealType: '',
  setDealType: (type) => set({ dealType: type }),

  MindepositPrice: 0,
  MaxdepositPrice: DEPOSIT_MAX,
  MinmonthlyPrice: 0,
  MaxmonthlyPrice: MONTHLY_MAX,
  setDepositPriceRange: (min, max) =>
    set({
      MindepositPrice: min,
      MaxdepositPrice: max,
    }),
  setMonthlyPriceRange: (min, max) =>
    set({
      MinmonthlyPrice: min,
      MaxmonthlyPrice: max,
    }),

  additionalFilters: [],
  setAdditionalFilters: (filters) => set({ additionalFilters: filters }),
  resetAdditionalFilters: () => set({ additionalFilters: [] }),
  toggleAdditionalFilter: (filter) =>
    set((state) => ({
      additionalFilters: state.additionalFilters.includes(filter)
        ? state.additionalFilters.filter((f) => f !== filter)
        : [...state.additionalFilters, filter],
    })),

  resetAllFilters: () =>
    set({
      propertyTypes: [],
      dealType: '',
      MindepositPrice: 0,
      MaxdepositPrice: DEPOSIT_MAX,
      MinmonthlyPrice: 0,
      MaxmonthlyPrice: MONTHLY_MAX,
      additionalFilters: [],
    }),
}))

export default useFilterStore
