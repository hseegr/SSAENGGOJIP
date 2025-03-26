import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

// Zustand store의 상태와 액션 타입 정의
interface AppState {
  activeTab: 'normal_search' | 'match_search' | 'favorites' | null;
  setActiveTab: (tab: 'normal_search' | 'match_search' | 'favorites' | null) => void;
}

// Zustand store 생성 (devtools 미들웨어 항상 적용)
const useSidebarStore = create<AppState>()(
  devtools((set) => ({
    activeTab: null, // 초기 상태는 null
    setActiveTab: (tab) => set({ activeTab: tab }), // activeTab 업데이트 함수
  }))
);

export default useSidebarStore;
