import { Search } from 'lucide-react'
import SearchDropdown from './SearchDropdown'
import { useState } from 'react'

const CustomSearch = () => {
  const [query, setQuery] = useState('')
  const [selectedTime, setSelectedTime] = useState('1시간')
  const [showTimeDropdown, setShowTimeDropdown] = useState(false)

  const timeOptions = ['5분', '10분', '15분', '20분', '25분', '30분', '1시간']

  return (
    <div className="flex flex-col justify-center items-center">
      {/* 검색창 */}
      <div className="relative w-96">
        <div className="flex border-2 border-ssaeng-purple rounded-lg px-4 py-2 w-96">
          {/* 입력창 */}
          <input
            type="text"
            placeholder="지역명, 지하철역, 건물명을 입력해 주세요."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 text-ssaeng-purple focus:outline-none placeholder:text-ssaeng-gray-2 placeholder:text-sm"
          />
          {/* 시간 선택 */}
          <div className="relative">
            <button
              onClick={() => setShowTimeDropdown((prev) => !prev)}
              className="mr-3 bg-ssaeng-purple/10 text-ssaeng-purple font-medium text-xs rounded-md px-2 py-1"
            >
              {selectedTime}
            </button>

            {/* 시간 선택 드롭다운 */}
            {showTimeDropdown && (
              <ul className="absolute right-0 top-full mt-4 w-16 bg-white border-2 border-ssaeng-gray-1 rounded-md z-10">
                {timeOptions.map((time) => (
                  <li
                    key={time}
                    onClick={() => {
                      setSelectedTime(time)
                      setShowTimeDropdown(false)
                    }}
                    className={`px-3 py-2 text-xs cursor-pointer hover:bg-gray-50 ${
                      time === selectedTime
                        ? 'text-ssaeng-purple font-semibold'
                        : ''
                    }`}
                  >
                    {time}
                  </li>
                ))}
              </ul>
            )}
          </div>

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

export default CustomSearch
