import React, { useState, useEffect, useMemo } from 'react'
import { Search } from 'lucide-react'
import SearchBlueIcon from '@/assets/search/mage_filter.svg?react'
import Modal from './Modals/NormalModal'
import Card from '../SearchCard'
import FilterDropdown from './Modals/Normal/FilterDropdown'
import useSidebarStore from '@/store/sidebarStore'
import useFilterStore from '@/store/filterStore' // 필터 스토어 가져오기
import { fetchNormalSearchResults } from '@/services/mapService'
import { buildSearchFilters } from '@/utils/filterUtils'
import usePropertyStore from '@/store/propertyStore'

interface Property {
  // 공통 필드
  id: number
  price: number
  propertyType: string
  dealType: string
  floor: number
  totalFloor: number
  area: number
  imageUrl: string

  // API 전용 필드 (옵셔널)
  isRecommend?: boolean
  rentPrice?: number
  address?: string
  latitude?: number
  longitude?: number
  isInterest?: boolean
  maintenancePrice?: number

  // 초기 데이터 전용 필드 (옵셔널)
  title?: string
  details?: string
}

const NormalSearch: React.FC = () => {
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('') // 검색어 상태 추가
  const { titles } = useSidebarStore()

  const { properties } = usePropertyStore()
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
  const [filteredData, setFilteredData] = useState<Property[]>(properties)

  // 정렬 변경 함수
  const handleSortChange = (sortType: string) => {
    if (filteredData?.properties) {
      const sortedData = [...filteredData.properties].sort(
        (a: Property, b: Property) => {
          if (sortType === '금액 비싼 순') return b.price - a.price
          if (sortType === '금액 싼 순') return a.price - b.price
          return 0
        },
      )
      setFilteredData({ ...filteredData, properties: sortedData })
    }
  }

  // 엔터 키 입력 시 검색 실행
  const handleKeyPress = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      if (searchQuery.trim() !== '') {
        try {
          // 필터 구성
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

          // API 응답 구조 그대로 사용
          setFilteredData(searchResults ?? { properties: [], total: 0 })
          console.log('검색 결과:', searchResults)
        } catch (error) {
          console.error('검색 중 오류 발생:', error)
          setFilteredData({ properties: [], total: 0 }) // 오류 발생 시 빈 배열 설정
        }
      } else {
        // 검색어가 없으면 전체 properties 데이터 사용 (형식 맞춤)
        const propertiesArray = Array.isArray(properties) ? properties : []
        setFilteredData({
          properties: propertiesArray,
          total: propertiesArray.length,
        })
      }
    }
  }

  // properties가 변경될 때마다 filteredData 업데이트
  useEffect(() => {
    // properties가 배열인지 확인
    const propertiesArray = Array.isArray(properties) ? properties : []

    // titles가 있으면 titles에 해당하는 항목만 필터링
    if (titles?.length) {
      const numericTitles = titles.map(Number)
      const newData = propertiesArray.filter((item) =>
        numericTitles.includes(item.id),
      )

      // 검색 결과와 동일한 형식으로 맞추기
      setFilteredData({ properties: newData, total: newData.length })
    } else {
      // titles가 없으면 전체 properties 데이터 사용
      setFilteredData({
        properties: propertiesArray,
        total: propertiesArray.length,
      })
    }
  }, [titles, properties])

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

      {/* 검색 결과가 있거나 검색어가 있을 때 필터링 버튼 표시 */}
      {filteredData?.properties?.length > 0 && (
        <div className="flex items-center justify-between w-full px-2 pb-2 mb-4 bg-white border-b border-ssaeng-gray-2">
          <p className="text-gray-700 font-medium">검색 결과</p>
          <FilterDropdown onSortChange={handleSortChange} />
        </div>
      )}

      {/* 카드 목록 */}
      <div className="flex flex-col gap-4">
        {filteredData?.properties?.map((item) => (
          <Card
            key={item.id}
            id={item.id || item.propertyId}
            title={item.title}
            propertyType={item.propertyType}
            dealType={item.dealType}
            totalFloor={item.totalFloor}
            floor={item.floor}
            area={item.area}
            price={item.price}
            rentPrice={item.rentPrice}
            managementFee={item.maintenancePrice}
            isRecommend={item.isRecommend}
            imageUrl={item.imageUrl}
          />
        ))}
        {filteredData?.properties?.length === 0 &&
          searchQuery.trim() !== '' && (
            <div className="text-center text-gray-500 py-4">
              검색 결과가 없습니다.
            </div>
          )}
      </div>

      {/* 모달 */}
      <Modal isOpen={isFilterOpen} onClose={() => setIsFilterOpen(false)} />
    </>
  )
}

export default NormalSearch
