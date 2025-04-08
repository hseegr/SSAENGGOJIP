import React, { useState, useEffect } from 'react'
import { Search } from 'lucide-react'
import SearchBlueIcon from '@/assets/search/mage_filter.svg?react'
import Modal from './Modals/NormalModal'
import useSidebarStore from '@/store/sidebarStore'
import useFilterStore from '@/store/filterStore' // 필터 스토어 가져오기
import { fetchNormalSearchResults } from '@/services/mapService'
import { buildSearchFilters } from '@/utils/filterUtils'
import { useSearchParamsStore } from '@/store/searchParamsStore'
import usePropertyStore from '@/store/propertyStore'
import PropertySmallCard from '@/components/common/property/PropertySmallCard'

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
  const [filteredData, setFilteredData] = useState<Property[]>(properties)

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
          console.log('🔢 총 매물 수:', searchResults?.total)
          console.log('📋 매물 리스트:', searchResults?.properties)

          // 검색 API 호출
          // API 응답 구조에 따라 데이터 추출 방식 수정 필요
          setFilteredData(searchResults ?? { total: 0, properties: [] })
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
              // latitude: item.latitude, // Property 타입에 latitude는 없으므로 제거하거나 Property 타입에 추가해야 합니다.
              // longitude: item.longitude, // Property 타입에 longitude는 없으므로 제거하거나 Property 타입에 추가해야 합니다.
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

      {/* 모달 */}
      <Modal isOpen={isFilterOpen} onClose={() => setIsFilterOpen(false)} />
    </>
  )
}

export default NormalSearch
