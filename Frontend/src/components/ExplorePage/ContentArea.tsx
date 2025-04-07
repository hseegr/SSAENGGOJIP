// src/components/ExplorePage/ContentArea.tsx
import React from 'react'
import useSidebarStore from '@/store/sidebarStore'
import NormalSearch from './ContentArea/NormalSearch'
import MatchSearch from './ContentArea/MatchSearch'
import Favorites from './ContentArea/Favorite'

const ContentArea: React.FC = () => {
  const activeTab = useSidebarStore((state) => state.activeTab)
  const setActiveTab = useSidebarStore((state) => state.setActiveTab)
  const { setSelectedCard } = useSidebarStore()

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
    <div className="h-screen overflow-hidden bg-white border border-ssaeng-gray-1 flex flex-col">
      {/* 하단 영역 */}
      <div className="flex-grow overflow-auto">{renderContent()}</div>
    </div>
  )
}

export default ContentArea