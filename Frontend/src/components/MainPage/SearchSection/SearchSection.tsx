import { useState } from 'react'
import SearchTab from './SearchTab'
import GeneralSearch from './GeneralSearch'
import CustomSearch from './CustomSearch'

const SearchSection = () => {
  const [activeTab, setActiveTab] = useState<'general' | 'custom'>('general')

  return (
    <div className="w-full flex flex-col gap-6 pt-10">
      <SearchTab activeTab={activeTab} setActiveTab={setActiveTab} />
      {activeTab === 'general' ? <GeneralSearch /> : <CustomSearch />}
    </div>
  )
}

export default SearchSection
