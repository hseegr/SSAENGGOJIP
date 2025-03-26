import { useRef, useEffect } from 'react'

declare global {
  interface Window {
    kakao: any
  }
}

const KakaoMap = () => {
  const mapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (mapRef.current && window.kakao) {
      //   카카오맵 기본 설정
      //   중심 : 멀티캠퍼스 역삼
      //   줌 레벨 : 4
      //   드래그 가능, 스크롤 가능
      const options = {
        center: new window.kakao.maps.LatLng(37.501317, 127.043502),
        level: 4,
        draggable: true,
        scrollwheel: true,
      }
      // 첫 마커 위치
      const markerPosition = new kakao.maps.LatLng(37.501317, 127.043502)

      // 지도 생성
      const map = new window.kakao.maps.Map(mapRef.current, options)
      // 마커를 생성합니다
      const marker = new kakao.maps.Marker({
        position: markerPosition,
        clickable: true,
      })
      // 마커가 지도 위에 표시되도록 설정합니다
      marker.setMap(map)

      // 마커 클릭 이벤트 추가
      kakao.maps.event.addListener(marker, 'click', function () {
        const TargetPosition = marker.getPosition()
        map.panTo(TargetPosition)
      })
      // 화면 크기가 변경될 때 지도를 재정렬
      const handleResize = () => {
        map.relayout()
      }

      window.addEventListener('resize', handleResize)
      return () => {
        window.removeEventListener('resize', handleResize)
      }
    }
  }, [])

  return (
    <div id="map" ref={mapRef} className="relative w-[95vw] h-screen m-0 p-0" />
  )
}

export default KakaoMap
