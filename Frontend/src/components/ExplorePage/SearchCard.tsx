import React from 'react'

interface CardProps {
  title: string
  price: number
  managementFee: number
  details: string
  imageUrl: string // 이미지 링크 추가
}

const Card: React.FC<CardProps> = ({
  title,
  price,
  managementFee,
  details,
  imageUrl,
}) => {
  return (
    <div className="w-80 border rounded-lg shadow-md overflow-hidden">
      <div className="h-40 relative">
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-full object-cover"
        />
        <span className="absolute top-2 right-2 text-red-500 text-xl">❤️</span>
      </div>
      <div className="p-4">
        <h3 className="text-lg font-bold">{title}</h3>
        <p className="text-md text-gray-700">{price.toLocaleString()}원</p>
        <p className="text-sm text-gray-500">
          관리비 {managementFee.toLocaleString()}원
        </p>
        <p className="text-sm text-gray-500">{details}</p>
      </div>
    </div>
  )
}

export default Card
