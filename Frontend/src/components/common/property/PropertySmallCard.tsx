import { Heart } from 'lucide-react'
import { useState } from 'react'
import clsx from 'clsx'
import { convertToPyeong } from '@/utils/areaUtils'
import {
  formatToKoreanCurrency,
  formatMaintenanceFee,
} from '@/utils/formatUtils'
import useSidebarStore from '@/store/sidebarStore'
import { useUserStore } from '@/store/userStore'
import { toggleLike } from '@/services/propertyService'

type Property = {
  id: number
  propertyType: string
  dealType: string
  price: number
  rentPrice: number
  maintenancePrice: number
  totalFloor: number
  floor: number
  area: number
  imageUrl?: string
  isRecommend?: boolean
  isInterest?: boolean
}

type Props = {
  property: Property
}

const PropertySmallCard = ({ property }: Props) => {
  const [isLiked, setIsLiked] = useState(property.isInterest ?? false)
  const [imageError, setImageError] = useState(false)
  const { selectedCard, setSelectedCard } = useSidebarStore()
  const { isLoggedIn } = useUserStore()
  const handleClick = () => {
    setSelectedCard(property.id) // 선택된 카드 ID 저장
  }

  const handleLikeClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!isLoggedIn) {
      console.log('로그인을 해야해요')
      return
    }
    const t = toggleLike(property.id)
    console.log(t)
    setIsLiked((prev) => !prev)
  }

  //   const isSelected = selectedCard === property.id

  return (
    <div
      className={`flex p-4 rounded-xl bg-white hover:bg-gray-50 transition`}
      onClick={handleClick}
      role="button"
      aria-hidden="true"
    >
      {/* 이미지 영역 */}
      <div className="relative w-32 h-24 bg-gray-200 rounded-lg overflow-hidden shrink-0">
        {/* 찜 아이콘 */}
        <button
          onClick={handleLikeClick}
          className="absolute top-1.5 right-1.5 z-10"
        >
          <Heart
            size={20}
            fill={isLiked ? '#f87171' : '#E5E5E5'}
            color={isLiked ? '#f87171' : '#E5E5E5'}
            style={{ opacity: isLiked ? 1 : 0.6 }}
            className={clsx('drop-shadow-sm', {
              'opacity-100': isLiked,
              'opacity-80': !isLiked,
            })}
          />
        </button>

        {/* 이미지 출력 */}
        <div className="relative w-32 h-24 bg-gray-200 rounded-lg overflow-hidden shrink-0 flex items-center justify-center">
          {property.imageUrl && !imageError ? (
            <img
              src={`${property.imageUrl}?w=800&h=600`}
              alt="매물 이미지"
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.onerror = null // onError 무한 호출 방지
                setImageError(true) // 에러 발생 시 상태 업데이트
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center image-placeholder">
              <span className="text-gray-500 text-sm">이미지 없음</span>
            </div>
          )}
        </div>
      </div>

      {/* 정보 영역 */}
      <div className="ml-4 flex flex-col justify-between py-1">
        <div className="text-xs text-gray-800">{property.propertyType}</div>

        <div className="font-bold text-base">
          {property.dealType === '전세' || property.dealType === '매매' ? (
            <>
              {property.dealType} {formatToKoreanCurrency(property.price)}
            </>
          ) : (
            <>
              월세 {formatToKoreanCurrency(property.price)} /{' '}
              {formatToKoreanCurrency(property.rentPrice)}
            </>
          )}
        </div>

        <div className="text-sm text-gray-600">
          관리비 {formatMaintenanceFee(property.maintenancePrice)}
        </div>

        <div className="text-xs text-gray-600">
          {property.floor}층 / {property.totalFloor}층 &nbsp;&nbsp;|&nbsp;&nbsp;
          {convertToPyeong(property.area)}평 ({property.area}㎡)
        </div>
      </div>
    </div>
  )
}

export default PropertySmallCard
