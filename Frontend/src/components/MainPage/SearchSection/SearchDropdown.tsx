import { Home, MapPin, Train } from 'lucide-react'
import { useEffect, useState } from 'react'
import { LocationSearchResult, searchLocations } from '@/services/searchService'

type Props = {
  query: string
  onSelect: (item: any) => void
  highlightedIndex: number
}

// type SearchResult = {
//   type: '역' | '동' | '면' | '건물'
//   name: string
//   desc?: string
// }

// 목업 데이터 (검색어에 따라 필터링될 대상)
// export const MOCK_RESULTS: SearchResult[] = [
//   { type: '역', name: '판교역', desc: '신분당선' },
//   { type: '동', name: '판교동', desc: '경기도 성남시 분당구 판교동' },
//   { type: '면', name: '판교면', desc: '충청남도 서천군 판교면' },
//   { type: '건물', name: '카카오', desc: '판교역로 629번길 55' },
//   { type: '건물', name: '네이버', desc: '판교역로 1331번길 39' },
// ]

const SearchDropdown = ({ query, onSelect, highlightedIndex }: Props) => {
  // 검색 결과 상태
  const [results, setResults] = useState<LocationSearchResult[]>([])
  // 로딩 상태
  const [loading, setLoading] = useState(false)

  // 검색어 변경 시 API 호출
  useEffect(() => {
    // 검색어가 2글자 미만이면 결과 초기화
    if (!query || query.length < 2) {
      setResults([])
      return
    }

    // 검색 실행 함수
    const fetchResults = async () => {
      setLoading(true)
      try {
        // 카카오 API로 위치 검색
        const data = await searchLocations(query)
        setResults(data)
      } catch (error) {
        console.error('검색 결과 가져오기 실패:', error)
        setResults([])
      } finally {
        setLoading(false)
      }
    }

    // 디바운스 적용 (300ms 후 검색 실행)
    const debounceTimer = setTimeout(fetchResults, 300)

    // 컴포넌트 언마운트 시 타이머 정리
    return () => clearTimeout(debounceTimer)
  }, [query])

  // 검색어가 없거나 결과가 없으면 드롭다운 표시하지 않음
  if (!query || query.length < 2) return null
  if (results.length === 0 && !loading) return null

  return (
    <ul className="absolute w-96 left-0 mt-2 border-2 border-ssaeng-purple rounded-lg divide-y divide-ssaeng-gray-1 bg-white z-10 max-h-[300px] overflow-y-auto">
      {/* 로딩 중일 때 표시 */}
      {loading ? (
        <li className="p-3 text-gray-500 text-center">검색 중...</li>
      ) : (
        // 검색 결과 리스트
        results.map((item, idx) => (
          <li
            key={`${item.type}-${item.name}-${idx}`}
            onClick={() => onSelect(item)}
            className={`
              flex items-center justify-between px-3 py-3 cursor-pointer
              ${highlightedIndex === idx ? 'bg-ssaeng-gray-3 rounded-lg' : 'hover:bg-ssaeng-gray-3 hover:rounded-lg'}
            `}
          >
            {/* 왼쪽: 아이콘 + 이름 */}
            <div className="flex items-center">
              <span className="mr-3">
                {/* 장소 유형에 따른 아이콘 */}
                {item.type === '역' && (
                  <Train size={20} className="text-ssaeng-purple" />
                )}
                {(item.type === '동' || item.type === '면') && (
                  <MapPin size={20} className="text-ssaeng-purple" />
                )}
                {item.type === '건물' && (
                  <Home size={20} className="text-ssaeng-purple" />
                )}
              </span>
              <div className="font-medium text-gray-700">{item.name}</div>
            </div>

            {/* 오른쪽: 상세 설명 */}
            {item.desc && (
              <div className="text-sm text-gray-400 whitespace-nowrap ml-4 truncate max-w-[150px]">
                {item.desc}
              </div>
            )}
          </li>
        ))
      )}
    </ul>
  )
}

export default SearchDropdown
