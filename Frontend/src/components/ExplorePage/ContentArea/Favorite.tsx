import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useIsLoggedIn } from '@/store/userStore'
import useSidebarStore from '@/store/sidebarStore'
import mockProperties from '@/mocks/mockProperty'
import PropertySmallCard from '@/components/common/property/PropertySmallCard'
import { toast } from 'react-toastify'

const Favorites: React.FC = () => {
  const isLoggedIn = useIsLoggedIn()
  const navigate = useNavigate()
  const [properties, setProperties] = useState<typeof mockProperties>([])
  const { setSelectedCard } = useSidebarStore()

  useEffect(() => {
    if (isLoggedIn) {
      setProperties(mockProperties)
    }
  }, [isLoggedIn])

  if (!isLoggedIn) {
    return (
      <div className="flex flex-col justify-center items-center text-center">
        <p className="text-ssaeng-purple text-sm font-semibold mt-1 mb-2">
          관심매물을 확인하고, 비교하고, 알림 설정까지!
        </p>
        <p className="text-ssaeng-black text-lg mb-8">
          로그인을 하고 관심 매물을 등록해보세요!
        </p>
        <button
          onClick={() => navigate('/account/login')}
          className="px-20 py-2 bg-ssaeng-purple text-white rounded-lg shadow hover:bg-ssaeng-purple/90"
        >
          로그인 하기
        </button>
      </div>
    )
  }

  const handleCompareClick = () => {
    if (properties.length === 0) {
      toast.warning('관심 매물을 등록해야 비교 기능을 이용할 수 있어요!')
      return
    }

    if (properties.length < 2) {
      toast.info('매물을 2개 이상 등록해야 매물 비교하기를 이용할 수 있어요')
      return
    }

    navigate('/mypage?tab=favorites')
  }

  return (
    <div className="flex relative h-full">
      {/* 매물 목록 */}
      <div className="relative flex flex-col w-[400px] overflow-y-auto pb-20">
        {properties.length > 0 ? (
          properties.map((property) => (
            <div
              key={property.id}
              onClick={() => setSelectedCard(property.id)}
              className="cursor-pointer"
            >
              <PropertySmallCard property={property} />
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-md mt-2 ml-4">
            관심 매물이 없습니다. 관심 매물을 등록해주세요!
          </p>
        )}

        {/* 비교하기 버튼 */}
        <div className="fixed bottom-3 left-[72px] w-[400px] px-6 z-50">
          <button
            onClick={handleCompareClick}
            className="w-full h-[44px] bg-ssaeng-purple text-white text-md rounded-md shadow hover:bg-indigo-500 hover:shadow-lg hover:scale-[1.02] transition-all"
          >
            매물 비교하기
          </button>
        </div>
      </div>
    </div>
  )
}

export default Favorites