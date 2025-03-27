import { useState } from 'react'
import SearchTab from './SearchTab'
import GeneralSearch from './GeneralSearch'
import CustomSearch from './CustomSearch'

const SearchSection = () => {
  // 어떤 탭이 활성화되어 있는지 상태로 관리 ('general' | 'custom')
  const [activeTab, setActiveTab] = useState<'general' | 'custom'>('general')

  return (
    <div className="w-full flex flex-col gap-6 pt-10">
      <SearchTab activeTab={activeTab} setActiveTab={setActiveTab} />
      {activeTab === 'general' ? <GeneralSearch /> : <CustomSearch />}
    </div>
  )
}

export default SearchSection
