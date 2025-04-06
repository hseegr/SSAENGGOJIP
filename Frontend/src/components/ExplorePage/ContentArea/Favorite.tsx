import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useIsLoggedIn } from '@/store/userStore'
import mockProperties from '@/mocks/mockProperty'
import Card from '../SearchCard' // 추후 공통 컴포넌트로 대체 예정

const Favorites: React.FC = () => {
  const isLoggedIn = useIsLoggedIn()
  const navigate = useNavigate()
  const [properties, setProperties] = useState<typeof mockProperties>([])

  useEffect(() => {
    if (isLoggedIn) {
      setProperties(mockProperties)
    }
  }, [isLoggedIn])

  if (!isLoggedIn) {
    return (
      <div className="flex flex-col justify-center items-center text-center mt-16 px-6">
        <p className="text-ssaeng-purple text-sm font-semibold mb-2">
          관심매물을 확인하고, 비교하고, 알림 설정까지!
        </p>
        <p className="text-gray-500 text-sm mb-4">
          로그인을 하고 관심 매물을 등록해보세요!
        </p>
        <button
          onClick={() => navigate('/account/login')}
          className="px-5 py-2 bg-ssaeng-purple text-white rounded-md shadow hover:bg-ssaeng-purple/90"
        >
          로그인 하기
        </button>
      </div>
    )
  }

  return (
    <div className="relative pb-16">
      <div className="flex flex-col gap-4 px-3">

      </div>

      <div className="fixed bottom-3 w-[calc(400px-1.5rem*2)] mx-3">
        <button
          onClick={() => navigate('/mypage?tab=favorites')}
          className="w-full h-[40px] bg-ssaeng-purple text-white text-md rounded-md shadow hover:bg-ssaeng-purple/90"
        >
          매물 비교하기
        </button>
      </div>
    </div>
  )
}

export default Favorites