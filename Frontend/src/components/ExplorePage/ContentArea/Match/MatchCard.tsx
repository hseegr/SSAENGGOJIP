import React, { useState } from 'react'
import { formatPrice } from '@/utils/formPrice'
import useSidebarStore from '@/store/sidebarStore'
import { Heart } from 'lucide-react'
import useMatchInfoStore from '@/store/matchInfoStore'
import useMatchSearchResultStore from '@/store/searchResultStore'
import { convertToPyeong } from '@/utils/areaUtils'
import {
  formatToKoreanCurrency,
  formatMaintenanceFee,
} from '@/utils/formatUtils'
import clsx from 'clsx'
import { toggleLike } from '@/services/propertyService'

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
  latitude,
  longitude,
}) => {
  const { selectedCard, setSelectedCard } = useSidebarStore()
  const { transportModes, setMatchTargetAddress } = useMatchSearchResultStore()
  const [isLiked, setIsLiked] = useState(isInterest ?? false)
  const [imageError, setImageError] = useState(false)

  // 컴포넌트 내부에서
  const { matchInfos } = useMatchInfoStore()

  const handleClick = () => {
    console.log(
      'handleClick - Latitude:',
      latitude,
      'Longitude:',
      longitude,
      '교통수단 타입',
      transportModes,
    )
    setSelectedCard(id)
    setMatchTargetAddress({
      latitude: latitude,
      longitude: longitude,
      transportationType: transportModes[0],
    })
  }

  const handleClickLike = (e: React.MouseEvent) => {
    e.stopPropagation()
    const t = toggleLike(id)
    console.log(t)
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
      className={`flex p-4 rounded-xl ${
        isSelected ? 'bg-ssaeng-gray-3' : 'bg-white hover:bg-gray-50'
      } transition`}
      onClick={handleClick}
      role="button"
      aria-hidden="true"
    >
      {/* 이미지 영역 */}
      <div className="relative w-32 h-24 bg-gray-200 rounded-lg overflow-hidden shrink-0">
        {/* 추천 태그 */}
        {isRecommend && (
          <div className="absolute top-1 left-1 bg-green-500 text-white text-xs font-bold px-2 py-0.5 rounded z-10">
            추천
          </div>
        )}

        {/* 찜 아이콘 */}
        <button
          onClick={handleClickLike}
          className="absolute top-1.5 right-1.5 z-10"
        >
          <Heart
            size={20}
            fill={isLiked ? '#f87171' : '#E5E5E5'}
            color={isLiked ? '#f87171' : '#E5E5E5'}
            className={clsx('drop-shadow-sm', {
              'opacity-100': isLiked,
              'opacity-80': !isLiked,
            })}
          />
        </button>

        {/* 이미지 출력 */}
        <div className="relative w-32 h-24 bg-gray-200 rounded-lg overflow-hidden shrink-0 flex items-center justify-center">
          {imageUrl && !imageError ? (
            <img
              src={`${imageUrl}?w=800&h=600`}
              alt={title ?? '이미지'}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.onerror = null // onError 무한 호출 방지
                setImageError(true) // 에러 발생 시 상태 업데이트
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-gray-500 text-sm">이미지 없음</span>
            </div>
          )}
        </div>
      </div>

      {/* 정보 영역 */}
      <div className="ml-4 flex flex-col justify-between py-1">
        {/* 이동 시간 정보 */}
        <div className="flex items-center gap-2 text-xs mb-1">
          {(transportTimes ?? []).length > 0 && (
            <>
              <span className="text-green-500 font-medium">
                {matchInfos?.[0]?.name
                  ? `${matchInfos[0].name.slice(0, 3)}${matchInfos[0].name.length > 3 ? '...' : ''}`
                  : ''}
              </span>
              <span className="bg-green-100 px-2 py-0.5 rounded-md text-green-700 font-medium">
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
              <span className="bg-green-100 px-2 py-0.5 rounded-md text-green-700 font-medium">
                {transportTimes?.[1]}분
              </span>
            </>
          )}
        </div>

        <div className="text-xs text-gray-800">{propertyType}</div>

        <div className="font-bold text-base">
          {dealType === '전세' || dealType === '매매' ? (
            <>
              {dealType} {formatToKoreanCurrency(price)}
            </>
          ) : (
            <>
              월세 {formatToKoreanCurrency(price)} /{' '}
              {formatToKoreanCurrency(rentPrice || 0)}
            </>
          )}
        </div>

        <div className="text-sm text-gray-600">
          관리비 {formatMaintenanceFee(managementFee || 0)}
        </div>

        <div className="text-xs text-gray-600">
          {floor}층 / {totalFloor}층 &nbsp;&nbsp;|&nbsp;&nbsp;
          {convertToPyeong(area)}평 ({area}㎡)
        </div>

        {address && (
          <p className="text-xs text-gray-500 mt-1 truncate max-w-[200px]">
            {address}
          </p>
        )}
      </div>
    </div>
  )
}

export default MatchCard
