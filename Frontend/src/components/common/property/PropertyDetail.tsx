import React, { useEffect, useState, useRef } from 'react'
import { useIsLoggedIn } from '@/store/userStore'
import { mockPropertyDetail } from '@/mocks/mockPropertyDetail'
// import { mockRecommendDetail } from '@/mocks/mockRecommendDetail'
// import { mockTargetAddresses } from '@/mocks/mockTargetAddresses'
import {
  formatToKoreanCurrency,
  formatMaintenanceFee,
} from '@/utils/formatUtils'
import { convertToPyeong } from '@/utils/areaUtils'
import { ChevronLeft, ChevronRight } from 'lucide-react'

import {
  fetchDetailResult,
  fetchMatchDetailResult,
} from '@/services/propertyDetailService' // API 호출 함수 임포트

import TrafficInfo from '@/components/ExplorePage/ContentArea/Detail/TrafficInfo'
import NearbyStations from '@/components/ExplorePage/ContentArea/Detail/NearbyStation'
import { getTargetAddress } from '@/services/targetService'
import useMatchSearchResultStore from '@/store/searchResultStore'

interface PropertyDetailProps {
  id: number
  onClose: () => void
}

const PropertyDetail: React.FC<PropertyDetailProps> = ({ id, onClose }) => {
  const isLoggedIn = useIsLoggedIn()
  const [data, setData] = useState<any>(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const sliderRef = useRef<HTMLDivElement>(null)
  const [trafficData, setTrafficData] = useState<any>(null)

  const { matchTargetAddress } = useMatchSearchResultStore()
  useEffect(() => {
    const fetchPropertyData = async () => {
      try {
        // 상세정보 가져오기 - TargetAddress 존재 유무에 따라 분기
        if (matchTargetAddress) {
          const requestBody = {
            propertyId: id,
            addresses: [
              {
                latitude: matchTargetAddress.latitude,
                longitude: matchTargetAddress.longitude,
                transportationType: matchTargetAddress.transportationType,
              },
            ],
          }
          console.log('매물 상세정보 POST 요청 바디:', requestBody)
          console.log(matchTargetAddress)
          const result = await fetchMatchDetailResult(requestBody)
          console.log('맞춤 상세정보 가져옴:', result)
          setData(result)
        } else {
          // TargetAddress가 없는 경우 API를 통해 상세정보 가져옴
          const result = await fetchDetailResult(id)
          console.log('데이터 잘 가져옴', result)
          setData(result)
        }
      } catch (error) {
        console.error('매물 상세정보 가져오기 실패:', error)
        // 에러 처리 로직 추가 (예: 기본 데이터로 폴백)
        setData(mockPropertyDetail)
      }
    }

    const fetchTransportationData = async () => {
      // 교통정보 가져오기 - 로그인 유무에 따라 분기
      if (isLoggedIn) {
        // 로그인 상태일 때 사용자 맞춤 교통정보 요청
        console.log('로그인 상태: 맞춤 교통정보 요청')
        // getTargetAddress API 호출
        const targetAddresses = await getTargetAddress()

        const addressesOnly = targetAddresses.map((item) => item.address)
        setTrafficData(addressesOnly)
      } else {
        // 비로그인 상태일 때 기본 교통정보 요청
        console.log('비로그인 상태: 기본 교통정보 요청')
        // 여기에 기본 교통정보 요청 및 상태 업데이트 로직 추가
      }
    }

    // 두 가지 데이터를 모두 가져옴
    const fetchAllData = async () => {
      await fetchPropertyData()
      await fetchTransportationData()
    }

    fetchAllData()
  }, [id, isLoggedIn, matchTargetAddress])

  const handlePrevImage = () => {
    if (!data?.imageUrls) return
    setCurrentImageIndex((prev) =>
      prev === 0 ? data.imageUrls.length - 1 : prev - 1,
    )
  }

  const handleNextImage = () => {
    if (!data?.imageUrls) return
    setCurrentImageIndex((prev) =>
      prev === data.imageUrls.length - 1 ? 0 : prev + 1,
    )
  }

  if (!data) return null

  return (
    <div className="relative w-full h-full p-6 overflow-y-auto bg-white">
      {/* 닫기 버튼 */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-xl font-bold"
      >
        ✕
      </button>

      {/* 거래 정보 */}
      <div className="mb-2 text-sm text-gray-600">{data.propertyType}</div>
      <div className="flex items-center justify-between text-lg font-bold mb-2">
        {data.dealType === '전세' ? (
          <div>전세 {formatToKoreanCurrency(data.price)}</div>
        ) : (
          <div>
            월세 {formatToKoreanCurrency(data.rentPrice)} /{' '}
            {formatToKoreanCurrency(data.price)}
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
              src={`${url}?w=800&h=600`}
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
      <div className="text-sm text-gray-800 space-y-2 border-b pb-4">
        <InfoRow label="매물 이름" value={data.name} />
        <InfoRow label="매물 유형" value={data.propertyType} />
        <InfoRow label="거래 유형" value={data.dealType} />
        <InfoRow
          label="금       액"
          value={
            data.dealType === '전세'
              ? `전세금 ${formatToKoreanCurrency(data.price)}`
              : `월세 ${formatToKoreanCurrency(data.rentPrice)} / 보증금 ${formatToKoreanCurrency(data.price)}`
          }
        />
        <InfoRow
          label="관  리  비"
          value={`매월 ${formatToKoreanCurrency(data.maintenancePrice)} 원`}
        />
        <InfoRow
          label="층       수"
          value={`${data.floor}층 / ${data.totalFloor}층`}
        />
        <InfoRow
          label="평수(면적)"
          value={`${convertToPyeong(data.area)}평 / ${data.area}㎡`}
        />
        <InfoRow label="매물 위치" value={data.address} />
      </div>
      {/* 교통 정보 */}
      <div className="my-6">
        <h3 className="text-xl font-bold mb-2">교통 정보 🚇</h3>
        <TrafficInfo trafficData={trafficData} />
      </div>
      {/* 매물 주변 지하철 정보 */}
      <NearbyStations stations={data.stations} />
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
