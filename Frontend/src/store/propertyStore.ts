// src/store/propertyStore.ts
import { create } from 'zustand'

interface Property {
  id: number
  title: string
  propertyType: string
  dealType: string
  totalFloor: number
  floor: number
  area: number
  price: number
  maintenancePrice: number
  isRecommend: boolean
  imageUrl: string
  // 지도 관련 필드 추가
  latitude?: number
  longitude?: number
}

interface PropertyState {
  properties: Property[]
  setProperties: (properties: Property[]) => void
  filteredProperties: Property[]
  setFilteredProperties: (properties: Property[]) => void
}

const usePropertyStore = create<PropertyState>((set) => ({
  properties: [],
  setProperties: (properties) => set({ properties }),
  filteredProperties: [],
  setFilteredProperties: (properties) =>
    set({ filteredProperties: properties }),
}))

export default usePropertyStore

// 좋아요 저장하는 상태 정의하기
interface LikeStore {
  likedIds: number[]
  setLikedIds: (ids: number[]) => void
  toggleLikeId: (id: number) => void
}

export const useLikeStore = create<LikeStore>((set) => ({
  // 좋아요된 매물 ID 목록, 초기에는 비어 있음
  likedIds: [],
  // 서버에서 받아온 ID 배열로 likedIds를 통째로 설정
  setLikedIds: (ids) => set({ likedIds: ids }),
  // 특정 ID의 좋아요 여부를 토글 (하트 누를 때 실행됨)
  toggleLikeId: (id) =>
    set((state) => ({
      likedIds: state.likedIds.includes(id)
        ? state.likedIds.filter((v) => v !== id)
        : [...state.likedIds, id],
    })),
}))
