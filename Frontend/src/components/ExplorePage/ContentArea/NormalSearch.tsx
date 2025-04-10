import React, { useState, useEffect } from 'react'
import { Search } from 'lucide-react'
import SearchBlueIcon from '@/assets/search/mage_filter.svg?react'
import NormalSearchFilterModal from '@/components/ExplorePage/Modals/Normal/NormalSearchFilterModal'
import useSidebarStore from '@/store/sidebarStore'
import useFilterStore from '@/store/filterStore'
import { fetchNormalSearchResults } from '@/services/propertyService'
import { buildSearchFilters } from '@/utils/filterUtils'
import { useSearchParamsStore } from '@/store/searchParamsStore'
import { toast } from 'react-toastify'
import usePropertyStore from '@/store/propertyStore'
import PropertySmallCard from '@/components/common/property/PropertySmallCard'

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
  propertyId?: number
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
  const { generalSearchQuery } = useSearchParamsStore()
  const { properties } = usePropertyStore()

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

          const searchResults = await fetchNormalSearchResults(
            searchQuery,
            filters,
          )
          setFilteredData(searchResults ?? { total: 0, properties: [] })
        } catch (error: any) {
          if (error.response?.data?.code === 'PROPERTY4013') {
            toast.warning(
              '검색 결과가 너무 많아요! 조건을 조금 더 구체적으로 설정해 주세요.',
            )
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
        const searchResults = await fetchNormalSearchResults(
          generalSearchQuery,
          filters,
        )
        setFilteredData(searchResults ?? { total: 0, properties: [] })
      } catch (err) {
        console.error('❌ Zustand 검색 자동 실행 중 오류:', err)
        setFilteredData({ total: 0, properties: [] })
      }
    }

    fetchData()
  }, [generalSearchQuery])

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

  // properties 또는 titles가 변경될 때마다 filteredData 업데이트
  useEffect(() => {
    // properties가 배열인지 확인
    const propertiesArray = Array.isArray(properties) ? properties : []

    // titles가 있으면 titles에 해당하는 propertyId를 가진 항목만 필터링
    if (titles?.length) {
      console.log('타이틀은 잇어요', titles)
      console.log('property도 이써용', propertiesArray)

      const newData = propertiesArray.filter((item) =>
        titles.includes(String(item.propertyId)),
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

  useEffect(() => {
    console.log('🚨 현재 filteredData:', filteredData)
    console.log('🔢 매물 수:', filteredData.properties?.length)
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

      <div className="flex flex-col gap-4">
        {filteredData?.properties?.map((item, key) => (
          <PropertySmallCard
            key={key}
            property={{
              id: item.id || item.propertyId,
              propertyType: item.propertyType,
              dealType: item.dealType,
              price: item.price,
              rentPrice: item.rentPrice,
              maintenancePrice: item.maintenancePrice,
              totalFloor: item.totalFloor,
              floor: item.floor,
              area: item.area,
              imageUrl: item.imageUrl,
              isRecommend: item.isRecommend,
              isInterest: item.isInterest,
              // title: item.title, // Property 타입에 title은 없으므로 제거하거나 Property 타입에 추가해야 합니다.
              // address: item.address, // Property 타입에 address는 없으므로 제거하거나 Property 타입에 추가해야 합니다.
              latitude: item.latitude, // Property 타입에 latitude는 없으므로 제거하거나 Property 타입에 추가해야 합니다.
              longitude: item.longitude, // Property 타입에 longitude는 없으므로 제거하거나 Property 타입에 추가해야 합니다.
            }}
          />
        ))}
        {filteredData?.properties?.length === 0 &&
          searchQuery.trim() !== '' && (
            <div className="text-center text-gray-500 py-4">
              검색 결과가 없습니다.
            </div>
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
