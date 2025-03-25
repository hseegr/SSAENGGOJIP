type Props = {
  activeTab: 'general' | 'custom'
  setActiveTab: (tab: 'general' | 'custom') => void
}

const SearchTab = ({ activeTab, setActiveTab }: Props) => {
  return (
    <div className="flex justify-center items-center text-base font-semibold border-b border-ssaeng-gray-2 w-52 mx-auto">
      {/* 일반 검색 */}
      <button
        className={`flex-1 pb-1 flex justify-center ${activeTab === 'general' ? 'text-ssaeng-purple border-b-4 border-ssaeng-purple w-28' : 'text-ssaeng-gray-2'}`}
        onClick={() => setActiveTab('general')}
      >
        일반 검색
      </button>

      {/* 맞춤 검색 */}
      <button
        className={`flex-1 pb-1 flex justify-center ${activeTab === 'custom' ? 'text-ssaeng-purple border-b-4 border-ssaeng-purple w-28' : 'text-ssaeng-gray-2'}`}
        onClick={() => setActiveTab('custom')}
      >
        맞춤 검색
      </button>
    </div>
  )
}

export default SearchTab
