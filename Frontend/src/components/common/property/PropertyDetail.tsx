import React, { useEffect, useState, useRef } from 'react'
import { useIsLoggedIn } from '@/store/userStore'
import { mockPropertyDetail } from '@/mocks/mockPropertyDetail'
import { mockRecommendDetail } from '@/mocks/mockRecommendDetail'
import { mockTargetAddresses } from '@/mocks/mockTargetAddresses'
import { formatToKoreanCurrency, formatMaintenanceFee } from '@/utils/formatUtils'
import { convertToPyeong } from '@/utils/areaUtils'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface PropertyDetailProps {
    id: number
    onClose: () => void
}

const PropertyDetail: React.FC<PropertyDetailProps> = ({ id, onClose }) => {
    const isLoggedIn = useIsLoggedIn()
    const [data, setData] = useState<any>(null)
    const [currentImageIndex, setCurrentImageIndex] = useState(0)
    const sliderRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const fetchData = async () => {
            if (!isLoggedIn) {
                setData(mockPropertyDetail)
            } else {
                if (mockTargetAddresses?.length > 0) {
                    const requestBody = {
                        propertyId: id,
                        addresses: mockTargetAddresses,
                    }
                    console.log('POST 요청 바디:', requestBody)
                    setData(mockRecommendDetail)
                } else {
                    setData(mockPropertyDetail)
                }
            }
        }

        fetchData()
    }, [id, isLoggedIn])

    const handlePrevImage = () => {
        if (!data?.imageUrls) return
        setCurrentImageIndex((prev) =>
            prev === 0 ? data.imageUrls.length - 1 : prev - 1
        )
    }

    const handleNextImage = () => {
        if (!data?.imageUrls) return
        setCurrentImageIndex((prev) =>
            prev === data.imageUrls.length - 1 ? 0 : prev + 1
        )
    }

    if (!data) return null

    return (
        <div className="relative w-full h-full p-6 overflow-y-auto bg-white">
            {/* 닫기 버튼 */}
            <button onClick={onClose} className="absolute top-4 right-4 text-xl font-bold">
                ✕
            </button>

            {/* 거래 정보 */}
            <div className="mb-2 text-sm text-gray-600">{data.propertyType}</div>
            <div className="flex items-center justify-between text-lg font-bold mb-2">
                {data.dealType === '전세' ? (
                    <div>
                        전세 {formatToKoreanCurrency(data.price)}
                    </div>
                ) : (
                    <div>
                        월세 {formatToKoreanCurrency(data.price)} / {formatToKoreanCurrency(data.rentPrice)}
                    </div>
                )}
                <span className="text-sm font-normal text-gray-500 ml-2">
                    관리비 {formatMaintenanceFee(data.maintenancePrice)} 원
                </span>
            </div>

            {/* 이미지 영역 - 슬라이더 */}
            <div className="relative w-full mx-auto aspect-[4/3] overflow-hidden rounded-lg mb-6 bg-gray-100">
                <div
                    ref={sliderRef}
                    className="flex transition-transform duration-500 ease-in-out h-full"
                    style={{
                        width: `${(data.imageUrls?.length || 1) * 100}%`,
                        transform: `translateX(-${currentImageIndex * (100 / (data.imageUrls?.length || 1))}%)`,
                    }}
                >
                    {data.imageUrls?.map((url: string, idx: number) => (
                        <img
                            key={idx}
                            src={url}
                            alt={`image-${idx}`}
                            className="w-full h-full object-cover flex-shrink-0"
                            style={{ width: `${100 / data.imageUrls.length}%` }}
                        />
                    ))}
                </div>

                {/* 버튼 */}
                <button
                    onClick={handlePrevImage}
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/70 rounded-full p-2 hover:bg-white"
                >
                    <ChevronLeft size={20} />
                </button>
                <button
                    onClick={handleNextImage}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/70 rounded-full p-2 hover:bg-white"
                >
                    <ChevronRight size={20} />
                </button>

                {/* 인덱스 표시 */}
                <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                    {currentImageIndex + 1} / {data.imageUrls.length}
                </div>
            </div>

            {/* 매물 기본 정보 */}
            <h3 className="text-lg font-bold mb-4">매물 상세 정보 🏡</h3>
            <div className="text-sm text-gray-800 space-y-2">
                <InfoRow label="매물 이름" value={data.name} />
                <InfoRow label="매물 유형" value={data.propertyType} />
                <InfoRow label="거래 유형" value={data.dealType} />
                <InfoRow
                    label="금       액"
                    value={
                        data.dealType === '전세'
                            ? `전세금 ${formatToKoreanCurrency(data.price)}`
                            : `보증금 ${formatToKoreanCurrency(data.price)} / 월세 ${formatToKoreanCurrency(data.rentPrice)}`
                    }
                />
                <InfoRow label="관  리  비" value={`매월 ${formatToKoreanCurrency(data.maintenancePrice)} 원`} />
                <InfoRow label="층       수" value={`${data.floor}층 / ${data.totalFloor}층`} />
                <InfoRow label="평수(면적)" value={`${convertToPyeong(data.area)}평 / ${data.area}㎡`} />
                <InfoRow label="매물 위치" value={data.address} />
            </div>
        </div>
    )
}

export default PropertyDetail

const InfoRow = ({ label, value }: { label: string; value: string }) => (
    <div className="flex gap-4 items-start text-sm">
        <span className="text-ssaeng-black font-semibold whitespace-pre w-24">
            {label}
        </span>
        <span className="text-gray-900 flex-1 text-left">{value}</span>
    </div>
)