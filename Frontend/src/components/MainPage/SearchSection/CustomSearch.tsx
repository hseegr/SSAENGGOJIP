import { Search } from 'lucide-react'
import SearchDropdown from './SearchDropdown'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSearchParamsStore } from '@/store/searchParamsStore'
import { searchLocations } from '@/services/searchService'
import { set } from 'react-hook-form'
// import { MOCK_RESULTS } from './SearchDropdown'

const CustomSearch = () => {
  const [query, setQuery] = useState('')
  const [selectedTime, setSelectedTime] = useState('1시간')

  // 시간 드롭다운 제어
  const [showTimeDropdown, setShowTimeDropdown] = useState(false)

  // 검색 드롭다운 제어
  const [showSearchDropdown, setShowSearchDropdown] = useState(false)

  // 드롭다운 내 키보드 선택 인덱스
  const [highlightedIndex, setHighlightedIndex] = useState(-1)

  // 페이지 이동 훅
  const navigate = useNavigate()

  // 검색 파라미터 저장 함수
  const { setCustomSearchParams } = useSearchParamsStore()

  // 검색 결과 상태
  const [searchResults, setSearchResults] = useState<any[]>([])

  // 검색어가 변경될 때마다 결과 업데이트
  useEffect(() => {
    if (query.trim() === '') {
      setSearchResults([])
      return
    }

    // 검색 요청
    const fetchResults = async () => {
      try {
        const result = await searchLocations(query)
        setSearchResults(result)
      } catch (error) {
        console.error('위치 검색 실패:', error)
      }
    }

    // 디바운스 처리
    const timer = setTimeout(fetchResults, 300)
    return () => clearTimeout(timer)
  }, [query])

  const timeOptions = [
    '5분',
    '10분',
    '15분',
    '20분',
    '25분',
    '30분',
    '45분',
    '1시간',
  ]

  // 검색 결과 중 특정 항목 클릭 또는 엔터 선택 시 실행되는 함수
  const handleSelect = (item: any) => {
    // 검색창에 선택된 텍스트 반영
    setQuery(item.name)

    // 선택 즉시 검색 실행
    setCustomSearchParams(
      item.name,
      selectedTime,
      item.latitude,
      item.longitude,
    )

    // 매물탐색 페이지로 이동
    navigate('/explore?tab=match_search')

    // 드롭다운 닫기
    setShowSearchDropdown(false)
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
      handleSearchClick()
    } else if (e.key === 'Escape') {
      // ESC: 드롭다운 닫기
      setShowSearchDropdown(false)
      setShowTimeDropdown(false)
    }
  }

  // 검색 버튼 클릭 시 호출되는 함수
  // const handleSearch = () => {
  //   if (query.trim()) {
  //     // 검색어와 시간으로 검색 (좌표 없음)
  //     setCustomSearchParams(query, selectedTime)
  //     navigate('/explore?tab=match_search')
  //   }
  // }

  // 현재 인덱스 항목 이름을 검색창에 반영
  // const handleSelectFromIndex = () => {
  //   const filtered = MOCK_RESULTS.filter((item) => item.name.includes(query))
  //   if (highlightedIndex >= 0 && highlightedIndex < filtered.length) {
  //     handleSelect(filtered[highlightedIndex].name)
  //     setShowSearchDropdown(false)
  //   }
  // }

  // 검색 버튼 클릭 핸들러
  const handleSearchClick = () => {
    if (query.trim() === '') {
      return
    }

    // 검색어와 일치하는 첫 번째 결과 찾기
    const exactMatch = searchResults.find(
      (item) => item.name.toLowerCase() === query.toLowerCase(),
    )

    if (exactMatch) {
      // 정확히 일치하는 항목 선택
      handleSelect(exactMatch)
    } else if (searchResults.length > 0) {
      // 일치하는 항목 없으면 첫 번째 결과 선택
      handleSelect(searchResults[0])
    } else {
      // 카카오맵 API로 좌표 검색 시도
      if (window.kakao && window.kakao.maps) {
        const geocoder = new window.kakao.maps.services.Geocoder()
        geocoder.addressSearch(query, (result, status) => {
          if (status === window.kakao.maps.services.Status.OK) {
            const latitude = parseFloat(result[0].y)
            const longitude = parseFloat(result[0].x)

            // 맞춤 검색 파라미터 설정
            setCustomSearchParams(query, selectedTime, latitude, longitude)

            // 매물탐색 페이지로 이동
            navigate(`/explore?tab=match_search`)
          } else {
            // 좌표 검색 실패 시
            alert('주소를 찾을 수 없습니다. 다른 검색어를 입력해주세요.')
          }
        })
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
              setShowSearchDropdown(true) // 검색 드롭다운 열기
              setShowTimeDropdown(false) // 시간 드롭다운 닫기
              setHighlightedIndex(-1) // 인덱스 초기화
            }}
            onFocus={() => {
              setShowSearchDropdown(true)
              setShowTimeDropdown(false)
            }}
            onBlur={() => {
              // 클릭 이벤트가 처리될 시간을 주기 위해 지연 후 드롭다운 닫기
              setTimeout(() => setShowSearchDropdown(false), 200)
            }} // 클릭 시에도 열기
            onKeyDown={handleKeyDown} // 방향키 핸들링
            className="flex-1 text-ssaeng-purple focus:outline-none placeholder:text-ssaeng-gray-2 placeholder:text-sm"
          />
          {/* 시간 선택 */}
          <div className="relative">
            <button
              onClick={() => {
                // 검색 드롭다운이 열려 있을 경우 시간 드롭다운 열지 않음
                if (showSearchDropdown) return

                // 검색 드롭다운이 닫혀있을 때만 시간 드롭다운 토글
                setShowTimeDropdown((prev) => !prev)
              }}
              className="mr-3 bg-ssaeng-purple/10 text-ssaeng-purple font-medium text-xs rounded-md px-2 py-1"
            >
              {selectedTime}
            </button>

            {/* 시간 선택 드롭다운 */}
            {showTimeDropdown && (
              <ul className="absolute right-0 top-full mt-4 w-16 bg-white border-2 border-ssaeng-gray-1 rounded-md z-20">
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
          <button onClick={handleSearchClick} className=" text-ssaeng-purple">
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

export default CustomSearch
