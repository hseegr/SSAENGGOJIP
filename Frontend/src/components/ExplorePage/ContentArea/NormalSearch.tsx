import React, { useState } from 'react'
import { Search } from 'lucide-react'
import SearchBlueIcon from '@/assets/search/mage_filter.svg?react'
import Modal from './Modals/NormalModal'
import Card from '../SearchCard'
import FilterDropdown from './Modals/FilterDropdown'

const NormalSearch: React.FC = () => {
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  // 임시 데이터 작성
  const [data] = useState([
    {
      id: 1,
      title: '서울 아파트',
      price: 500000000,
      managementFee: 200000,
      details: '지하철역 근처, 편리한 교통',
      imageUrl: '/images/apartment1.jpg',
      propertyType: '아파트',
      dealType: '매매',
      floor: 10,
      totalFloor: 20,
      area: 25.0, // 평수
    },
    {
      id: 2,
      title: '부산 오피스텔',
      price: 300000000,
      managementFee: 100000,
      details: '바다 전망, 최신 시설',
      imageUrl: '/images/apartment2.jpg',
      propertyType: '오피스텔',
      dealType: '전세',
      floor: 7,
      totalFloor: 20,
      area: 11.0, // 평수
    },
    {
      id: 3,
      title: '대구 빌라',
      price: 150000000,
      managementFee: 50000,
      details: '조용한 주택가, 넓은 공간',
      imageUrl: '/images/apartment3.jpg',
      propertyType: '빌라',
      dealType: '월세',
      floor: 2,
      totalFloor: 5,
      area: 18.0, // 평수
    },
    {
      id: 4,
      title: '인천 원룸',
      price: 70000000,
      managementFee: 30000,
      details: '깔끔한 인테리어, 역세권',
      imageUrl: '/images/apartment4.jpg',
      propertyType: '원룸',
      dealType: '월세',
      floor: 1,
      totalFloor: 4,
      area: 8.0, // 평수
    },
    {
      id: 5,
      title: '광주 주택',
      price: 250000000,
      managementFee: 0, // 관리비 없음
      details: '넓은 마당과 정원 포함',
      imageUrl: '/images/apartment5.jpg',
      propertyType: '주택',
      dealType: '매매',
      floor: 1, // 단독주택이므로 층 정보 없음
      totalFloor: 1, // 단독주택이므로 총 층수 없음
      area: 50.0, // 평수
    },
  ]);

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
    {/* 검색 시 나올 필터링 버튼 */}
    <div className="flex items-center justify-between w-full pb-2 mb-4 bg-white border-b border-ssaeng-gray-2">
      {/* 다른 요소가 있을 경우 */}
      <p className="text-gray-700 font-medium">검색 결과</p>

      {/* 필터링 버튼 */}
      <FilterDropdown />
    </div>

      {/* 카드 목록 */}
      <div className="flex flex-col gap-4">
        {data.map((item, index) => (
          <Card
            key={index}
            title={item.title}
            propertyType={item.propertyType}
            dealType={item.dealType}
            totalFloor={item.totalFloor}
            floor={item.floor}
            area={item.area}
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
