import matchSearchStore from '@/store/matchSearchStore'
import useMatchSearchResultStore from '@/store/searchResultStore'
import SearchBlueIcon from '@/assets/search/mage_filter.svg?react'
import { useState, useEffect } from 'react'
import SortButton from './SortButton' // SortButton 컴포넌트 import
import MatchCard from './MatchCard'

// 결과 아이템의 타입 정의
interface ResultItem {
  id: string
  title: string
  propertyType: string
  dealType: string
  totalFloor: number
  floor: number
  area: number
  price: number
  maintenancePrice: number
  isRecommend: boolean
  imageUrl: string
  transportTimes: number[]
  latitude: number
  longitude: number
  rentPrice: number
  isInterest: boolean
}

const MatchSearchResults = () => {
  const { setIsSearching } = matchSearchStore()
  const { results, resetResults, transportModes, setTransportModes } =
    useMatchSearchResultStore()
  const [filteredResults, setFilteredResults] = useState<ResultItem[]>([])

  useEffect(() => {
    // results가 업데이트될 때 filteredResults를 초기화하고 가격순으로 정렬
    if (results && results.properties) {
      const initialSort = [...(results.properties as ResultItem[])].sort(
        (a, b) => a.price - b.price,
      )
      setFilteredResults(initialSort)
    } else {
      setFilteredResults([])
    }
  }, [results])

  const setIsFilterOpen = () => {
    console.log('클릭')
  }

  const handleGoBack = () => {
    setIsSearching(false)
    resetResults()
    setTransportModes([])
  }

  const handleSortChange = (option: number | string) => {
    // results가 없을 경우 정렬 방지
    if (!results || !results.properties) {
      return
    }

    const sortedResults: ResultItem[] = [
      ...(results.properties as ResultItem[]),
    ]

    if (option === '0') {
      // transportTimes[0]을 기준으로 정렬
      sortedResults.sort((a, b) => {
        return a.transportTimes[0] - b.transportTimes[0]
      })
    } else if (option === '1') {
      // transportTimes[1]을 기준으로 정렬
      sortedResults.sort((a, b) => {
        return a.transportTimes[1] - b.transportTimes[1]
      })
    } else if (option === 'price') {
      // price를 기준으로 정렬
      sortedResults.sort((a, b) => {
        return a.price - b.price
      })
    }

    setFilteredResults(sortedResults)
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={handleGoBack}
          className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
        >
          설정으로 돌아가기
        </button>
        <button
          className="flex items-center ml-4 cursor-pointer whitespace-nowrap"
          onClick={() => setIsFilterOpen()}
        >
          <SearchBlueIcon className="text-ssaeng-purple w-5 h-5" />
          <span className="ml-1 text-ssaeng-purple">필터</span>
        </button>
        <SortButton onSortChange={handleSortChange} />
      </div>
      {/* 카드 목록 */}

      <div className="flex flex-col gap-4 mb-6">
        {filteredResults.length > 0 ? (
          filteredResults.map((item) => (
            <MatchCard
              key={item.id}
              id={Number(item.id)}
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
              transportTimes={item.transportTimes}
              latitude={item.latitude}
              longitude={item.longitude}
            />
          ))
        ) : (
          <p className="text-center text-gray-500 py-8">
            검색 결과가 없습니다.
          </p>
        )}
      </div>
    </div>
  )
}

export default MatchSearchResults
