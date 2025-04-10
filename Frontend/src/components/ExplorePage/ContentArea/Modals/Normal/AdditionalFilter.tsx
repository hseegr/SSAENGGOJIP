import React from 'react'

const AdditionalFilters: React.FC<{
  filters: string[]
  selectedFilters: string[]
  toggleFilterSelection: (filter: string) => void
}> = ({ filters, selectedFilters, toggleFilterSelection }) => {
  return (
    <div className="flex flex-col items-center">
      {/* 필터 버튼 목록 */}
      <div className="grid grid-cols-3 gap-x-3 gap-y-6 justify-items-center">
        {filters.map((filter) => {
          const selected = selectedFilters.includes(filter)
          return (
            <button
              key={filter}
              className={`w-24 py-2 text-sm rounded-full border transition 
                ${selected
                  ? 'bg-ssaeng-purple-light text-ssaeng-purple border-ssaeng-purple'
                  : 'bg-white text-gray-500 border-gray-300 hover:bg-gray-100'
                }`}
              onClick={() => toggleFilterSelection(filter)}
            >
              {filter}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default AdditionalFilters