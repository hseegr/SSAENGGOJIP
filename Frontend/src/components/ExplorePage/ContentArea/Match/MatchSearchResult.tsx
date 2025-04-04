import matchSearchStore from '@/store/matchSearchStore'
import useMatchSearchResultStore from '@/store/searchResultStore'
import SearchBlueIcon from '@/assets/search/mage_filter.svg?react'
import { useState } from 'react'
import SortButton from './SortButton' // SortButton 컴포넌트 import
import MatchCard from './MatchCard'
// 결과 아이템의 타입 정의 (중복된 인터페이스 선언 제거)
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
}
const MatchSearchResults = () => {
  const { setIsSearching } = matchSearchStore()
  const { results, resetResults } = useMatchSearchResultStore()
  const [filteredResults, setFilteredResults] = useState<ResultItem[]>([])

  const setIsFilterOpen = () => {
    console.log('클릭')
  }

  const handleGoBack = () => {
    setIsSearching(false)
    resetResults()
  }

  const handleSortChange = (option: number | stirng) => {
    console.log('정렬 옵션 변경:', option)

    // 타입 단언을 사용하여 results가 ResultItem[] 타입임을 명시
    const sortedResults: ResultItem[] = [...(results as ResultItem[])]

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
              managementFee={item.maintenancePrice}
              isRecommend={item.isRecommend}
              imageUrl={item.imageUrl}
              transportTimes={item.transportTimes}
            />
          ))
        ) : (
          <p className="text-center text-gray-500 py-8">
            검색 결과가 없습니다.
          </p>
        )}
      </div>

      <button
        onClick={handleGoBack}
        className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
      >
        설정으로 돌아가기
      </button>
    </div>
  )
}

export default MatchSearchResults
