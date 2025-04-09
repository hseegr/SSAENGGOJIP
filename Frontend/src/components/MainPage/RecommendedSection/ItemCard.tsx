import { toggleLike } from '@/services/propertyService'
import { useLikeStore } from '@/store/propertyStore'
import { Heart } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'react-toastify'

type Listing = {
  id: number
  name: string
  price: string
  area: number
  address: string
  floor: string
  latitude: number
  longitude: number
  mainImage: string | null
  dealType: string
  propertyType: string
}

type Props = {
  listing: Listing
}

const ItemCard = ({ listing }: Props) => {
  // 찜 상태 저장
  const likeIds = useLikeStore((s) => s.likedIds)
  const toggleLikeId = useLikeStore((s) => s.toggleLikeId)

  // 현재 매물의 좋아요 여부
  const isLiked = likeIds.includes(listing.id)

  // 하트 클릭 핸들러
  const handleLikeClick = async () => {
    try {
      // 1. 상태 먼저 토글 (낙관적 UI 반영)
      toggleLikeId(listing.id)
      await toggleLike(listing.id)
    } catch (err) {
      console.error('❌ 좋아요 요청 실패', err)
      toast.error('로그인 후 이용해 주세요!')
    }
  }

  return (
    // 카드 전체
    <div className="relative border bg-white border-ssaeng-gray-1 rounded-lg p-3 hover:border-gray-300 transition">
      {/* 이미지 */}
      <div className="relative w-full h-32 bg-gray-100 rounded mb-2 overflow-hidden">
        {/* 하트 */}
        <button
          onClick={handleLikeClick}
          className="absolute top-2 right-2 z-20"
        >
          <Heart
            size={24}
            fill={isLiked ? '#f87171' : '#E5E5E5'}
            color={isLiked ? '#f87171' : '#E5E5E5'}
            style={{ opacity: isLiked ? 1 : 0.6 }}
          />
        </button>

        {/* ✅ 이미지가 있을 때만 <img> 렌더링 */}
        {typeof listing.mainImage === 'string' &&
        listing.mainImage.trim() !== '' ? (
          <img
            src={listing.mainImage}
            alt="매물 이미지"
            className="w-full h-full object-cover"
            onError={(e) => {
              // 이미지 로딩 실패 시 fallback 텍스트로 교체
              e.currentTarget.style.display = 'none'
              const fallback = document.createElement('div')
              fallback.className =
                'absolute inset-0 flex items-center justify-center text-gray-400 text-sm'
              fallback.innerText = '이미지 준비중입니다'
              e.currentTarget.parentElement?.appendChild(fallback)
            }}
          />
        ) : (
          // ✅ 이미지가 아예 없는 경우: 텍스트로 대체
          <span className="text-gray-400 text-sm">이미지 준비중입니다</span>
        )}
      </div>

      {/* 매물 정보 */}
      <div className="text-sm text-gray-600">{listing.propertyType}</div>
      <div className="font-bold">
        {listing.dealType}&nbsp;
        {listing.price}
      </div>
      <div className="text-sm">{listing.floor}</div>
      <div className="text-xs text-gray-500">{listing.address}</div>
    </div>
  )
}

export default ItemCard
