import { create } from 'zustand'

interface PriceState {
  minDeposit: number // 최소 보증금
  maxDeposit: number // 최대 보증금
  minMonthlyRent: number // 최소 월세
  maxMonthlyRent: number // 최대 월세
  setMinDeposit: (value: number) => void // 최소 보증금 설정 함수
  setMaxDeposit: (value: number) => void // 최대 보증금 설정 함수
  setMinMonthlyRent: (value: number) => void // 최소 월세 설정 함수
  setMaxMonthlyRent: (value: number) => void // 최대 월세 설정 함수
  // 추가 필터 (다중 선택 가능, 빈칸 가능)
  additionalFilters: string[]
  setAdditionalFilters: (filters: string[]) => void
}

const usePriceStore = create<PriceState>((set) => ({
  minDeposit: 0,
  maxDeposit: 2000000000, // 초기값은 20억으로 설정
  minMonthlyRent: 0,
  maxMonthlyRent: 5000000, // 초기값은 500만 원으로 설정
  additionalFilters: [],

  setMinDeposit: (value) => set({ minDeposit: value }),
  setMaxDeposit: (value) => set({ maxDeposit: value }),
  setMinMonthlyRent: (value) => set({ minMonthlyRent: value }),
  setMaxMonthlyRent: (value) => set({ maxMonthlyRent: value }),

  // 추가 필터 설정
  setAdditionalFilters: (filters) => set({ additionalFilters: filters }),
}))

export default usePriceStore
