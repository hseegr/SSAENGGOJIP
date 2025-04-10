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
import { getNearFacilities } from '@/services/propertyDetailService'

interface Location {
  latitude: number
  longitude: number
}

const NearFacility: React.FC<{ Location: Location }> = ({ Location }) => {
  const { latitude, longitude } = Location
  const mapRef = useRef<HTMLDivElement>(null)
  const [facilities, setFacilities] = useState(null)
  const [selectedOptions, setSelectedOptions] = useState<string[]>([])
  const [markers, setMarkers] = useState<{
    [key: string]: kakao.maps.Marker[]
  }>({})
  const [mapInstance, setMapInstance] = useState<kakao.maps.Map | null>(null)

  useEffect(() => {
    const fetchFacilities = async () => {
      try {
        const response = await getNearFacilities({
          lat: latitude,
          lng: longitude,
        })
        setFacilities(response.facilitiesList)
      } catch (error) {
        console.error('주변 시설 데이터를 가져오는 중 오류:', error)
      }
    }

    fetchFacilities()
  }, [latitude, longitude])

  useEffect(() => {
    if (mapRef.current) {
      const container = mapRef.current
      const options = {
        center: new kakao.maps.LatLng(latitude, longitude),
        level: 5,
        scrollwheel: false,
      }
      const map = new kakao.maps.Map(container, options)
      setMapInstance(map)

      const imageSrc = HomeMarker
      const imageSize = new kakao.maps.Size(20, 25)
      const imageOption = { offset: new kakao.maps.Point(12, 12) }

      const markerImage = new kakao.maps.MarkerImage(
        imageSrc,
        imageSize,
        imageOption,
      )
      const marker = new kakao.maps.Marker({
        position: new kakao.maps.LatLng(latitude, longitude),
        image: markerImage,
      })

      marker.setMap(map)
    }
  }, [latitude, longitude])

  const handleFacilityClick = (
    facilityTypeName: string,
    markerImageSrc: string,
  ) => {
    if (!facilities || !mapInstance) return

    if (selectedOptions.includes(facilityTypeName)) {
      markers[facilityTypeName]?.forEach((marker) => marker.setMap(null))
      setMarkers((prev) => ({ ...prev, [facilityTypeName]: [] }))
      setSelectedOptions((prev) =>
        prev.filter((option) => option !== facilityTypeName),
      )
    } else {
      const facilityData = facilities.find(
        (facility) => facility.facilityTypeName === facilityTypeName,
      )

      if (facilityData) {
        const newMarkers = facilityData.locations.map((location) => {
          const markerPosition = new kakao.maps.LatLng(
            location.latitude,
            location.longitude,
          )

          const markerImage = new kakao.maps.MarkerImage(
            markerImageSrc,
            new kakao.maps.Size(15, 15),
            { offset: new kakao.maps.Point(10, 10) },
          )

          const marker = new kakao.maps.Marker({
            position: markerPosition,
            image: markerImage,
          })

          marker.setMap(mapInstance)
          return marker
        })

        setMarkers((prev) => ({ ...prev, [facilityTypeName]: newMarkers }))
        setSelectedOptions((prev) => [...prev, facilityTypeName])
      }
    }
  }

  return (
    <>
      <div className="mb-3 flex flex-col">
        <span className="text-xl font-bold">주변 시설 정보 🤓</span>
        <span className="text-xs text-gray-400 text-right">
          매물 반경 500m 이내의 시설 확인
        </span>
      </div>

      <div className="mb-6">
        <div
          id="kakao-map"
          ref={mapRef}
          style={{ width: '100%', height: '200px' }}
        ></div>
      </div>

      <div className="flex flex-wrap gap-2">
        {[
          { name: '병원', markerSrc: HospitalMarker, color: 'ssaeng-purple' },
          { name: '약국', markerSrc: ParmacyMarker, color: 'ssaeng-purple' },
          {
            name: '동물 병원',
            markerSrc: AnimalHosMarker,
            color: 'ssaeng-purple',
          },
          { name: '편의점', markerSrc: ConvStoreMarker, color: 'ssaeng-green' },
          { name: '세탁소', markerSrc: LaundryMarker, color: 'ssaeng-green' },
          { name: '대형 마트', markerSrc: MallMarker, color: 'ssaeng-green' },
          { name: '공원', markerSrc: ParkMarker, color: 'ssaeng-green' },
          { name: '관공서', markerSrc: OfficeMarker, color: 'ssaeng-green' },
        ].map((facility) => {
          const isPurple = facility.color === 'ssaeng-purple'
          const mainColor = isPurple ? '#7171D7' : '#A4D232'

          return (
            <button
              key={facility.name}
              style={{
                backgroundColor: selectedOptions.includes(facility.name)
                  ? mainColor
                  : 'transparent',
                color: selectedOptions.includes(facility.name)
                  ? 'white'
                  : mainColor,
                border: `1px solid ${mainColor}`,
              }}
              className="px-4 py-1 rounded-full font-medium text-sm transition-colors"
              onClick={() =>
                handleFacilityClick(facility.name, facility.markerSrc)
              }
            >
              {facility.name}
            </button>
          )
        })}
      </div>
    </>
  )
}

export default NearFacility
