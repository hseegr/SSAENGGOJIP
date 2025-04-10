import { useState, useEffect } from 'react'
import useMatchInfoStore from '@/store/matchInfoStore'

const SortButton = ({ onSortChange }) => {
  const { matchInfos } = useMatchInfoStore()
  const [sortOption, setSortOption] = useState('1')

  useEffect(() => {
    if (matchInfos && matchInfos.length > 0) {
      setSortOption(matchInfos[0].name)
    }
  }, [matchInfos])

  const handleSortChange = (option) => {
    setSortOption(option)
    onSortChange(option)
  }

  return (
    <div className="flex items-center justify-center">
      <select
        value={sortOption}
        onChange={(e) => handleSortChange(e.target.value)}
        className="w-30 h-9 px-4 text-ssaeng-purple text-md rounded-lg bg-ssaeng-purple-light hover:border-ssaeng-purple-light focus:outline-none"
      >
        <option value="price">가격순</option>
        {matchInfos && matchInfos.length > 0 ? (
          matchInfos.map((info, index) => (
            <option key={index} value={index}>
              {info.name} 시간순
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
