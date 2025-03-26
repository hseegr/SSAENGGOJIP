import useSidebarStore from '@/store/sidebar';
import HeartIcon from "@/assets/map_sidebar/Heart.svg?react";
import SearchIcon from "@/assets/map_sidebar/Search.png";
import HomeIcon from "@/assets/map_sidebar/Home.svg?react";
import HeartBlueIcon from "@/assets/map_sidebar/Heart_blue.svg?react";
import SearchBlueIcon from "@/assets/map_sidebar/Search_blue.png";
import HomeBlueIcon from "@/assets/map_sidebar/Home_blue.svg?react";
import ContentArea from './ContentArea';

const Sidebar: React.FC = () => {
  const { activeTab, setActiveTab } = useSidebarStore(); // Zustand store에서 상태와 업데이트 함수 가져오기

  return (
    <div className="flex h-screen">
      {/* Sidebar Content */}
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

      {/* Content Area (state에 따라 표시/숨김) */}
      {activeTab && <ContentArea />}
    </div>
  );
};

export default Sidebar;
