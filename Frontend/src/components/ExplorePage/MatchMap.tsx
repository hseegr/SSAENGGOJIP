import { useRef, useEffect } from 'react'
import useSidebarStore from '@/store/sidebarStore'
import useMatchInfoStore from '@/store/matchInfoStore'
import useMatchSearchResultStore from '@/store/searchResultStore'
import targetMarker from '@/assets/markers/mage_map-marker-fill.png'
import homeIcon from '@/assets/markers/fa6-solid_house.png'

interface MatchInfo {
  id: string | number
  latitude?: number
  longitude?: number
}

interface SearchResultProperty {
  id: string | number
  latitude?: number
  longitude?: number
}

const createMarkerImage = (
  iconPath: string,
  size: [number, number],
  offset: [number, number],
) => {
  return new window.kakao.maps.MarkerImage(
    iconPath,
    new window.kakao.maps.Size(...size),
    { offset: new window.kakao.maps.Point(...offset) },
  )
}

const MatchMap = () => {
  const { setTitles, clearTitles, setActiveTab } = useSidebarStore.getState()
  const { matchInfos } = useMatchInfoStore()
  const { results } = useMatchSearchResultStore()

  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstance = useRef<kakao.maps.Map | null>(null)
  const clustererRef = useRef<kakao.maps.MarkerClusterer | null>(null)
  const searchResultMarkersRef = useRef<
    Map<string | number, kakao.maps.Marker>
  >(new Map())
  const matchInfoMarkersRef = useRef<Map<string | number, kakao.maps.Marker>>(
    new Map(),
  )

  // 지도 초기화 및 클러스터러 설정
  useEffect(() => {
    if (mapRef.current && window.kakao && !mapInstance.current) {
      const options = {
        center: new window.kakao.maps.LatLng(37.552987017, 126.972591728),
        level: 8,
        draggable: true,
        scrollwheel: true,
      }
      mapInstance.current = new window.kakao.maps.Map(mapRef.current, options)

      // 클러스터러 초기화
      clustererRef.current = new window.kakao.maps.MarkerClusterer({
        map: mapInstance.current,
        averageCenter: true,
        minLevel: 5,
        calculator: [25, 50, 100, 300, 600],
        styles: [
          {
            width: '40px',
            height: '40px',
            background: 'rgba(113, 113, 215, 0.70)',
            borderRadius: '50%',
            color: '#ffffff',
            textAlign: 'center',
            lineHeight: '25px',
          },
          {
            width: '60px',
            height: '60px',
            background: 'rgba(113, 113, 215, 0.70)',
            borderRadius: '50%',
            color: '#ffffff',
            textAlign: 'center',
            lineHeight: '40px',
          },
          {
            width: '80px',
            height: '80px',
            background: 'rgba(113, 113, 215, 0.70)',
            borderRadius: '50%',
            color: '#ffffff',
            textAlign: 'center',
            lineHeight: '50px',
          },
          {
            width: '120px',
            height: '120px',
            background: 'rgba(113, 113, 215, 0.70)',
            borderRadius: '50%',
            color: '#ffffff',
            textAlign: 'center',
            lineHeight: '150px',
          },
          {
            width: '200px',
            height: '200px',
            background: 'rgba(113, 113, 215, 0.70)',
            borderRadius: '50%',
            color: '#ffffff',
            textAlign: 'center',
            lineHeight: '150px',
          },
        ],
      })

      // 줌 변경 이벤트 리스너 추가[3][6]
      window.kakao.maps.event.addListener(
        mapInstance.current,
        'zoom_changed',
        () => {
          const level = mapInstance.current?.getLevel() ?? 8
          updateClustererGridSize(level)
        },
      )

      // 초기 그리드 사이즈 설정
      updateClustererGridSize(options.level)
    }

    return () => {
      window.kakao.maps.event.removeListener(
        mapInstance.current,
        'zoom_changed',
        updateClustererGridSize,
      )
    }
  }, [])

  // 그리드 사이즈 업데이트 함수[1][5]
  const updateClustererGridSize = (level: number) => {
    if (!clustererRef.current) return

    if (level > 8) {
      clustererRef.current.setGridSize(100) // 넓은 영역 클러스터링
    } else if (level > 5) {
      clustererRef.current.setGridSize(100) // 중간 영역
    }

    // 클러스터 리빌드[2][6]
    clustererRef.current.redraw()
  }

  // 검색 결과 마커 클러스터링 처리
  useEffect(() => {
    if (!mapInstance.current || !clustererRef.current || !results?.properties) {
      clustererRef.current?.clear()
      searchResultMarkersRef.current.clear()
      return
    }

    const properties = results.properties
    const markers = properties
      .map((prop) => {
        const { latitude, longitude } = prop
        if (!latitude || !longitude) return null

        const position = new window.kakao.maps.LatLng(latitude, longitude)
        const marker = new window.kakao.maps.Marker({
          position,
          image: createMarkerImage(homeIcon, [24, 24], [12, 24]),
        })

        // 마커 클릭 이벤트 추가
        window.kakao.maps.event.addListener(marker, 'click', () => {
          console.log('검색 결과 마커 클릭:', prop)
        })

        return marker
      })
      .filter(Boolean) as kakao.maps.Marker[]

    clustererRef.current.addMarkers(markers)
    searchResultMarkersRef.current = new Map(
      markers.map((marker, idx) => [properties[idx].id, marker]),
    )

    // 지도 범위 조정
    if (markers.length > 0) {
      const bounds = new window.kakao.maps.LatLngBounds()
      markers.forEach((m) => bounds.extend(m.getPosition()))
      mapInstance.current.setBounds(bounds)
    }

    return () => {
      clustererRef.current?.removeMarkers(markers)
    }
  }, [results])

  // 매치 정보 마커 처리 (기존 코드 유지)
  useEffect(() => {
    if (!mapInstance.current || !matchInfos) {
      matchInfoMarkersRef.current.forEach((marker) => marker.setMap(null))
      matchInfoMarkersRef.current.clear()
      return
    }

    const currentIds = new Set(matchInfos.map((m) => m.id))
    const markerImage = createMarkerImage(targetMarker, [48, 48], [12, 24])

    // 삭제 처리
    Array.from(matchInfoMarkersRef.current.keys()).forEach((id) => {
      if (!currentIds.has(id)) {
        const marker = matchInfoMarkersRef.current.get(id)!
        marker.setMap(null)
        matchInfoMarkersRef.current.delete(id)
      }
    })

    // 추가/업데이트 처리
    matchInfos.forEach((info) => {
      const { id, latitude, longitude } = info
      if (!latitude || !longitude) return

      const position = new window.kakao.maps.LatLng(latitude, longitude)
      const existingMarker = matchInfoMarkersRef.current.get(id)

      if (existingMarker) {
        existingMarker.setPosition(position)
      } else {
        const newMarker = new window.kakao.maps.Marker({
          position,
          image: markerImage,
        })
        newMarker.setMap(mapInstance.current)
        matchInfoMarkersRef.current.set(id, newMarker)
      }
    })

    // 지도 범위 조정 (선택적)
    if (matchInfos.length > 0) {
      const bounds = new window.kakao.maps.LatLngBounds()
      matchInfoMarkersRef.current.forEach((m) => bounds.extend(m.getPosition()))
      mapInstance.current.setBounds(bounds)
    }
  }, [matchInfos])

  return (
    <div className="relative w-full h-full m-0 p-0">
      <div ref={mapRef} className="w-full h-full" />
    </div>
  )
}

export default MatchMap
