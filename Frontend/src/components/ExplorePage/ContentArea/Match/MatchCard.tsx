import React, { useState } from 'react'
import { formatPrice } from '@/utils/formPrice'
import useSidebarStore from '@/store/sidebar'
import { Heart } from 'lucide-react'
import useMatchInfoStore from '@/store/matchInfoStore'

interface CardProps {
  id: number
  title?: string // 제목은 선택적 필드로 설정
  propertyType: string
  dealType: string
  totalFloor: number
  floor: number
  area: number
  price: number
  rentPrice?: number // 월세 가격 (선택적)
  managementFee?: number // 관리비 (선택적)
  address?: string // 주소 (선택적)
  latitude?: number // 위도 (선택적)
  longitude?: number // 경도 (선택적)
  isRecommend?: boolean // 추천 여부 (선택적)
  isInterest?: boolean // 관심 여부 (선택적)
  imageUrl?: string // 이미지 URL (선택적)
  transportTimes?: number[]
}

const MatchCard: React.FC<CardProps> = ({
  id,
  title,
  propertyType,
  dealType,
  totalFloor,
  floor,
  area,
  price,
  rentPrice,
  managementFee,
  address,
  isRecommend,
  isInterest,
  imageUrl,
  transportTimes,
}) => {
  const { selectedCard, setSelectedCard } = useSidebarStore()

  const [isLiked, setIsLiked] = useState(isInterest ?? false) // 초기 상태는 API에서 제공된 관심 여부
  // 컴포넌트 내부에서
  const { matchInfos } = useMatchInfoStore()
  const handleClick = () => {
    setSelectedCard(id) // 선택된 카드 ID 저장
  }

  const toggleLike = () => {
    setIsLiked((prev) => !prev)
    if (!isLiked) {
      console.log(`매물 ${id}가 관심매물로 등록되었습니다.`)
    } else {
      console.log(`매물 ${id}의 관심매물 등록이 취소되었습니다.`)
    }
  }

  const isSelected = selectedCard === id

  return (
    <div
      className={`flex overflow-hidden border cursor-pointer ${
        isSelected
          ? 'bg-ssaeng-gray-3 rounded-lg border-ssaeng-gray-2'
          : 'hover:bg-gray-50 hover:rounded-lg border-transparent'
      }`}
      onClick={handleClick}
      role="button"
      aria-hidden="true"
    >
      {/* 이미지 영역 */}
      <div className="h-36 w-48 relative">
        {/* 추천 태그 */}
        {isRecommend && (
          <div className="absolute top-2 left-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded">
            추천
          </div>
        )}
        {imageUrl ? (
          <img
            src={`${imageUrl}?w=800&h=600`}
            alt={title ?? '이미지'}
            className="w-full h-full object-cover rounded-lg p-2"
          />
        ) : (
          <div className="w-full h-full bg-gray-100 rounded-lg p-2 flex items-center justify-center">
            <span className="text-gray-500 text-sm">이미지 없음</span>
          </div>
        )}

        {/* ❤️ 하트 버튼 영역 */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            toggleLike()
          }}
          className="absolute top-2 right-2 z-10"
        >
          <Heart
            size={24}
            fill={isLiked ? '#f87171' : '#E5E5E5'}
            color={isLiked ? '#f87171' : '#E5E5E5'}
            style={{ opacity: isLiked ? 1 : 0.6 }}
          />
        </button>
      </div>

      {/* 텍스트 영역 */}
      <div className="p-4 w-1/2">
        <div className="flex items-center gap-2 text-sm">
          {(transportTimes ?? []).length > 0 && (
            <>
              <span className="text-green-500 font-medium">
                {matchInfos?.[0]?.name
                  ? `${matchInfos[0].name.slice(0, 3)}${matchInfos[0].name.length > 3 ? '...' : ''}`
                  : ''}
              </span>
              <span className="bg-green-100 px-2 py-1 rounded-md text-green-700 font-medium">
                {transportTimes?.[0]}분
              </span>
            </>
          )}

          {(transportTimes ?? []).length > 1 && (
            <>
              <span className="text-green-500 font-medium">
                {matchInfos?.[1]?.name
                  ? `${matchInfos[1].name.slice(0, 3)}${matchInfos[1].name.length > 3 ? '...' : ''}`
                  : ''}
              </span>
              <span className="bg-green-100 px-2 py-1 rounded-md text-green-700 font-medium">
                {transportTimes?.[1]}분
              </span>
            </>
          )}
        </div>
        <p className="flex text-sm">{propertyType}</p>
        <div className="flex">
          <p className="text-base font-bold text-gray-700 pr-2">{dealType}</p>
          <p className="text-base font-bold text-gray-700">
            {formatPrice(price)}
          </p>
        </div>
        {rentPrice && (
          <p className="text-sm text-gray-500">
            월세: {formatPrice(rentPrice)}
          </p>
        )}
        <p className="flex text-sm text-gray-500">
          관리비{' '}
          {managementFee ? `${managementFee.toLocaleString()}원` : '없음'}
        </p>
        <div className="flex">
          <p className="text-xs mt-2">
            {floor}층 / {totalFloor}층 | {Math.floor(area / 3.3058)}평
          </p>
        </div>
        {address && (
          <p className="text-xs text-gray-500 mt-1">주소: {address}</p>
        )}
      </div>
    </div>
  )
}

export default MatchCard
