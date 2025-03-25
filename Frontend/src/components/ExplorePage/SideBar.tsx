import { useState } from 'react';
import HeartIcon from "@/assets/map_sidebar/Heart.svg?react";
import SearchIcon from "@/assets/map_sidebar/Search.png";
import HomeIcon from "@/assets/map_sidebar/Home.svg?react";
import HeartBlueIcon from "@/assets/map_sidebar/Heart_blue.svg?react"
import SearchBlueIcon from "@/assets/map_sidebar/Search_blue.png";
import HomeBlueIcon from "@/assets/map_sidebar/Home_blue.svg?react";

const Sidebar = () => {
    const [activeTab, setActiveTab] = useState('normal_search');
  
    const renderContent = () => {
      switch (activeTab) {
        case 'normal_search':
          return <div>지역명, 지하철역 검색</div>;
        case 'match_search':
          return <div>맞춤 검색 내용</div>;
        case 'favorites':
          return <div>관심 매물 내용</div>;
        default:
          return null;
      }
    };


    return (
      <div className="flex h-screen">
        {/* 사이드바 */}
        <div className="w-20 bg-white border border-ssaeng-gray-1 flex flex-col items-center pt-5 h-screen">
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
  
        {/* 콘텐츠 영역 */}
        <div className="w-[400px] overflow-auto bg-white border border-ssaeng-gray-1">{renderContent()}</div>
      </div>
    );
  };
  
  export default Sidebar;