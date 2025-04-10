import { useRef, useEffect } from 'react'
import useSidebarStore from '@/store/sidebarStore'
import useMatchInfoStore from '@/store/matchInfoStore'

interface MatchInfo {
  id: string | number // 각 matchInfo 객체를 식별할 수 있는 고유한 ID 추가
  latitude?: number
  longitude?: number
  // 다른 필요한 속성들
}

const MatchMap = () => {
  const { setTitles, clearTitles, setActiveTab } = useSidebarStore.getState()
  const { matchInfos } = useMatchInfoStore() as { matchInfos: MatchInfo[] } // 타입 명시
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstance = useRef<kakao.maps.Map | null>(null)
  const markersRef = useRef<Map<string | number, kakao.maps.Marker>>(new Map()) // 마커를 ID를 키로 관리하는 Map

  useEffect(() => {
    console.log('맞춤지도 오픈이용ㅇㅇ')
  }, [])

  useEffect(() => {
    if (mapRef.current && window.kakao && !mapInstance.current) {
      const options = {
        center: new window.kakao.maps.LatLng(37.552987017, 126.972591728),
        level: 8,
        draggable: true,
        scrollwheel: true,
      }
      const map = new window.kakao.maps.Map(mapRef.current, options)
      mapInstance.current = map
    }

    return () => {
      mapInstance.current = null
    }
  }, [setTitles, clearTitles, setActiveTab])

  useEffect(() => {
    if (mapInstance.current && matchInfos) {
      const currentMarkerIds = new Set(matchInfos.map((info) => info.id))
      const existingMarkerIds = new Set(markersRef.current.keys())

      // 삭제할 마커 처리
      existingMarkerIds.forEach((markerId) => {
        if (!currentMarkerIds.has(markerId)) {
          const markerToRemove = markersRef.current.get(markerId)
          if (markerToRemove) {
            markerToRemove.setMap(null) // 지도에서 마커 제거
            markersRef.current.delete(markerId) // Map에서 마커 정보 제거
          }
        }
      })

      // 새로운 마커 및 업데이트된 마커 처리
      matchInfos.forEach((info) => {
        const { id, latitude, longitude } = info

        if (latitude && longitude) {
          const position = new window.kakao.maps.LatLng(latitude, longitude)
          const existingMarker = markersRef.current.get(id)

          if (existingMarker) {
            // 기존 마커 위치 업데이트
            existingMarker.setPosition(position)
          } else {
            // 새로운 마커 생성
            const newMarker = new window.kakao.maps.Marker({
              position: position,
            })
            newMarker.setMap(mapInstance.current)
            markersRef.current.set(id, newMarker) // Map에 마커 정보 저장
          }
        } else {
          console.warn('유효하지 않은 좌표 정보:', info)
        }
      })

      // 필요하다면 지도의 중심 또는 범위 조정
      if (
        matchInfos.length > 0 &&
        matchInfos[0].latitude &&
        matchInfos[0].longitude
      ) {
        // 예시: 첫 번째 마커 위치로 지도 중심 이동 (선택 사항)
        // const firstLocation = new window.kakao.maps.LatLng(
        //   matchInfos[0].latitude,
        //   matchInfos[0].longitude
        // );
        // mapInstance.current.panTo(firstLocation);

        // 예시: 모든 마커가 보이도록 지도 범위 조정 (선택 사항)
        const bounds = new window.kakao.maps.LatLngBounds()
        markersRef.current.forEach((marker) => {
          bounds.extend(marker.getPosition())
        })
        mapInstance.current.setBounds(bounds)
      }
    } else if (mapInstance.current) {
      // matchInfos가 없으면 모든 마커 제거
      markersRef.current.forEach((marker) => {
        marker.setMap(null)
      })
      markersRef.current.clear()
    }
  }, [matchInfos, mapInstance])

  return (
    <div className="relative w-full h-full m-0 p-0">
      <div id="map" ref={mapRef} className="relative w-full h-full"></div>
    </div>
  )
}

export default MatchMap
