import React, { useState } from 'react'
import { Search } from 'lucide-react'
import SearchBlueIcon from '@/assets/search/mage_filter.svg?react'
import Modal from './Modals/NormalModal'
import Card from '../SearchCard'

const NormalSearch: React.FC = () => {
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  // 임시 데이터 작성
  const [data] = useState([
    {
      title: '서울 아파트',
      price: 500000000,
      managementFee: 200000,
      details: '지하철역 근처, 편리한 교통',
      imageUrl: '/images/apartment1.jpg',
    },
    {
      title: '부산 오피스텔',
      price: 300000000,
      managementFee: 100000,
      details: '바다 전망, 최신 시설',
      imageUrl: '/images/apartment2.jpg',
    },
    {
      title: '대구 빌라',
      price: 150000000,
      managementFee: 50000,
      details: '조용한 주택가, 넓은 공간',
      imageUrl: '/images/apartment3.jpg',
    },
  ])

  return (
    <>
      {/* 검색창 */}
      <div className="relative flex items-center justify-between mb-4 border border-gray-300 rounded-md px-4 py-2">
        <div className="flex items-center w-full">
          <Search className="mr-2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="지역명, 지하철역명 검색"
            className="w-full focus:outline-none"
          />
        </div>
        <button
          className="flex items-center ml-4 cursor-pointer whitespace-nowrap"
          onClick={() => setIsFilterOpen(true)}
        >
          <SearchBlueIcon className="text-ssaeng-purple w-5 h-5" />
          <span className="ml-1 text-ssaeng-purple">필터</span>
        </button>
      </div>

      {/* 카드 목록 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {data.map((item, index) => (
          <Card
            key={index}
            title={item.title}
            price={item.price}
            managementFee={item.managementFee}
            details={item.details}
            imageUrl={item.imageUrl}
          />
        ))}
      </div>

      {/* 모달 */}
      <Modal isOpen={isFilterOpen} onClose={() => setIsFilterOpen(false)} />
    </>
  )
}

export default NormalSearch
