import React, { useState } from 'react'
import { Search } from 'lucide-react' // Lucide 아이콘 가져오기
import SearchBlueIcon from '@/assets/search/mage_filter.svg?react'
import Modal from './Modals/NormalModal' // 분리된 Modal 컴포넌트 가져오기

const NormalSearch: React.FC = () => {
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  return (
    <>
      {/* 검색창 */}
      <div className="relative flex items-center justify-between mb-4 border border-gray-300 rounded-md px-4 py-2">
        {/* 돋보기 아이콘과 입력 필드 */}
        <div className="flex items-center w-full">
          <Search className="mr-2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="지역명, 지하철역명 검색"
            className="w-full focus:outline-none"
          />
        </div>
        {/* 필터 버튼 */}
        <button
          className="flex items-center ml-4 cursor-pointer whitespace-nowrap"
          onClick={() => setIsFilterOpen(true)}
        >
          <SearchBlueIcon className="text-ssaeng-purple w-5 h-5" />
          <span className="ml-1 text-ssaeng-purple">필터</span>
        </button>
      </div>

      {/* 모달 */}
      <Modal isOpen={isFilterOpen} onClose={() => setIsFilterOpen(false)} />
    </>
  )
}

export default NormalSearch
