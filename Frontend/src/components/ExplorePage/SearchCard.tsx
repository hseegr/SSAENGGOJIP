import React from 'react'
import { formatPrice } from '@/utils/formPrice';
import useSidebarStore from '@/store/sidebar';
interface CardProps {
  id: number; // 카드 ID 추가
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
  id,
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

  const { selectedCard, setSelectedCard } = useSidebarStore();

  const handleClick = () => {
    // 카드 클릭 시 상태 업데이트
    setSelectedCard(id);
  };

  const isSelected = selectedCard === id;
  
  return (
    <button
      className={`flex rounded-lg overflow-hidden cursor-pointer ${
        isSelected ? 'bg-[#AFAFFF]' : 'hover:bg-gray-100'
      }`}
      onClick={handleClick}
    >
      {/* 이미지 영역 */}
      <div className="h-40 w-1/2 relative">
        <img src={imageUrl} alt={title} className="w-full h-full object-cover" />
        <span className="absolute top-2 right-2 text-red-500 text-xl">❤️</span>
      </div>

      {/* 텍스트 영역 */}
      <div className="p-4 w-1/2">
        <p className="text-md">{propertyType}</p>
        <div className="flex">
          <p className="text-lg font-bold text-gray-700 pr-2">{dealType}</p>
          <p className="text-lg font-bold text-gray-700">{formatPrice(price)}</p>
        </div>
        <p className="text-sm text-gray-500">
          관리비 {managementFee ? `${managementFee.toLocaleString()}원` : '없음'}
        </p>
        <div className="flex">
          <p>{floor}층 / {totalFloor}층 | {area}평</p>
        </div>
      </div>
    </button>
  );
};

export default Card;