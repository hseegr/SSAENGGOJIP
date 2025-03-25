import { Heart } from 'lucide-react'
import { useState } from 'react'

type Listing = {
  id: number
  type: string
  price: string
  floor: string
  address: string
  station: string
  imageUrl?: string
}

type Props = {
  listing: Listing
}

const ItemCard = ({ listing }: Props) => {
  // 찜 상태 저장
  const [isLiked, setIsLiked] = useState(false)

  // 하트 누르면 상태를 반대로 바꿔주는 함수
  const toggleLike = () => {
    setIsLiked((prev) => !prev)
  }

  return (
    // 카드 전체
    <div className="relative border bg-white border-ssaeng-gray-1 rounded-lg p-3 hover:border-gray-300 transition">
      {/* 이미지 */}
      <div className="relative w-full h-32 bg-gray-100 rounded mb-2 overflow-hidden">
        {/* 하트 */}
        <button onClick={toggleLike} className="absolute top-2 right-2 z-9">
          <Heart
            size={24}
            fill={isLiked ? '#f87171' : '#E5E5E5'}
            color={isLiked ? '#f87171' : '#E5E5E5'}
            style={{ opacity: isLiked ? 1 : 0.6 }}
          />
        </button>

        {/* 이미지 */}
        {listing.imageUrl && (
          <img
            src={listing.imageUrl}
            alt="매물 이미지"
            className="w-full h-full object-cover"
          />
        )}
      </div>

      {/* 매물 정보 */}
      <div className="text-sm text-gray-600">{listing.type}</div>
      <div className="font-bold">{listing.price}</div>
      <div className="text-sm">{listing.floor}</div>
      <div className="text-xs text-gray-500">{listing.address}</div>
    </div>
  )
}

export default ItemCard
