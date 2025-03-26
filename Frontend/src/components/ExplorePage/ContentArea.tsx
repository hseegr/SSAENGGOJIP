import React from 'react';
import useSidebarStore from "@/store/sidebar";

const ContentArea: React.FC = () => {
  const activeTab = useSidebarStore((state) => state.activeTab);
  const setActiveTab = useSidebarStore((state) => state.setActiveTab);

  if (!activeTab) {
    return null;
  }

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
    <div className="w-[400px] overflow-auto bg-white border border-ssaeng-gray-1 relative">
      {/* X 버튼 */}
      <button
        className="absolute top-2 right-2 text-gray-600 hover:text-black"
        onClick={() => setActiveTab(null)}
      >
        ✖
      </button>
      {renderContent()}
    </div>
  );
};

export default ContentArea;
