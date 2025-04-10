// src/components/ExplorePage/Sidebar.tsx
import React from 'react'
import useSidebarStore from '@/store/sidebarStore'
import HeartIcon from '@/assets/map_sidebar/Heart.svg?react'
import SearchIcon from '@/assets/map_sidebar/Search.png'
import HomeIcon from '@/assets/map_sidebar/Home.svg?react'
import HeartBlueIcon from '@/assets/map_sidebar/Heart_blue.svg?react'
import SearchBlueIcon from '@/assets/map_sidebar/Search_blue.png'
import HomeBlueIcon from '@/assets/map_sidebar/Home_blue.svg?react'
import ContentArea from './ContentArea'
import PropertyDetail from '@/components/common/property/PropertyDetail'
import useMatchInfoStore from '@/store/matchInfoStore'
import { create } from 'zustand'
import useMatchSearchResultStore from '@/store/searchResultStore'
import matchSearchStore from '@/store/matchSearchStore'

interface Property {
  id: number
  price: number
  propertyType: string
  dealType: string
  floor: number
  totalFloor: number
  area: number
  imageUrl: string
  isRecommend?: boolean
  rentPrice?: number
  address?: string
  latitude?: number
  longitude?: number
  isInterest?: boolean
  maintenancePrice?: number
  title?: string
  details?: string
}

interface PropertyStore {
  properties: Property[]
  setProperties: (data: Property[]) => void
}

export const usePropertyStore = create<PropertyStore>((set) => ({
  properties: [],
  setProperties: (data) => set({ properties: data }),
}))

const Sidebar: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    selectedCard,
    setSelectedCard,
    clearMatchCard,
    isContentAreaCollapsed,
    setContentAreaCollapsed,
    selectedLatitude,
    selectedLongitude,
    setSelectedLatitude,
    setSelectedLongitude,
  } = useSidebarStore()
  const { initializeStore } = useMatchInfoStore()
  const { resetResults } = useMatchSearchResultStore()
  const { setIsSearching } = matchSearchStore()

  const clickSidebar = (
    tab: 'normal_search' | 'match_search' | 'favorites' | null,
  ) => {
    if (activeTab === tab) {
      setActiveTab(null)
      setSelectedCard(null)
      setSelectedLatitude(null)
      setSelectedLongitude(null)
      clearMatchCard()
      setContentAreaCollapsed(false)
      resetResults()
      setIsSearching(false)
      return
    }

    setActiveTab(tab)
    setSelectedCard(null)
    clearMatchCard()
    initializeStore()
    setContentAreaCollapsed(false)
    resetResults()
    setIsSearching(false)
  }

  return (
    <div className="flex h-screen">
      {/* 사이드바 아이콘 */}
      <div className="w-[70px] bg-white border-r border-ssaeng-gray-1 flex flex-col items-center pt-4 z-50">
        <button
          className="flex flex-col items-center justify-center mt-4 mb-4 hover:opacity-80"
          onClick={() => clickSidebar('normal_search')}
        >
          {activeTab === 'normal_search' ? (
            <>
              <HomeBlueIcon className="w-6 h-6" />
              <span className="mt-1 text-sm text-ssaeng-purple">일반검색</span>
            </>
          ) : (
            <>
              <HomeIcon className="w-6 h-6" />
              <span className="mt-1 text-sm text-gray-600">일반검색</span>
            </>
          )}
        </button>

        <button
          className="flex flex-col items-center justify-center mt-4 mb-4 hover:opacity-80"
          onClick={() => clickSidebar('match_search')}
        >
          {activeTab === 'match_search' ? (
            <>
              <img src={SearchBlueIcon} alt="맞춤검색" className="w-6 h-6" />
              <span className="mt-1 text-sm text-ssaeng-purple">맞춤검색</span>
            </>
          ) : (
            <>
              <img src={SearchIcon} alt="맞춤검색" className="w-6 h-6" />
              <span className="mt-1 text-sm text-gray-600">맞춤검색</span>
            </>
          )}
        </button>

        <button
          className="flex flex-col items-center justify-center mt-4 mb-4 hover:opacity-80"
          onClick={() => clickSidebar('favorites')}
        >
          {activeTab === 'favorites' ? (
            <>
              <HeartBlueIcon className="w-6 h-6" />
              <span className="mt-1 text-sm text-ssaeng-purple">관심매물</span>
            </>
          ) : (
            <>
              <HeartIcon className="w-6 h-6" />
              <span className="mt-1 text-sm text-gray-600">관심매물</span>
            </>
          )}
        </button>
      </div>

      {/* 본문 영역 */}
      <div className="flex flex-grow h-full relative">
        {/* ContentArea는 항상 렌더링 */}
        <div
          className={`transition-transform duration-300 ease-in-out z-30`}
          style={{
            transform: isContentAreaCollapsed
              ? 'translateX(-100%)'
              : 'translateX(0)',
            width: '400px',
          }}
        >
          <ContentArea />
        </div>

        {/* 접기/펼치기 버튼 */}
        {activeTab && (
          <button
            className={`absolute top-1/2 -translate-y-1/2 z-40 bg-white shadow px-2 py-3 rounded-r-lg hover:bg-gray-100 transition-all duration-300
            ${isContentAreaCollapsed ? 'left-[0px]' : 'left-[400px]'}`}
            onClick={() => setContentAreaCollapsed(!isContentAreaCollapsed)}
          >
            <span className="text-xl font-bold text-ssaeng-purple">
              {isContentAreaCollapsed ? '▶' : '◀'}
            </span>
          </button>
        )}

        {/* 상세보기 영역 */}
        {selectedCard && (
          <div className="w-[400px] border-l border-gray-200 bg-white overflow-y-auto shadow-md z-50">
            <PropertyDetail
              id={selectedCard}
              latitude={selectedLatitude}
              longitude={selectedLongitude}
              onClose={() => setSelectedCard(null)}
            />
          </div>
        )}
      </div>
    </div>
  )
}

export default Sidebar
