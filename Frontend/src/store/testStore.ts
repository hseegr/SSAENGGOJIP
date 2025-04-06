// store/dataStore.ts
import { create } from 'zustand'

// 스토어의 상태 타입 정의
interface DataState {
  data: any[] // 실제 데이터 타입에 맞게 수정하세요

  // 데이터 저장 액션
  setData: (newData: any[]) => void
  addItem: (item: any) => void
  clearData: () => void
}

// 스토어 생성 (persist 미들웨어 없음)
export const useDataStore = create<DataState>((set) => ({
  data: [],

  // 데이터 전체 설정
  setData: (newData) => set({ data: newData }),

  // 단일 아이템 추가
  addItem: (item) =>
    set((state) => ({
      data: [...state.data, item],
    })),

  // 데이터 초기화
  clearData: () => set({ data: [] }),
}))
