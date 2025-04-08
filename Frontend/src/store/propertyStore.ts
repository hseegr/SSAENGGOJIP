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
