import { useState } from 'react';
import '@/styles/SideBar.css';
import HeartIcon from "@/assets/map_sidebar/Heart.svg?react"
import SearchIcon from "@/assets/map_sidebar/Search.svg?react"
import HomeIcon from "@/assets/map_sidebar/Home.svg?react"

const Sidebar = () => {
  const [activeTab, setActiveTab] = useState('search');

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
    <div style={{ display: 'flex', height: '100vh' }}>
      {/* 사이드바 */}
      <div className="sidebar">
        <button className="sidebar-button" onClick={() => setActiveTab('normal_search')}>
            <HomeIcon width={30} height={30} />
            <span>일반검색</span>
        </button>
        <button className="sidebar-button" onClick={() => setActiveTab('match_search')}>
            <SearchIcon width={32} height={30} />
            <span>맞춤검색</span>
        </button>
        <button className="sidebar-button" onClick={() => setActiveTab('favorites')}>
            <HeartIcon width={30} height={30} />
            <span>관심매물</span>
        </button>
      </div>

      {/* 콘텐츠 영역 */}
      <div className="content-area">{renderContent()}</div>
    </div>
  );
};

export default Sidebar;
