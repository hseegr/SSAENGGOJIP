import React from 'react'

const AdditionalFilters: React.FC<{
  filters: string[]
  selectedFilters: string[]
  toggleFilterSelection: (filter: string) => void
}> = ({ filters, selectedFilters, toggleFilterSelection }) => {
  return (
    <div className="flex flex-col items-center">
      {/* 제목 */}
      <h2 className="text-lg font-bold mb-6">추가 필터</h2>

      {/* 필터 버튼 목록 */}
      <div className="grid grid-cols-3 gap-4">
        {filters.map((filter) => (
          <button
            key={filter}
            className={`px-4 py-2 border rounded-full text-sm font-medium ${
              selectedFilters.includes(filter)
                ? 'bg-purple-600 text-white border-purple-600'
                : 'bg-white text-gray-500 border-gray-300'
            }`}
            onClick={() => toggleFilterSelection(filter)}
          >
            {filter}
          </button>
        ))}
      </div>
    </div>
  )
}

export default AdditionalFilters
