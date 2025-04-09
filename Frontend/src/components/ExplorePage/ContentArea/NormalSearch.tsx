import React, { useState, useEffect, useMemo } from 'react'
import { Search } from 'lucide-react'
import SearchBlueIcon from '@/assets/search/mage_filter.svg?react'
import NormalSearchFilterModal from '@/components/ExplorePage/Modals/Normal/NormalSearchFilterModal'
import Card from '../SearchCard'
import FilterDropdown from './Modals/Normal/FilterDropdown'
import useSidebarStore from '@/store/sidebarStore'
import useFilterStore from '@/store/filterStore'
import { fetchNormalSearchResults } from '@/services/propertyService'
import { buildSearchFilters } from '@/utils/filterUtils'
import { useSearchParamsStore } from '@/store/searchParamsStore'
import { toast } from 'react-toastify'

// ✅ Property 타입 정의 (필요 시 분리된 파일에서 import해도 됨)
interface Property {
  id: number
  price: number
  propertyType: string
  dealType: string
  floor: number
  totalFloor: number
  area: number
  imageUrl: string
  isRecommend?: boolean
  rentPrice?: number
  address?: string
  latitude?: number
  longitude?: number
  isInterest?: boolean
  maintenancePrice?: number
  title?: string
  details?: string
}

interface FilteredData {
  total: number
  properties: Property[]
}

const NormalSearch: React.FC = () => {
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const { titles } = useSidebarStore()
  const initialData = useMemo<Property[]>(() => [], [])
  const { generalSearchQuery } = useSearchParamsStore()

  const {
    propertyTypes,
    dealType,
    MindepositPrice,
    MinmonthlyPrice,
    MaxdepositPrice,
    MaxmonthlyPrice,
    additionalFilters,
  } = useFilterStore()

  const [filteredData, setFilteredData] = useState<FilteredData>({
    total: 0,
    properties: [],
  })

  const handleSortChange = (sortType: string) => {
    const sortedData = [...filteredData.properties].sort((a, b) => {
      if (sortType === '금액 비싼 순') return b.price - a.price
      if (sortType === '금액 싼 순') return a.price - b.price
      return 0
    })
    setFilteredData({ ...filteredData, properties: sortedData })
  }

  const handleKeyPress = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      if (searchQuery.trim() !== '') {
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

          const searchResults = await fetchNormalSearchResults(searchQuery, filters)
          setFilteredData(searchResults ?? { total: 0, properties: [] })
        } catch (error: any) {
          if (error.response?.data?.code === 'PROPERTY4013') {
            toast.warning('검색 결과가 너무 많아요! 조건을 조금 더 구체적으로 설정해 주세요.')
          } else {
            console.error('검색 중 오류 발생:', error)
          }
          setFilteredData({ total: 0, properties: [] })
        }
      } else {
        setFilteredData({ total: 0, properties: [] })
      }
    }
  }

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
        const searchResults = await fetchNormalSearchResults(generalSearchQuery, filters)
        setFilteredData(searchResults ?? { total: 0, properties: [] })
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
        const newData = initialData.filter((item) => numericTitles.includes(item.id))
        return JSON.stringify(prev) === JSON.stringify(newData)
          ? prev
          : { ...prev, properties: newData }
      })
    }
  }, [titles, initialData])

  return (
    <>
      <div className="relative flex items-center justify-between mb-4 border border-gray-300 rounded-md mt-8 px-4 py-2 mx-auto w-[92%] max-w-[380px]">
        <div className="flex items-center w-full">
          <Search className="mr-2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="지역명, 지하철역명 검색"
            className="w-full focus:outline-none"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleKeyPress}
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

      {filteredData.properties.length > 0 && (
        <div className="flex items-center justify-between w-full px-2 pb-2 mb-4 bg-white border-b border-ssaeng-gray-2">
          <p className="text-gray-700 font-medium">검색 결과</p>
          <FilterDropdown onSortChange={handleSortChange} />
        </div>
      )}

      <div className="flex flex-col gap-4">
        {filteredData.properties.map((item) => (
          <Card key={item.id} {...item} />
        ))}
        {filteredData.properties.length === 0 && searchQuery.trim() !== '' && (
          <div className="text-center text-gray-500 py-4">검색 결과가 없습니다.</div>
        )}
      </div>

      <NormalSearchFilterModal
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        onComplete={(results) => {
          setFilteredData(results ?? { total: 0, properties: [] })
        }}
        searchQuery={searchQuery}
      />
    </>
  )
}

export default NormalSearch