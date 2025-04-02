import React, { useEffect, useState } from 'react'
import useSidebarStore from '@/store/sidebar'
import LazyLoadSlider from './slider'
import TrafficInfo from './Detail/TrafficInfo'
import NearbyStations from './Detail/NearbyStation'
import { fetchDetailResult } from '@/services/propertyDetailService' // API 호출 함수 임포트

interface Station {
  id: number
  name: string
  line: string
}

interface Facility {
  facilityType: string
  longitude: number
  latitude: number
}

interface PropertyData {
  id: number
  name: string
  propertyType: string
  dealType: string
  price: number
  rentPrice: number
  maintenancePrice: number
  totalFloor: number
  floor: number
  area: number
  address: string
  stations: Station[]
  facilites: Facility[]
  imageUrls: string[]
}

const DetailInfo: React.FC = () => {
  const { selectedCard, setSelectedCard } = useSidebarStore() // Zustand store에서 상태 가져오기
  const [propertyData, setPropertyData] = useState<PropertyData>({
    id: 1,
    name: '멀티캠퍼스 역삼',
    propertyType: '원룸',
    dealType: '월세',
    price: 100000000,
    rentPrice: 2430000,
    maintenancePrice: 100000,
    totalFloor: 15,
    floor: 5,
    area: 10.0,
    address: '서울시 강남구 태혜란로 1314',
    stations: [
      { id: 1234, name: '선릉역', line: '분당선' },
      { id: 1233, name: '선릉역', line: '2호선' },
      { id: 1237, name: '오리역', line: '분당선' },
      { id: 1239, name: '역삼역', line: '1호선' },
    ],
    facilites: [
      {
        facilityType: 'CONVINIENT',
        longitude: 37.5012863640697,
        latitude: 127.039602741448,
      },
      {
        facilityType: 'PARK',
        longitude: 37.50128636406,
        latitude: 127.0396027414,
      },
    ],
    imageUrls: [
      'https://upload3.inven.co.kr/upload/2020/10/12/bbs/i15928571308.jpg',
      'https://upload3.inven.co.kr/upload/2020/10/12/bbs/i15928571308.jpg',
      'https://upload3.inven.co.kr/upload/2020/10/12/bbs/i15928571308.jpg',
      'https://upload3.inven.co.kr/upload/2020/10/12/bbs/i15928571308.jpg',
    ],
  }) // 상태로 매물 데이터 관리

  useEffect(() => {
    if (selectedCard) {
      // 선택된 카드 ID를 기반으로 API 호출
      fetchDetailResult(selectedCard)
        .then((data) => setPropertyData(data)) // result 데이터 저장
        .catch((error) => console.error('API 요청 실패:', error))
    }
  }, [selectedCard])

  if (!selectedCard || !propertyData) return null // 선택된 카드가 없거나 데이터가 없으면 렌더링하지 않음

  const stations: Station[] = propertyData.stations.map(
    ({ id, name, line }) => ({
      id,
      name,
      line,
    }),
  )

  return (
    <div className="w-[400px] h-full bg-white border-l border-gray-300 py-2 px-4 overflow-y-auto">
      {/* 방 종류 + 닫기 버튼 */}
      <div className="flex justify-between items-center mb-4">
        <p className="text-md">{propertyData.propertyType}</p>
        <button
          className="text-gray-600 hover:text-black"
          onClick={() => setSelectedCard(null)} // 닫기 버튼 클릭 시 선택된 카드 초기화
        >
          ✖
        </button>
      </div>

      {/* 전/월세 가격 + 보증금 */}
      <div className="flex items-center mb-4">
        <h2 className="text-lg font-semibold pr-3 text-[#242424]">
          {propertyData.dealType === '월세' ? (
            <>
              {propertyData.price.toLocaleString()} /&nbsp;
              {propertyData.rentPrice.toLocaleString()}원
            </>
          ) : (
            <>
              {propertyData.dealType}
              {propertyData.price.toLocaleString()}원
            </>
          )}
        </h2>

        {/* 관리비 표시 (모든 경우 동일) */}
        <p className="text-sm text-gray-400">
          관리비
          {propertyData.maintenancePrice.toLocaleString()}원
        </p>
      </div>

      {/* 이미지 영역 */}
      <div className="mb-4">
        <LazyLoadSlider imageUrls={propertyData.imageUrls} />
      </div>

      {/* 매물 상세 정보 */}
      <div className="mb-6">
        <h1 className="text-xl font-bold mb-4 text-[#242424]">
          매물 상세 정보 🏠
        </h1>
        <div className="grid grid-cols-2 gap-x-2 gap-y-2">
          <span className="font-semibold text-[#242424]">매물 이름</span>
          <span className="text-sm">{propertyData.name}</span>

          <span className="font-semibold text-[#242424]">매물 유형</span>
          <span className="text-sm">{propertyData.propertyType}</span>

          <span className="font-semibold text-[#242424]">거래 유형</span>
          <span className="text-sm">{propertyData.dealType}</span>

          <span className="font-semibold text-[#242424]">
            금&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;액
          </span>
          <span className="text-sm">
            {propertyData.price.toLocaleString()}원
          </span>

          <span className="font-semibold text-[#242424]">
            관&nbsp;&nbsp;리&nbsp;&nbsp;비
          </span>
          <span className="text-sm">
            {propertyData.price.toLocaleString()}원
          </span>

          <span className="font-semibold text-[#242424]">
            층&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;수
          </span>
          <span className="text-sm">
            {propertyData.floor}층 / {propertyData.totalFloor}층
          </span>

          <span className="font-semibold text-[#242424]">평수(면적)</span>
          <span className="text-sm">{propertyData.area}평</span>

          <span className="font-semibold text-[#242424]">매물 위치</span>
          <span className="text-sm">{propertyData.address}</span>
        </div>
      </div>
      <div className="border-b mb-4"></div>

      {/* 교통 정보 */}
      <div className="mb-6">
        <h3 className="text-xl font-bold mb-2">교통 정보 🚇</h3>
        <TrafficInfo />
      </div>

      {/* 주변 시설 정보 */}
      <NearbyStations stations={stations} />
    </div>
  )
}

export default DetailInfo
