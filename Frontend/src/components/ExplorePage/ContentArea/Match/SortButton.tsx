import { useState, useEffect } from 'react'
import useMatchInfoStore from '@/store/matchInfoStore'

const SortButton = ({ onSortChange }) => {
  const { matchInfos } = useMatchInfoStore()
  const [sortOption, setSortOption] = useState('1')

  useEffect(() => {
    // 기본값 설정 (첫 번째 matchInfo가 있는 경우)
    if (matchInfos && matchInfos.length > 0) {
      setSortOption(matchInfos[0].name)
    }
  }, [matchInfos])

  const handleSortChange = (option) => {
    setSortOption(option)
    onSortChange(option)
  }

  return (
    <div className="flex items-center">
      <span className="mr-2">정렬:</span>
      <select
        value={sortOption}
        onChange={(e) => handleSortChange(e.target.value)}
        className="border border-gray-300 rounded-md px-2 py-1"
      >
        <option value="price">가격순</option>
        {matchInfos && matchInfos.length > 0 ? (
          matchInfos.map((info, index) => (
            <option key={index} value={index}>
              {info.name}
            </option>
          ))
        ) : (
          <>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="price">가격순</option>
          </>
        )}
      </select>
    </div>
  )
}

export default SortButton
