import RecommendedSection from '@/components/MainPage/RecommendedSection/RecommendedSection'
import SearchSection from '@/components/MainPage/SearchSection/SearchSection'

const MainPage = () => {
  return (
    <div className="h-full px-10">
      <div className="flex flex-row justify-center">
        <SearchSection />
      </div>
      <div className="mt-8 -mx-10 bg-ssaeng-gray-3 px-10 py-8  rounded-t-3xl">
        <RecommendedSection />
      </div>
    </div>
  )
}

export default MainPage
