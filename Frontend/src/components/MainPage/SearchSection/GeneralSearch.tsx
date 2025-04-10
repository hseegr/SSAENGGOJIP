import { Search } from 'lucide-react'
import { useState } from 'react'
import SearchDropdown from './SearchDropdown'
import { useNavigate } from 'react-router-dom'
import { useSearchParamsStore } from '@/store/searchParamsStore'
// import { MOCK_RESULTS } from './SearchDropdown'

const GeneralSearch = () => {
  // 검색어 상태
  const [query, setQuery] = useState('')

  // 드롭다운 강조 항목 인덱스
  const [highlightedIndex, setHighlightedIndex] = useState(-1)

  // 드롭다운 표시 여부
  const [showSearchDropdown, setShowSearchDropdown] = useState(false)

  // 페이지 이동을 위한 훅
  const navigate = useNavigate()

  // 검색 파라미터 저장 함수
  const { setGeneralSearchParams } = useSearchParamsStore()

  // 드롭다운 항목 선택 시 호출되는 함수
  const handleSelect = (name: string, lat: number, lng: number) => {
    setQuery(name)
    setShowSearchDropdown(false)

    // 선택 즉시 검색 실행
    setGeneralSearchParams(name, lat, lng)
    navigate('/explore?tab=normal_search')
  }

  // 검색 버튼 클릭 시 호출되는 함수
  const handleSearch = () => {
    if (query.trim()) {
      // 검색어만으로 검색 (좌표 없음)
      setGeneralSearchParams(query)
      navigate('/explore?tab=normal_search')
    }
  }

  // 키보드 이벤트 처리
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      // 아래 화살표: 다음 항목 강조
      e.preventDefault()
      setHighlightedIndex((prev) => prev + 1)
    } else if (e.key === 'ArrowUp') {
      // 위 화살표: 이전 항목 강조
      e.preventDefault()
      setHighlightedIndex((prev) => Math.max(prev - 1, 0))
    } else if (e.key === 'Enter') {
      // 엔터: 검색 실행
      e.preventDefault()
      handleSearch()
    } else if (e.key === 'Escape') {
      // ESC: 드롭다운 닫기
      setShowSearchDropdown(false)
    }
  }

  return (
    <div className="flex flex-col justify-center items-center">
      {/* 검색창 */}
      <div className="relative w-96">
        <div className="flex border-2 border-ssaeng-purple rounded-lg px-4 py-2 w-96">
          {/* 입력창 */}
          <input
            type="text"
            placeholder="지하철역을 입력해 주세요. (예. 잠실역)"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              setShowSearchDropdown(true)
              setHighlightedIndex(-1)
            }}
            onFocus={() => setShowSearchDropdown(true)}
            onBlur={() => {
              // 클릭 이벤트가 처리될 시간을 주기 위해 지연 후 드롭다운 닫기
              setTimeout(() => setShowSearchDropdown(false), 200)
            }}
            onKeyDown={handleKeyDown}
            className="flex-1 text-ssaeng-purple focus:outline-none placeholder:text-ssaeng-gray-2 placeholder:text-sm"
          />
          {/* 높이 조절 위한 임시 박스 */}
          <div>
            <button className="mr-3 text-[#ffffff] font-medium text-xs rounded-md px-2 py-1">
              5분
            </button>
          </div>
          {/* 검색 버튼 */}
          <button className=" text-ssaeng-purple" onClick={handleSearch}>
            <Search size={20} />
          </button>
        </div>
        {/* 전체 검색 결과 드롭다운 */}
        <SearchDropdown
          query={query}
          onSelect={handleSelect}
          highlightedIndex={highlightedIndex}
        />
      </div>
    </div>
  )
}

export default GeneralSearch
