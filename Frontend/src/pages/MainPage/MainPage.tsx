import RecommendedSection from '@/components/MainPage/RecommendedSection/RecommendedSection'
import SearchSection from '@/components/MainPage/SearchSection/SearchSection'
import { fetchLikedProperties } from '@/services/propertyService'
import { useLikeStore } from '@/store/propertyStore'
import { useEffect } from 'react'

const MainPage = () => {
  const setLikedIds = useLikeStore((state) => state.setLikedIds)

  useEffect(() => {
    const fetchLikes = async () => {
      try {
        const response = await fetchLikedProperties()
        const ids = response.map((item) => item.id)
        setLikedIds(ids)
      } catch (err) {
        console.error('❌ 관심 매물 불러오기 실패:', err)
      }
    }

    fetchLikes()
  }, [])

  return (
    <div className="h-full px-10">
      <div className="flex flex-row justify-center">
        <SearchSection />
      </div>
      <div className="mt-8 -mx-10 bg-ssaeng-gray-3 px-10 py-8 rounded-t-3xl min-h-[440px]">
        <RecommendedSection />
      </div>
    </div>
  )
}

export default MainPage
