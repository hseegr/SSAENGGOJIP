import React from 'react'
import useSidebarStore from '@/store/sidebar'
import HeartIcon from '@/assets/map_sidebar/Heart.svg?react'
import SearchIcon from '@/assets/map_sidebar/Search.png'
import HomeIcon from '@/assets/map_sidebar/Home.svg?react'
import HeartBlueIcon from '@/assets/map_sidebar/Heart_blue.svg?react'
import SearchBlueIcon from '@/assets/map_sidebar/Search_blue.png'
import HomeBlueIcon from '@/assets/map_sidebar/Home_blue.svg?react'
import ContentArea from './ContentArea'
import PropertyDetail from '@/components/common/property/PropertyDetail'

const Sidebar: React.FC = () => {
  const { activeTab, setActiveTab, selectedCard, setSelectedCard } = useSidebarStore()

  const clickSidebar = (
    tab: 'normal_search' | 'match_search' | 'favorites' | null,
  ) => {
    setActiveTab(tab)
    setSelectedCard(null)
  }

  return (
    <div className="flex h-screen">
      {/* Tab 버튼 */}
      <div className="w-20 bg-white border-r border-ssaeng-gray-1 flex flex-col items-center pt-5">
        <button
          className="flex flex-col items-center justify-center mt-5 mb-5 hover:opacity-80"
          onClick={() => clickSidebar('normal_search')}
        >
          {activeTab === 'normal_search' ? (
            <>
              <HomeBlueIcon className="w-8 h-8" />
              <span className="mt-1 text-sm text-ssaeng-purple">일반검색</span>
            </>
          ) : (
            <>
              <HomeIcon className="w-8 h-8" />
              <span className="mt-1 text-sm text-gray-600">일반검색</span>
            </>
          )}
        </button>

        <button
          className="flex flex-col items-center justify-center mt-5 mb-5 hover:opacity-80"
          onClick={() => clickSidebar('match_search')}
        >
          {activeTab === 'match_search' ? (
            <>
              <img src={SearchBlueIcon} alt="맞춤검색" className="w-8 h-8" />
              <span className="mt-1 text-sm text-ssaeng-purple">맞춤검색</span>
            </>
          ) : (
            <>
              <img src={SearchIcon} alt="맞춤검색" className="w-8 h-8" />
              <span className="mt-1 text-sm text-gray-600">맞춤검색</span>
            </>
          )}
        </button>

        <button
          className="flex flex-col items-center justify-center mt-5 mb-5 hover:opacity-80"
          onClick={() => clickSidebar('favorites')}
        >
          {activeTab === 'favorites' ? (
            <>
              <HeartBlueIcon className="w-8 h-8" />
              <span className="mt-1 text-sm text-ssaeng-purple">관심매물</span>
            </>
          ) : (
            <>
              <HeartIcon className="w-8 h-8" />
              <span className="mt-1 text-sm text-gray-600">관심매물</span>
            </>
          )}
        </button>
      </div>

      {/* 본문: 목록 + 상세정보 */}
      <div className="flex flex-grow h-full">
        {activeTab && <ContentArea />}
        {selectedCard && (
          <div className="w-[400px] border-l border-gray-200 bg-white overflow-y-auto shadow-md">
            <PropertyDetail id={selectedCard} onClose={() => setSelectedCard(null)} />
          </div>
        )}
      </div>
    </div>
  )
}

export default Sidebar