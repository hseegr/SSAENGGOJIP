import { Search } from 'lucide-react'
import { useState } from 'react'
import SearchDropdown from './SearchDropdown'
import { MOCK_RESULTS } from './SearchDropdown'

const GeneralSearch = () => {
  const [query, setQuery] = useState('')
  const [highlightedIndex, setHighlightedIndex] = useState(-1)
  const [showSearchDropdown, setShowSearchDropdown] = useState(false)

  const handleSelect = (name: string) => {
    setQuery(name)
    setShowSearchDropdown(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showSearchDropdown) return

    if (e.key === 'ArrowDown') {
      setHighlightedIndex((prev) => prev + 1)
    } else if (e.key === 'ArrowUp') {
      setHighlightedIndex((prev) => Math.max(prev - 1, 0))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      const filtered = MOCK_RESULTS.filter((item) => item.name.includes(query))
      if (highlightedIndex >= 0 && highlightedIndex < filtered.length) {
        handleSelect(filtered[highlightedIndex].name)
      }
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
            placeholder="지역명, 지하철역을 입력해 주세요."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              setShowSearchDropdown(true)
              setHighlightedIndex(-1)
            }}
            onKeyDown={handleKeyDown}
            className="flex-1 text-ssaeng-purple focus:outline-none placeholder:text-ssaeng-gray-2 placeholder:text-sm"
          />

          {/* 검색 버튼 */}
          <button className=" text-ssaeng-purple">
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
