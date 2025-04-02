import React, { useState } from 'react'
import { formatPrice } from '@/utils/formPrice'
import useSidebarStore from '@/store/sidebar'

interface CardProps {
  id: number // 카드 ID 추가
  title: string
  propertyType: string
  dealType: string
  totalFloor: number
  floor: number
  area: number
  price: number
  managementFee: number
  details?: string
  imageUrl: string // 이미지 링크 추가
}

const Card: React.FC<CardProps> = ({
  id,
  title,
  propertyType,
  dealType,
  totalFloor,
  floor,
  area,
  price,
  managementFee,
  imageUrl,
}) => {
  const { selectedCard, setSelectedCard } = useSidebarStore()

  // 좋아요 상태 관리
  const [isLiked, setIsLiked] = useState(false)

  const handleClick = () => {
    // 카드 클릭 시 상태 업데이트
    setSelectedCard(id)
  }

  const toggleLike = () => {
    // 좋아요 상태 토글
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
      className={`flex overflow-hidden cursor-pointer ${
        isSelected ? 'bg-[rgba(175,175,255,0.40)]' : 'hover:bg-gray-100'
      }`}
      onClick={handleClick}
      role="button"
      aria-hidden="true" // 접근성 트리에서 제외
    >
      {/* 이미지 영역 */}
      <div className="h-40 w-1/2 relative">
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-full object-cover rounded-lg p-2"
        />

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation() // 부모 버튼 클릭 이벤트 방지
            toggleLike()
          }}
          className={`absolute top-1 right-1 text-xl ${
            isLiked ? 'text-red-500' : 'text-gray-400'
          }`}
        >
          {isLiked ? '❤️' : '🤍'}
        </button>
      </div>

      {/* 텍스트 영역 */}
      <div className="p-4 w-1/2">
        <p className="flex text-md">{propertyType}</p>
        <div className="flex">
          <p className="text-lg font-bold text-gray-700 pr-2">{dealType}</p>
          <p className="text-lg font-bold text-gray-700">
            {formatPrice(price)}
          </p>
        </div>
        <p className="flex text-sm text-gray-500">
          관리비{' '}
          {managementFee ? `${managementFee.toLocaleString()}원` : '없음'}
        </p>
        <div className="flex">
          <p>
            {floor}층 / {totalFloor}층 | {area}평
          </p>
        </div>
      </div>
    </div>
  )
}

export default Card
