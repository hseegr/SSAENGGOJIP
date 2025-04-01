import React, { useState } from 'react'
import { formatPrice } from '@/utils/formPrice'
import useSidebarStore from '@/store/sidebar'
import { Heart } from 'lucide-react' // 💡 lucide-react에서 하트 아이콘 import

interface CardProps {
  id: number
  title: string
  propertyType: string
  dealType: string
  totalFloor: number
  floor: number
  area: number
  price: number
  managementFee: number
  details?: string
  imageUrl: string
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

  // 💗 좋아요 상태 저장
  const [isLiked, setIsLiked] = useState(false)

  // 카드 클릭 핸들러
  const handleClick = () => {
    setSelectedCard(id) // 선택된 카드 ID 저장
  }

  // 하트 클릭 핸들러
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
    <button
      className={`flex overflow-hidden cursor-pointer ${
        isSelected
          ? 'bg-[rgba(175,175,255,0.40)]'
          : 'hover:bg-gray-50 hover:rounded-lg'
      }`}
      onClick={handleClick}
    >
      {/* 이미지 영역 */}
      <div className="h-36 w-48 relative">
        {imageUrl ? (
          // ✅ 이미지가 존재할 경우: 실제 이미지 렌더링
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover rounded-lg p-2"
          />
        ) : (
          // 🚫 이미지가 없을 경우: 회색 배경과 안내 문구
          <div className="w-full h-full bg-gray-100 rounded-lg p-2 flex items-center justify-center">
            <span className="text-gray-500 text-sm">이미지 없음</span>
          </div>
        )}

        {/* ❤️ 하트 버튼 영역 */}
        <button
          onClick={(e) => {
            e.stopPropagation() // 부모 클릭 방지
            toggleLike() // 좋아요 상태 토글
          }}
          className="absolute top-2 right-2 z-10"
        >
          <Heart
            size={24}
            fill={isLiked ? '#f87171' : '#E5E5E5'} // 좋아요 여부에 따라 채움 색상 변경
            color={isLiked ? '#f87171' : '#E5E5E5'} // 테두리 색상도 동일하게
            style={{ opacity: isLiked ? 1 : 0.6 }} // 비활성화 시 투명도 낮게
          />
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
          <p className="text-sm mt-2">
            {floor}층 / {totalFloor}층 | {area}평
          </p>
        </div>
      </div>
    </button>
  )
}

export default Card
