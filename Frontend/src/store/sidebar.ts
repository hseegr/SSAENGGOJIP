import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

// Zustand store의 상태와 액션 타입 정의
interface AppState {
  activeTab: 'normal_search' | 'match_search' | 'favorites' | null;
  selectedCard: number | null; // 선택된 카드 정보
  titles: string[]; // 클러스터에 포함된 마커들의 title 값 저장
  setActiveTab: (tab: 'normal_search' | 'match_search' | 'favorites' | null) => void;
  setSelectedCard: (card: number | null) => void; // 선택된 카드 업데이트 함수
  setTitles: (titles: string[]) => void; // titles 배열 업데이트 함수
  addTitle: (title: string) => void; // titles 배열에 title 추가 함수
  clearTitles: () => void; // titles 배열 초기화 함수
}

// Zustand store 생성 (devtools 미들웨어 항상 적용)
const useSidebarStore = create<AppState>()(
  devtools((set) => ({
    activeTab: null, // 초기 상태는 null
    selectedCard: null, // 초기 선택된 카드 상태는 null
    setActiveTab: (tab) => set({ activeTab: tab }), // activeTab 업데이트 함수
    setSelectedCard: (card) => set({ selectedCard: card }), // 선택된 카드 업데이트 함수
    setTitles: (titles) => set({ titles }), // titles 배열 업데이트 함수
    addTitle: (title) =>
    set((state) => ({ titles: [...state.titles, title] })), // titles 배열에 title 추가
    clearTitles: () => set({ titles: []}), // titles 배열 초기화
  }))
);

export default useSidebarStore;
