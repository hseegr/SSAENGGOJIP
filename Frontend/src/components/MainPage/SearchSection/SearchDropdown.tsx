import { Home, MapPin, Train } from 'lucide-react'

type SearchResult = {
  type: '역' | '동' | '면' | '건물'
  name: string
  desc?: string
}

type Props = {
  query: string
}

// 목업 데이터 (검색어에 따라 필터링될 대상)
const MOCK_RESULTS: SearchResult[] = [
  { type: '역', name: '판교역', desc: '신분당선' },
  { type: '동', name: '판교동', desc: '경기도 성남시 분당구 판교동' },
  { type: '면', name: '판교면', desc: '충청남도 서천군 판교면' },
  { type: '건물', name: '카카오', desc: '판교역로 629번길 55' },
  { type: '건물', name: '네이버', desc: '판교역로 1331번길 39' },
]

const SearchDropdown = ({ query }: Props) => {
  const filtered = MOCK_RESULTS.filter((item) => item.name.includes(query))

  if (!query || filtered.length === 0) return null

  return (
    <ul className="absolute w-96 left-0 mt-2 border-2 border-ssaeng-purple rounded-lg divide-y divide-ssaeng-gray-1 bg-white z-10">
      {filtered.map((item, idx) => (
        <li
          key={idx}
          className="flex top-full items-center justify-between px-3 py-3 hover:bg-ssaeng-gray-3 hover:rounded-lg cursor-pointer"
        >
          {/* 왼쪽: 아이콘 + 이름 */}
          <div className="flex items-center">
            <span className="mr-3">
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

          {/* 오른쪽: 상세 주소 */}
          {item.desc && (
            <div className="text-sm text-gray-400 whitespace-nowrap ml-4">
              {item.desc}
            </div>
          )}
        </li>
      ))}
    </ul>
  )
}

export default SearchDropdown
