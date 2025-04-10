import React, { useRef, useEffect, useState } from 'react'
import HomeMarker from '@/assets/markers/Home.png'
import AnimalHosMarker from '@/assets/markers/AnimalHos.png'
import ConvStoreMarker from '@/assets/markers/Conve.png'
import HospitalMarker from '@/assets/markers/Hospital.png'
import LaundryMarker from '@/assets/markers/Laundry.png'
import MallMarker from '@/assets/markers/Mall.png'
import OfficeMarker from '@/assets/markers/Office.png'
import ParkMarker from '@/assets/markers/Park.png'
import ParmacyMarker from '@/assets/markers/Parmacy.png'
// 역 정보를 나타내는 타입
interface Location {
  latitude: number
  longitude: number
}

const NearFacility: React.FC<{ Location: Location }> = ({ Location }) => {
  const { latitude, longitude } = Location
  const mapRef = useRef<HTMLDivElement>(null)

  // 선택된 버튼 상태를 관리
  const [selectedOption, setSelectedOption] = useState('')

  // JSON 데이터 예제 (좌표값 포함)
  const locations = {
    병원: [
      { lat: 37.5665, lng: 126.978 },
      { lat: 37.5651, lng: 126.9769 },
    ],
    약국: [{ lat: 37.5675, lng: 126.9795 }],
    동물병원: [{ lat: 37.5645, lng: 126.977 }],
    편의점: [{ lat: 37.5635, lng: 126.975 }],
    관광서: [{ lat: 37.5625, lng: 126.974 }],
    세탁소: [{ lat: 37.5615, lng: 126.973 }],
    공원: [{ lat: 37.5605, lng: 126.972 }],
    대형마트: [{ lat: 37.5595, lng: 126.971 }],
  }

  // 버튼 클릭 핸들러
  const handleClick = (option) => {
    setSelectedOption(option)
    console.log('좌표값:', locations[option]) // JSON 데이터에서 해당 좌표값 출력
  }

  useEffect(() => {
    console.log('위치는?', latitude, longitude)
    if (mapRef.current) {
      const container = mapRef.current
      const options = {
        center: new kakao.maps.LatLng(latitude, longitude),
        level: 6, // 확대 레벨
        scrollwheel: false,
      }
      const map = new kakao.maps.Map(container, options)

      // 집 마커 생성
      const imageSrc = HomeMarker // 원 모양 이미지 파일 경로
      const imageSize = new kakao.maps.Size(20, 25) // 원 이미지 크기 (적절하게 조절)
      const imageOption = { offset: new kakao.maps.Point(12, 12) } // 원의 중심을 마커 위치에 맞춤

      const markerImage = new kakao.maps.MarkerImage(
        imageSrc,
        imageSize,
        imageOption,
      )
      const marker = new kakao.maps.Marker({
        position: new kakao.maps.LatLng(latitude, longitude),
        image: markerImage, // 원 모양 이미지 설정
      })
      // 마커가 지도 위에 표시되도록 설정합니다
      marker.setMap(map)
    }
  }, [latitude, longitude])

  return (
    <>
      {/* 상단 헤더 */}
      <div className="mb-3 flex flex-col">
        <span className="text-xl font-bold">주변 시설 정보 🤓</span>
        <span className="text-xs text-gray-400 text-right">
          매물 반경 500m 이내의 시설 확인
        </span>
      </div>

      {/* 지도 표시 */}
      <div className="mb-6">
        <div
          id="kakao-map"
          ref={mapRef}
          style={{ width: '100%', height: '200px' }}
        ></div>
      </div>

      <div className="flex flex-col items-center gap-3">
        {/* 첫 번째 줄 */}
        <div className="flex gap-3">
          <button
            className={`px-4 py-2 rounded-full font-bold border ${
              selectedOption === '병원'
                ? 'bg-ssaeng-purple text-white border-ssaeng-purple'
                : 'border-ssaeng-purple text-ssaeng-purple'
            }`}
            onClick={() => handleClick('병원')}
          >
            병원
          </button>
          <button
            className={`px-4 py-2 rounded-full font-bold border ${
              selectedOption === '약국'
                ? 'bg-ssaeng-purple text-white border-ssaeng-purple'
                : 'border-ssaeng-purple text-ssaeng-purple'
            }`}
            onClick={() => handleClick('약국')}
          >
            약국
          </button>
          <button
            className={`px-3 py-2 rounded-full font-bold border ${
              selectedOption === '동물병원'
                ? 'bg-ssaeng-purple text-white border-ssaeng-purple'
                : 'border-ssaeng-purple text-ssaeng-purple'
            }`}
            onClick={() => handleClick('동물병원')}
          >
            동물병원
          </button>
        </div>

        {/* 두 번째 줄 */}
        <div className="flex gap-2">
          <button
            className={`px-2 py-2 rounded-full font-bold border ${
              selectedOption === '편의점'
                ? 'bg-ssaeng-green text-white border-ssaeng-green'
                : 'border-ssaeng-green text-ssaeng-green'
            }`}
            onClick={() => handleClick('편의점')}
          >
            편의점
          </button>
          <button
            className={`px-2 py-2 rounded-full font-bold border ${
              selectedOption === '관광서'
                ? 'bg-ssaeng-green text-white border-ssaeng-green'
                : 'border-ssaeng-green text-ssaeng-green'
            }`}
            onClick={() => handleClick('관광서')}
          >
            관광서
          </button>
          <button
            className={`px-2 py-2 rounded-full font-bold border ${
              selectedOption === '세탁소'
                ? 'bg-ssaeng-green text-white border-ssaeng-green'
                : 'border-ssaeng-green text-ssaeng-green'
            }`}
            onClick={() => handleClick('세탁소')}
          >
            세탁소
          </button>
          <button
            className={`px-2 py-2 rounded-full font-bold border ${
              selectedOption === '공원'
                ? 'bg-ssaeng-green text-white border-ssaeng-green'
                : 'border-ssaeng-green text-ssaeng-green'
            }`}
            onClick={() => handleClick('공원')}
          >
            공원
          </button>
          <button
            className={`px-2 py-2 rounded-full font-bold border ${
              selectedOption === '대형마트'
                ? 'bg-ssaeng-green text-white border-ssaeng-green'
                : 'border-ssaeng-green text-ssaeng-green'
            }`}
            onClick={() => handleClick('대형마트')}
          >
            대형마트
          </button>
        </div>
      </div>
    </>
  )
}

export default NearFacility
