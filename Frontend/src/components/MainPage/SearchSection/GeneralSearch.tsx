import { Search } from 'lucide-react'
import { useState } from 'react'
import SearchDropdown from './SearchDropdown'

const GeneralSearch = () => {
  const [query, setQuery] = useState('')

  return (
    <div className="flex flex-col justify-center items-center">
      {/* 검색창 */}
      <div className="relative w-96">
        <div className="flex border-2 border-ssaeng-purple rounded-lg px-4 py-2 w-96">
          {/* 입력창 */}
          <input
            type="text"
            placeholder="검색어를 입력하세요."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 text-ssaeng-purple focus:outline-none placeholder:text-ssaeng-gray-2 placeholder:text-sm"
          />

          {/* 검색 버튼 */}
          <button className=" text-ssaeng-purple">
            <Search size={20} />
          </button>
        </div>
        {/* 전체 검색 결과 드롭다운 */}
        <SearchDropdown query={query} />
      </div>
    </div>
  )
}

export default GeneralSearch
