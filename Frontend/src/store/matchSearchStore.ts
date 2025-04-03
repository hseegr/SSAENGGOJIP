// store.ts
import { create } from 'zustand'

// Zustand 스토어 상태와 액션 타입 정의
interface StoreState {
  isSearching: boolean // 검색 상태 (false: 필터 설정창, true: 결과창)
  setIsSearching: (value: boolean) => void // 상태 변경 함수
}

// Zustand 스토어 생성
const matchSearchStore = create<StoreState>((set) => ({
  isSearching: false, // 초기 상태 설정
  setIsSearching: (value: boolean) => set({ isSearching: value }), // 상태 변경 함수 구현
}))

export default matchSearchStore
