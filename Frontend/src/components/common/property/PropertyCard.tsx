import { Heart } from 'lucide-react'
import { useState } from 'react'
import { convertToPyeong } from '@/utils/areaUtils'
import { formatToKoreanCurrency } from '@/utils/formatUtils'
import clsx from 'clsx'

type Property = {
    id: number
    isRecommend: boolean
    propertyType: string
    dealType: string
    price: number
    rentPrice: number
    maintenancePrice: number
    totalFloor: number
    floor: number
    area: number
    address: string
    imageUrl?: string
    isInterest: boolean
}

type Props = {
    property: Property
    isCompareMode?: boolean
    isSelected?: boolean
    onSelect?: () => void
}

const PropertyCard = ({
    property,
    isCompareMode = false,
    isSelected = false,
    onSelect,
}: Props) => {
    const [isLiked, setIsLiked] = useState(property.isInterest)

    const toggleLike = (e: React.MouseEvent) => {
        e.stopPropagation() // 카드 선택과 찜 클릭 분리
        setIsLiked((prev) => !prev)
    }

    return (
        <div
            className={clsx(
                'relative border bg-white border-gray-200 rounded-xl p-3 hover:border-gray-300 transition',
                isCompareMode && 'cursor-pointer',
                isSelected && 'ring-2 ring-ssaeng-purple'
            )}
            onClick={isCompareMode ? onSelect : undefined}
        >
            {/* 이미지 */}
            <div className="relative w-full h-40 bg-gray-100 rounded mb-3 overflow-hidden">
                {/* 추천 배지 */}
                {property.isRecommend && (
                    <span className="absolute top-2 left-2 z-10 text-xs px-2 py-0.5 rounded-md font-semibold bg-lime-100 text-lime-600">
                        추천
                    </span>
                )}

                {/* 찜 버튼 */}
                <button onClick={toggleLike} className="absolute top-2 right-2 z-10">
                    <Heart
                        size={24}
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
                {property.imageUrl && (
                    <img
                        src={property.imageUrl}
                        alt="매물 이미지"
                        className="w-full h-full object-cover"
                    />
                )}
            </div>

            {/* 매물 정보 */}
            <div className="text-sm text-gray-500 mb-1">{property.propertyType}</div>

            <div className="font-bold text-[15px] mb-1">
                {property.dealType === '전세' ? (
                    <>전세 {formatToKoreanCurrency(property.price)}</>
                ) : (
                    <>
                        월세 {formatToKoreanCurrency(property.price)} /{' '}
                        {formatToKoreanCurrency(property.rentPrice)}
                    </>
                )}
            </div>

            <div className="text-sm text-gray-500 mb-1">
                관리비 {formatToKoreanCurrency(property.maintenancePrice)}
            </div>

            <div className="text-sm text-gray-600 mb-1">
                {property.floor}층 / {property.totalFloor}층 &nbsp;&nbsp;|&nbsp;&nbsp;
                {convertToPyeong(property.area)}평 ({property.area}㎡)
            </div>

        </div>
    )
}

export default PropertyCard