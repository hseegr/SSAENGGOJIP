import { Search } from 'lucide-react'
import { useState, useEffect } from 'react'
import SearchDropdown from './SearchDropdown'
import { useNavigate } from 'react-router-dom'
import { useSearchParamsStore } from '@/store/searchParamsStore'
import { searchLocations } from '@/services/searchService'
import LoadingModal from '@/components/common/LoadingModal'

const CustomSearch = () => {
  // 검색어 상태
  const [query, setQuery] = useState('')

  // 시간 선택 상태
  const [selectedTime, setSelectedTime] = useState('5분')

  // 드롭다운 제어 상태
  const [showTimeDropdown, setShowTimeDropdown] = useState(false)
  const [showSearchDropdown, setShowSearchDropdown] = useState(false)

  // 검색 결과 상태
  const [searchResults, setSearchResults] = useState<any[]>([])

  // 드롭다운 내 키보드 선택 인덱스
  const [highlightedIndex, setHighlightedIndex] = useState(-1)

  // 선택된 항목 상태
  const [selectedItem, setSelectedItem] = useState<any>(null)

  // 로딩 상태
  const [isLoading, setIsLoading] = useState(false)

  // 페이지 이동 훅
  const navigate = useNavigate()

  // 검색 파라미터 저장 함수
  const { setCustomSearchParams } = useSearchParamsStore()

  // 시간 옵션 목록
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

  // 검색어가 변경될 때마다 결과 업데이트
  useEffect(() => {
    if (!query || query.trim() === '') {
      setSearchResults([])
      return
    }

    // 검색 요청
    const fetchResults = async () => {
      try {
        const results = await searchLocations(query)
        setSearchResults(results || []) // null/undefined 대신 빈 배열 사용
      } catch (error) {
        console.error('위치 검색 실패:', error)
        setSearchResults([]) // 오류 시 빈 배열로 초기화
      }
    }

    // 디바운스 처리
    const timer = setTimeout(fetchResults, 300)
    return () => clearTimeout(timer)
  }, [query])

  // 하이라이트된 인덱스가 변경될 때 입력창 업데이트
  useEffect(() => {
    if (
      searchResults &&
      searchResults.length > 0 &&
      highlightedIndex >= 0 &&
      highlightedIndex < searchResults.length
    ) {
      setQuery(searchResults[highlightedIndex].name)
    }
  }, [highlightedIndex, searchResults])

  // 검색 결과 중 특정 항목 선택 시 실행되는 함수
  const handleSelect = (item: any) => {
    if (!item) return // 항목이 유효하지 않으면 무시

    // 선택된 항목 저장
    setSelectedItem(item)

    // 검색창에 선택된 텍스트 반영
    setQuery(item.name)

    // 선택 즉시 검색 실행
    handleSearchWithLocation(
      item.name,
      selectedTime,
      item.latitude,
      item.longitude,
    )
  }

  // 검색 실행 함수 (위치 정보 포함)
  const handleSearchWithLocation = (
    query: string,
    time: string,
    lat?: number,
    lng?: number,
  ) => {
    // 검색 파라미터 설정
    setCustomSearchParams(query, time, lat, lng)

    // 로딩 시작
    setIsLoading(true)

    // 약간의 지연 후 페이지 이동 (로딩 모달이 보이게 하기 위해)
    setTimeout(() => {
      navigate('/explore?tab=match_search')

      // 잠시 후 로딩 상태 해제 (ExplorePage에서 자체적으로 로딩을 처리하기 때문)
      setTimeout(() => {
        setIsLoading(false)
      }, 500)
    }, 500)
  }

  // 키보드 이벤트 처리
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showSearchDropdown || !searchResults || searchResults.length === 0)
      return

    if (e.key === 'ArrowDown') {
      // 아래 화살표: 다음 항목 강조
      e.preventDefault()
      const newIndex =
        highlightedIndex >= searchResults.length - 1 ? 0 : highlightedIndex + 1
      setHighlightedIndex(newIndex)
    } else if (e.key === 'ArrowUp') {
      // 위 화살표: 이전 항목 강조
      e.preventDefault()
      const newIndex =
        highlightedIndex <= 0 ? searchResults.length - 1 : highlightedIndex - 1
      setHighlightedIndex(newIndex)
    } else if (e.key === 'Enter') {
      // 엔터: 선택된 항목 선택 또는 검색
      e.preventDefault()

      if (highlightedIndex >= 0 && highlightedIndex < searchResults.length) {
        // 강조된 항목이 있으면 해당 항목으로 검색
        handleSelect(searchResults[highlightedIndex])
      } else if (searchResults.length > 0) {
        // 강조된 항목이 없으면 첫 번째 항목으로 검색
        handleSelect(searchResults[0])
      } else {
        // 검색 결과가 없으면 입력된 쿼리로 검색
        handleSearchClick()
      }
    } else if (e.key === 'Escape') {
      // ESC: 드롭다운 닫기
      setShowSearchDropdown(false)
      setShowTimeDropdown(false)
    }
  }

  // 검색 버튼 클릭 핸들러
  const handleSearchClick = () => {
    if (!query || query.trim() === '') {
      return
    }

    // 선택된 항목이 있으면 해당 항목으로 검색
    if (selectedItem) {
      handleSearchWithLocation(
        selectedItem.name,
        selectedTime,
        selectedItem.latitude,
        selectedItem.longitude,
      )
      return
    }

    // 검색어와 일치하는 첫 번째 결과 찾기
    const exactMatch =
      searchResults &&
      searchResults.find(
        (item) => item.name.toLowerCase() === query.toLowerCase(),
      )

    if (exactMatch) {
      // 정확히 일치하는 항목 선택
      handleSelect(exactMatch)
    } else if (searchResults && searchResults.length > 0) {
      // 일치하는 항목 없으면 첫 번째 결과 선택
      handleSelect(searchResults[0])
    } else if (window.kakao && window.kakao.maps) {
      // 카카오맵 API로 좌표 검색 시도
      setIsLoading(true)

      const geocoder = new window.kakao.maps.services.Geocoder()
      geocoder.addressSearch(query, (result, status) => {
        if (status === window.kakao.maps.services.Status.OK) {
          const latitude = parseFloat(result[0].y)
          const longitude = parseFloat(result[0].x)

          // 맞춤 검색 파라미터 설정
          handleSearchWithLocation(query, selectedTime, latitude, longitude)
        } else {
          // 좌표 검색 실패 시
          setIsLoading(false)
          alert('주소를 찾을 수 없습니다. 다른 검색어를 입력해주세요.')
        }
      })
    }
  }

  return (
    <div className="flex flex-col justify-center items-center">
      {/* 로딩 모달 */}
      <LoadingModal isOpen={isLoading} message="맞춤 검색 중..." />

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
              // 검색어 변경 시 선택된 항목 초기화
              setSelectedItem(null)
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
            }}
            onKeyDown={handleKeyDown}
            className="flex-1 text-ssaeng-purple focus:outline-none placeholder:text-ssaeng-gray-2 placeholder:text-sm"
          />

          {/* 시간 선택 */}
          <div className="relative">
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault()
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
          <button
            type="button"
            onClick={handleSearchClick}
            className="text-ssaeng-purple"
          >
            <Search size={20} />
          </button>
        </div>

        {/* 전체 검색 결과 드롭다운 */}
        {showSearchDropdown && (
          <SearchDropdown
            query={query || ''} // null/undefined 방지
            onSelect={(name, lat, lng) => {
              handleSelect({
                name,
                latitude: lat,
                longitude: lng,
              })
            }}
            highlightedIndex={highlightedIndex}
          />
        )}
      </div>
    </div>
  )
}

export default CustomSearch
