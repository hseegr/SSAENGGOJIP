import RecommendedSection from '@/components/MainPage/RecommendedSection/RecommendedSection'
import SearchSection from '@/components/MainPage/SearchSection/SearchSection'

const MainPage = () => {
  return (
    <div>
      <div className="flex flex-row justify-center">
        <SearchSection />
      </div>
      <div>
        <RecommendedSection />
      </div>
    </div>
  )
}

export default MainPage
