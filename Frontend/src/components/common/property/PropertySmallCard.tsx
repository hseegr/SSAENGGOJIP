import { Heart } from 'lucide-react'
import { useState } from 'react'
import clsx from 'clsx'
import { convertToPyeong } from '@/utils/areaUtils'
import { formatToKoreanCurrency, formatMaintenanceFee } from '@/utils/formatUtils'

type Property = {
    id: number
    propertyType: string
    dealType: string
    price: number
    rentPrice: number
    maintenancePrice: number
    totalFloor: number
    floor: number
    area: number
    imageUrl?: string
    isInterest: boolean
}

type Props = {
    property: Property
}

const PropertySmallCard = ({ property }: Props) => {
    const [isLiked, setIsLiked] = useState(property.isInterest)

    const toggleLike = (e: React.MouseEvent) => {
        e.stopPropagation()
        setIsLiked((prev) => !prev)
    }

    return (
        <div className="flex p-4 rounded-xl bg-white hover:bg-gray-50 transition">
            {/* 이미지 영역 */}
            <div className="relative w-32 h-24 bg-gray-200 rounded-lg overflow-hidden shrink-0">
                {/* 찜 아이콘 */}
                <button onClick={toggleLike} className="absolute top-1.5 right-1.5 z-10">
                    <Heart
                        size={20}
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

            {/* 정보 영역 */}
            <div className="ml-4 flex flex-col justify-between py-1">
                <div className="text-xs text-gray-800">{property.propertyType}</div>

                <div className="font-bold text-base">
                    {property.dealType === '전세' ? (
                        <>전세 {formatToKoreanCurrency(property.price)}</>
                    ) : (
                        <>
                            월세 {formatToKoreanCurrency(property.price)} /{' '}
                            {formatToKoreanCurrency(property.rentPrice)}
                        </>
                    )}
                </div>

                <div className="text-sm text-gray-600">
                    관리비 {formatMaintenanceFee(property.maintenancePrice)}
                </div>

                <div className="text-xs text-gray-600">
                    {property.floor}층 / {property.totalFloor}층 &nbsp;&nbsp;|&nbsp;&nbsp;
                    {convertToPyeong(property.area)}평 ({property.area}㎡)
                </div>
            </div>
        </div>
    )
}

export default PropertySmallCard