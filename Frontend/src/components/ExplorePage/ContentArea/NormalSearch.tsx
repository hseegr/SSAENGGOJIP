import React, { useState, useEffect, useMemo, useRef } from 'react'
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
  const { titles, setTitles } = useSidebarStore() // setTitles 추가
  const initialData = useMemo<Property[]>(() => [], [])
  const { generalSearchQuery, setGeneralSearchParams } = useSearchParamsStore() // setGeneralSearchParams 추가
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

  // 상태 초기화 시 명확한 타입 정의
  const [filteredData, setFilteredData] = useState<{
    total: number
    properties: Property[]
  }>({ total: 0, properties: [] })

  // 정렬 변경 함수
  const handleSortChange = (sortType: string) => {
    // 방어 로직: filteredData와 properties가 존재하는지 확인
    if (!filteredData || !filteredData.properties) {
      console.error('정렬 중 filteredData 또는 properties가 없음')
      return
    }

    try {
      // 배열 복사 (원본 유지)
      const sortedData = [...filteredData.properties].sort(
        (a: Property, b: Property) => {
          if (sortType === '금액 비싼 순') return b.price - a.price
          if (sortType === '금액 싼 순') return a.price - b.price
          return 0
        },
      )
      // 새 객체 생성하여 업데이트 (불변성 유지)
      setFilteredData({
        total: filteredData.total,
        properties: sortedData,
      })
    } catch (error) {
      console.error('정렬 중 오류 발생:', error)
    }
  }

  // 엔터 키 입력 시 검색 실행
  const handleKeyPress = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    console.log('🧪 handleKeyPress 호출됨:', e.key)
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

          console.log('🔍 필터 정보:', filters)
          console.log('🔎 검색어:', searchQuery)

          const searchResults = await fetchNormalSearchResults(
            searchQuery,
            filters,
          )

          console.log('🎉 API 응답 로그:', searchResults)

          // 방어 로직: 유효한 응답 확인
          if (!searchResults || typeof searchResults !== 'object') {
            console.error('검색 결과가 유효하지 않음:', searchResults)
            setFilteredData({ total: 0, properties: [] })
            return
          }

          // 응답에 total과 properties가 있는지 확인
          const total = searchResults.total || 0
          const properties = Array.isArray(searchResults.properties)
            ? searchResults.properties
            : []

          console.log('🔢 총 매물 수:', total)
          console.log('📋 매물 리스트 길이:', properties.length)

          // 안전하게 상태 업데이트
          setFilteredData({ total, properties })
        } catch (error) {
          console.error('검색 중 오류 발생:', error)
          setFilteredData({ total: 0, properties: [] })
        }
      } else {
        setFilteredData({ total: 0, properties: [] })
        console.log('필터 저장 결과 (검색어 없음):', filteredData)
      }
    }
  }

  // Zustand 검색어 변경 시 자동 검색
  useEffect(() => {
    const fetchData = async () => {
      if (!generalSearchQuery.trim()) return

      try {
        // 검색창에 검색어 표시
        setSearchQuery(generalSearchQuery)

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

        // 안전하게 상태 업데이트
        if (searchResults && typeof searchResults === 'object') {
          setFilteredData({
            total: searchResults.total || 0,
            properties: Array.isArray(searchResults.properties)
              ? searchResults.properties
              : [],
          })
        } else {
          setFilteredData({ total: 0, properties: [] })
        }
      } catch (err) {
        console.error('❌ Zustand 검색 자동 실행 중 오류:', err)
        setFilteredData({ total: 0, properties: [] })
      }
    }

    fetchData()
  }, [generalSearchQuery])

  // titles 변경 시 처리
  useEffect(() => {
    if (!titles?.length) return

    try {
      const numericTitles = titles.map(Number)

      setFilteredData((prev) => {
        if (!prev || !prev.properties) {
          return { total: 0, properties: [] }
        }

        // titles 기반으로 저장된 속성 중 ID가 일치하는 것만 필터링
        const matchedProperties = prev.properties.filter((item) =>
          numericTitles.includes(item.id),
        )

        // 결과가 달라진 경우만 업데이트
        if (matchedProperties.length !== prev.properties.length) {
          return {
            total: matchedProperties.length,
            properties: matchedProperties,
          }
        }

        // 같은 경우 이전 상태 그대로 반환
        return prev
      })
    } catch (error) {
      console.error('titles 처리 중 오류:', error)
    }
  }, [titles])

  // 컴포넌트 마운트/언마운트 처리 - 언마운트 시 상태 초기화
  useEffect(() => {
    console.log('🔄 컴포넌트 마운트됨')

    // 언마운트 시 상태 초기화
    return () => {
      console.log('🛑 컴포넌트 언마운트됨 - 상태 초기화')

      // 검색 결과 초기화
      setFilteredData({ total: 0, properties: [] })

      // 검색어 초기화
      setSearchQuery('')

      // 타이틀 초기화 (선택적)
      setTitles([])

      // Zustand 검색 파라미터 초기화 (선택적)
      setGeneralSearchParams('')
    }
  }, [setTitles, setGeneralSearchParams])

  // 디버깅용 로그
  useEffect(() => {
    if (filteredData) {
      console.log('🚨 현재 filteredData:', filteredData)
      console.log('🔢 매물 수:', filteredData.properties?.length)
    } else {
      console.error('filteredData가 undefined임')
    }
  }, [filteredData])

  return (
    <>
      {/* 검색창 */}
      <div className="relative flex items-center justify-between mb-4 border border-gray-300 rounded-md mx-2 mt-8 px-4 py-2">
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

      {/* 검색 결과가 있을 때 필터링 버튼 표시 */}
      {filteredData &&
        filteredData.properties &&
        filteredData.properties.length > 0 && (
          <div className="flex items-center justify-between w-full px-2 pb-2 mb-4 bg-white border-b border-ssaeng-gray-2">
            <p className="text-gray-700 font-medium">검색 결과</p>
            <FilterDropdown onSortChange={handleSortChange} />
          </div>
        )}

      {/* 카드 목록 */}
      <div className="flex flex-col gap-4">
        {filteredData &&
          filteredData.properties &&
          filteredData.properties.map((item) => (
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
        {filteredData &&
          filteredData.properties &&
          filteredData.properties.length === 0 &&
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
