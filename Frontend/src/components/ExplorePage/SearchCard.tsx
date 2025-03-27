import React from 'react'
import { formatPrice } from '@/utils/formPrice';

interface CardProps {
  title: string
  propertyType: string
  dealType: string
  totalFloor: number
  floor: number
  area: number
  price: number
  managementFee: number
  details: string
  imageUrl: string // 이미지 링크 추가
}

const Card: React.FC<CardProps> = ({
  title,
  propertyType,
  dealType,
  totalFloor,
  floor,
  area,
  price,
  managementFee,
  // details,
  imageUrl,
}) => {
  return (
<div className="flex rounded-lg overflow-hidden">
  {/* 이미지 영역 */}
  <div className="h-40 w-1/2 relative">
    <img
      src={imageUrl}
      alt={title}
      className="w-full h-full object-cover"
    />
    <span className="absolute top-2 right-2 text-red-500 text-xl">❤️</span>
  </div>
  
  {/* 텍스트 영역 */}
  <div className="p-4 w-1/2">
    <p className="text-md">{propertyType}</p>
    <div className='flex'>
    <p className="text-lg font-bold text-gray-700 pr-2">{dealType}</p>
    <p className="text-lg font-bold text-gray-700">{formatPrice(price)}</p>
    </div>
    <p className="text-sm text-gray-500">
      관리비 {managementFee.toLocaleString()}원
    </p>
    <div className="flex">
      <p>{floor}층 / {totalFloor}층 | {area}평</p>
    </div>
  </div>
</div>
  )
}

export default Card
