import { useRef, useEffect } from 'react'

// ts를 위한 코드
declare global {
  interface Window {
    kakao: any
  }
}

// MapView 컴포넌트 생성하기
const MapView = () => {
  // useRef는 React에서 DOM을 안전하게 다루는 방법
  // 지도를 넣을 <div>를 기억
  const mapRef = useRef<HTMLDivElement>(null)

  // 컴포넌트가 화면에 나타났을 때 실행 (한 번)
  useEffect(() => {
    // mapRef.current가 존재하고, window.kakao도 준비되어 있으면
    if (mapRef.current && window.kakao) {
      // 지도 중심 위치와 줌 레벨 설정
      const options = {
        center: new window.kakao.maps.LatLng(33.450701, 126.570667),
        level: 3, // 지도 확대 정도 (숫자가 작을수록 더 가까움)
      }

      // 지도 그리기
      const map = new window.kakao.maps.Map(mapRef.current, options)

      // 화면 크기가 변경될 때 지도를 재정렬
      const handleResize = () => {
        map.relayout()
      }

      // resize 이벤트 발생 시 handleResize 실행
      window.addEventListener('resize', handleResize)

      // 컴포넌트가 사라질 때는 이벤트 제거 (메모리 쌓임 방지)
      return () => {
        window.removeEventListener('resize', handleResize)
      }
    }
  }, [])

  // 실제 화면에 보일 div. 이 div 안에 지도가 들어감
  return (
    <div
      id="map"
      ref={mapRef}
      style={{
        width: '100vw',
        height: '100vh',
        margin: '0',
        padding: '0',
        position: 'relative',
        top: '0',
        left: '0',
      }}
    />
  )
}

export default MapView
