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
import { useSearchParamsStore } from '@/store/searchParamsStore'

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
  const initialData = useMemo<Property[]>(() => [], [])
  const { generalSearchQuery } = useSearchParamsStore() // ✅ Zustand에서 검색어 가져옴

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

  const [filteredData, setFilteredData] = useState<{
    total: number
    properties: Property[]
  }>({ total: 0, properties: [] })

  // 정렬 변경 함수
  const handleSortChange = (sortType: string) => {
    const sortedData = [...(filteredData?.properties || filteredData)].sort(
      (a: Property, b: Property) => {
        if (sortType === '금액 비싼 순') return b.price - a.price
        if (sortType === '금액 싼 순') return a.price - b.price
        return 0
      },
    )
    const newData = filteredData
      ? { ...filteredData, properties: sortedData }
      : sortedData
    setFilteredData(newData as Property[])
  }

  // 엔터 키 입력 시 검색 실행
  const handleKeyPress = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    console.log('🧪 handleKeyPress 호출됨:', e.key)
    if (e.key === 'Enter') {
      if (searchQuery.trim() !== '') {
        // 이거 지우면 빈값 보내면 모든 매물 다 요청함
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

          console.log('🔍 필터 정보:', filters)
          console.log('🔎 검색어:', searchQuery)

          const searchResults = await fetchNormalSearchResults(
            searchQuery,
            filters,
          )
          console.log('🎉 API 응답 로그:', searchResults)
          console.log('🔢 총 매물 수:', searchResults?.total)
          console.log('📋 매물 리스트:', searchResults?.properties)

          // 검색 API 호출
          // API 응답 구조에 따라 데이터 추출 방식 수정 필요
          setFilteredData(searchResults ?? { total: 0, properties: [] })
          console.log('검색 결과:', searchResults)
          console.log('필터 저장 결과:', filteredData)
        } catch (error) {
          console.error('검색 중 오류 발생:', error)
          setFilteredData({ total: 0, properties: [] }) // 오류 발생 시 빈 배열 설정
        }
      } else {
        // ❗ filteredData는 항상 { total, properties } 구조여야 하므로 이 구조로 초기화
        setFilteredData({ total: 0, properties: [] })
        console.log('필터 저장 결과 (검색어 없음):', filteredData)
      }
    }
  }

  // ✅ Zustand 검색어(generalSearchQuery)가 변경될 때 자동 검색 실행
  useEffect(() => {
    const fetchData = async () => {
      if (!generalSearchQuery.trim()) return

      try {
        const filters = buildSearchFilters({
          propertyTypes,
          dealType,
          MindepositPrice,
          MaxdepositPrice,
          MinmonthlyPrice,
          MaxmonthlyPrice,
          additionalFilters,
        })

        console.log('💬 Zustand로 받은 검색어:', generalSearchQuery)
        const searchResults = await fetchNormalSearchResults(
          generalSearchQuery,
          filters,
        )

        setFilteredData(searchResults ?? { total: 0, properties: [] })
        // 상태를 업데이트하면 자동 렌더링됨
      } catch (err) {
        console.error('❌ Zustand 검색 자동 실행 중 오류:', err)
        setFilteredData({ total: 0, properties: [] })
      }
    }

    fetchData()
  }, [generalSearchQuery])

  useEffect(() => {
    if (titles?.length) {
      const numericTitles = titles.map(Number)
      setFilteredData((prev) => {
        const newData = initialData.filter((item) =>
          numericTitles.includes(item.id),
        )
        return JSON.stringify(prev) === JSON.stringify(newData) ? prev : newData
      })
    } else {
      // titles가 없으면 초기 데이터 또는 이전 검색 결과를 유지 (선택)
      // 만약 titles가 비어있을 때 전체 데이터를 보여주고 싶다면 아래 주석 해제
      // setFilteredData(initialData);
    }
  }, [titles, initialData]) // ✅ 모든 의존성 명시

  useEffect(() => {
    console.log('🚨 현재 filteredData:', filteredData)
    console.log('🔢 매물 수:', filteredData.properties?.length)
  }, [filteredData])

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
            id={item.id}
            title={item.title}
            propertyType={item.propertyType}
            dealType={item.dealType}
            totalFloor={item.totalFloor}
            floor={item.floor}
            area={item.area}
            price={item.price}
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
