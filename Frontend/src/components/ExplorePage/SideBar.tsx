import React from 'react';
import useSidebarStore from '@/store/sidebar';
import HeartIcon from "@/assets/map_sidebar/Heart.svg?react";
import SearchIcon from "@/assets/map_sidebar/Search.png";
import HomeIcon from "@/assets/map_sidebar/Home.svg?react";
import HeartBlueIcon from "@/assets/map_sidebar/Heart_blue.svg?react";
import SearchBlueIcon from "@/assets/map_sidebar/Search_blue.png";
import HomeBlueIcon from "@/assets/map_sidebar/Home_blue.svg?react";
import ContentArea from './ContentArea';
import DetailInfo from './ContentArea/Details'; // 상세정보 컴포넌트 가져오기

const Sidebar: React.FC = () => {
  const { activeTab, setActiveTab } = useSidebarStore(); // Zustand store에서 상태와 업데이트 함수 가져오기
  const { selectedCard } = useSidebarStore(); // 선택된 카드 상태

  return (
    <div className="flex">
      {/* Sidebar Content */}
      <div className="w-20 bg-white border-r border-ssaeng-gray-1 flex flex-col items-center pt-5">
        <button
          className="flex flex-col items-center justify-center mt-5 mb-5 hover:opacity-80"
          onClick={() => setActiveTab('normal_search')}
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
          onClick={() => setActiveTab('match_search')}
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
          onClick={() => setActiveTab('favorites')}
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

      {/* Main Content */}
      <div className="flex flex-grow">
        {/* Content Area */}
        {activeTab && (
          <ContentArea /> // 카드 클릭 핸들러 전달
        )}

        {/* 상세정보 영역 */}
        {selectedCard && (
          <DetailInfo />
        )}
      </div>
    </div>
  )
}

export default Sidebar
