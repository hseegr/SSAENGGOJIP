import React, { useState, useEffect } from 'react'
import { Search } from 'lucide-react'
import SearchBlueIcon from '@/assets/search/mage_filter.svg?react'
import Modal from './Modals/NormalModal'
import Card from '../SearchCard'
import FilterDropdown from './Modals/Normal/FilterDropdown'
import useSidebarStore from '@/store/sidebar'
import useFilterStore from '@/store/filterStore' // 필터 스토어 가져오기
import { fetchNormalSearchResults } from '@/services/mapService'
import { buildSearchFilters } from '@/utils/filterUtils'

const NormalSearch: React.FC = () => {
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('') // 검색어 상태 추가
  const { titles } = useSidebarStore()
  const [initialData] = useState([
    {
      id: 4412314,
      title: '서울 아파트',
      price: 500000000,
      managementFee: 200000,
      details: '지하철역 근처, 편리한 교통',
      imageUrl: '/images/apartment1.jpg',
      propertyType: '아파트',
      dealType: '매매',
      floor: 10,
      totalFloor: 20,
      area: 25.0,
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
      area: 11.0,
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
      area: 18.0,
    },
    {
      id: 4412312,
      title: '인천 원룸',
      price: 70000000,
      managementFee: 30000,
      details: '깔끔한 인테리어, 역세권',
      imageUrl: '/images/apartment4.jpg',
      propertyType: '원룸',
      dealType: '월세',
      floor: 1,
      totalFloor: 4,
      area: 8.0,
    },
    {
      id: 4412313,
      title: '광주 주택',
      price: 250000000,
      managementFee: 0,
      details: '넓은 마당과 정원 포함',
      imageUrl: '/images/apartment5.jpg',
      propertyType: '주택',
      dealType: '매매',
      floor: 1,
      totalFloor: 1,
      area: 50.0,
    },
  ])
  // 필터 스토어에서 데이터 가져오기
  const {
    propertyTypes,
    dealType,
    MindepositPrice,
    MinmonthlyPrice,
    MaxdepositPrice,
    MaxmonthlyPrice,
    additionalFilters,
  } = useFilterStore()
  const { setSelectedCard } = useSidebarStore()
  const [filteredData, setFilteredData] = useState(initialData)
  // 정렬 변경 함수
  const handleSortChange = (sortType: string) => {
    const sortedData = [...filteredData].sort((a, b) => {
      if (sortType === '금액 비싼 순') return b.price - a.price
      if (sortType === '금액 싼 순') return a.price - b.price
      return 0
    })
    setFilteredData(sortedData)
  }
  // 엔터 키 입력 시 검색 실행
  const handleKeyPress = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      // 엔터 키 감지
      if (searchQuery.trim() !== '') {
        // 빈 값이 아닐 때만 검색 실행
        try {
          // 필터 구성 부분 수정
          const filters = buildSearchFilters({
            propertyTypes,
            dealType,
            MindepositPrice,
            MaxdepositPrice,
            MinmonthlyPrice,
            MaxmonthlyPrice,
            additionalFilters,
          })
          const searchResults = await fetchNormalSearchResults(
            searchQuery,
            filters,
          ) // 검색 API 호출
          setFilteredData(searchResults) // 응답 데이터를 상태에 저장
        } catch (error) {
          console.error('검색 중 오류 발생:', error)
          setFilteredData([]) // 오류 발생 시 빈 배열 설정
        }
      } else {
        setFilteredData(initialData) // 검색어가 없으면 초기 데이터로 복원
      }
    }
  }

  useEffect(() => {
    if (titles && Array.isArray(titles)) {
      // titles 배열의 문자열을 숫자로 변환하여 item.id와 비교
      const NewfilteredData = initialData.filter((item) =>
        titles.map(Number).includes(item.id),
      )

      if (NewfilteredData.length === 0) {
        // setFilteredData(initialData)
        setSelectedCard(null)
      } else {
        // 필터링된 데이터를 업데이트
        setFilteredData(NewfilteredData)
      }
      setSelectedCard(null)
    }
  }, [titles, initialData, setSelectedCard])

  return (
    <>
      {/* 검색창 */}
      <div className="relative flex items-center justify-between mb-4 border border-gray-300 rounded-md mx-2 px-4 py-2">
        <div className="flex items-center w-full">
          <Search className="mr-2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="지역명, 지하철역명 검색"
            className="w-full focus:outline-none"
            value={searchQuery} // 검색어 상태 연결
            onChange={(e) => setSearchQuery(e.target.value)} // 입력값 변경 시 상태 업데이트
            onKeyDown={handleKeyPress} // 엔터 키 입력 시 검색 실행
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

      {/* 검색 결과가 있을 때만 필터링 버튼 표시 */}
      {filteredData.length > 0 && (
        <div className="flex items-center justify-between w-full px-2 pb-2 mb-4 bg-white border-b border-ssaeng-gray-2">
          <p className="text-gray-700 font-medium">검색 결과</p>
          <FilterDropdown onSortChange={handleSortChange} />
        </div>
      )}

      {/* 카드 목록 */}
      <div className="flex flex-col gap-4">
        {filteredData.map((item) => (
          <Card
            key={item.id}
            id={item.id}
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
