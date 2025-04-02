import React from 'react'
import useSidebarStore from '@/store/sidebar'
import LazyLoadSlider from './slider'
import TrafficInfo from './Detail/TrafficInfo'
import NearbyStations from './Detail/NearbyStation'

// 역 정보를 나타내는 타입
interface Station {
  id: number | string // 역 ID (고유값)
  name: string // 역 이름
  line: string // 호선 이름
}

const DetailInfo: React.FC = () => {
  const { selectedCard, setSelectedCard } = useSidebarStore() // Zustand store에서 상태 가져오기

  // 임시 JSON 데이터
  const propertyData = {
    id: 1,
    name: '멀티캠퍼스 역삼',
    propertyType: '원룸',
    dealType: '월세',
    price: 700000,
    rentPrice: 243000,
    totalFloor: 15,
    floor: 5,
    area: 10.0,
    address: '서울시 강남구 태혜란로 1314',
    stations: [
      [1234, '선릉역', '분당선'],
      [1233, '선릉역', '2호선'],
      [1237, '오리역', '분당선'],
      [1239, '역삼역', '1호선'],
    ],
    facilites: [
      ['CONVINIENT', 37.5012863640697, 127.039602741448],
      ['PARK', 37.50128636406, 127.0396027414],
    ],
    imageUrls: [
      'https://upload3.inven.co.kr/upload/2020/10/12/bbs/i15928571308.jpg',
      'https://upload3.inven.co.kr/upload/2020/10/12/bbs/i15928571308.jpg',
      'https://upload3.inven.co.kr/upload/2020/10/12/bbs/i15928571308.jpg',
      'https://upload3.inven.co.kr/upload/2020/10/12/bbs/i15928571308.jpg',
    ],
  }

  const stations: Station[] = propertyData.stations.map(([id, name, line]) => ({
    id: Number(id), // id를 숫자로 변환
    name: String(name), // 혹시 모를 타입 오류 방지
    line: String(line),
  }))

  if (!selectedCard) return null // 선택된 카드가 없으면 렌더링하지 않음

  return (
    <div className="w-[400px] h-full bg-white border-l border-gray-300 py-2 px-4 overflow-y-auto">
      {/* 방 종류 + 닫기 버튼 */}
      <div className="flex justify-between items-center mb-4">
        {/* 방 타입 (왼쪽) */}
        <p className="text-md">{propertyData.propertyType}</p>

        {/* 닫기 버튼 (오른쪽) */}
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
          {propertyData.dealType} {propertyData.price}
        </h2>
        <p className="text-sm text-gray-400">
          관리비 {propertyData.rentPrice}만원
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
      </div>
      <div className="mb-6">
        {/* 주소 검색창 */}
        <TrafficInfo />
      </div>
      {/* 주변 시설 정보 */}
      <div>
        <NearbyStations stations={stations} />
      </div>
    </div>
  )
}

export default DetailInfo
