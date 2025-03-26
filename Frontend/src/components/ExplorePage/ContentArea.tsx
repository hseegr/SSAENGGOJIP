import React from 'react'
import useSidebarStore from '@/store/sidebar'
import NormalSearch from './ContentArea/NormalSearch'
import MatchSearch from './ContentArea/MatchSearch'
import Favorites from './ContentArea/Favorite'

const ContentArea: React.FC = () => {
  const activeTab = useSidebarStore((state) => state.activeTab)
  const setActiveTab = useSidebarStore((state) => state.setActiveTab)

  if (!activeTab) {
    return null
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'normal_search':
        return <NormalSearch />
      case 'match_search':
        return <MatchSearch />
      case 'favorites':
        return <Favorites />
      default:
        return null
    }
  }

  return (
    <div className="w-[400px] h-[500px] overflow-hidden bg-white border border-ssaeng-gray-1 flex flex-col">
      {/* 상단 영역 */}
      <div className="flex justify-between items-center p-2">
        <span></span>
        <button
          className="text-gray-600 hover:text-black"
          onClick={() => setActiveTab(null)}
        >
          ✖
        </button>
      </div>
      {/* 하단 영역 */}
      <div className="flex-grow overflow-auto p-4">{renderContent()}</div>
    </div>
  )
}

export default ContentArea
