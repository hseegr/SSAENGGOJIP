import { useCommunityStore } from '@/store/communityStore'
import { useRef, useEffect, useState } from 'react'

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
  const [map, setMap] = useState<any>(null) // 지도 객체 상태로 보관
  const overlayRef = useRef<any>(null) // 오버레이 참조 저장

  // ✅ Zustand 상태 불러오기
  const markerChatRooms = useCommunityStore((s) => s.markerChatRooms) // 마커로 표시할 채팅방들
  const selectedChatRoom = useCommunityStore((s) => s.selectedChatRoom) // 선택된 채팅방
  const setSelectedChatRoom = useCommunityStore((s) => s.setSelectedChatRoom) // 선택 상태 저장 함수

  // ✅ 초기 지도 생성 (한 번만 실행)
  useEffect(() => {
    if (!mapRef.current || !window.kakao) return

    const mapOption = {
      center: new window.kakao.maps.LatLng(37.55, 127.04),
      level: 3,
    }
    const createdMap = new window.kakao.maps.Map(mapRef.current, mapOption)
    setMap(createdMap)

    const handleResize = () => createdMap.relayout()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // ✅ 마커 & 오버레이 표시 (markerChatRooms 또는 선택된 채팅방이 바뀔 때마다 실행)
  useEffect(() => {
    if (!map || !window.kakao) return

    // 기존 오버레이 제거
    if (overlayRef.current) {
      overlayRef.current.setMap(null)
    }

    // 마커 표시
    markerChatRooms.forEach((room) => {
      const marker = new window.kakao.maps.Marker({
        map,
        position: new window.kakao.maps.LatLng(
          room.location.lat,
          room.location.lng,
        ),
      })

      // 마커 클릭 시 해당 채팅방 선택
      window.kakao.maps.event.addListener(marker, 'click', () => {
        setSelectedChatRoom(room)
      })
    })

    // 오버레이 표시 + 좌표 이동
    if (selectedChatRoom) {
      const overlayContent = document.createElement('div')
      overlayContent.innerHTML = `
        <div style="padding:10px; background:rgba(255,255,255,0.9); border-radius:8px; box-shadow:0 0 3px rgba(0,0,0,0.2); display: flex; flex-direction: column;">
          <div style="font-weight:bold; font-size: 14px; color: #000;">${selectedChatRoom.name}</div>
          <div style="display: flex; justify-content: flex-end;">
            <button style="margin-top:6px; color:white; background:#7171D7; border:none; border-radius:4px; padding:4px 8px; cursor:pointer; font-size: 12px;">참여하기</button>
          </div>
        </div>
      `

      const position = new window.kakao.maps.LatLng(
        selectedChatRoom.location.lat,
        selectedChatRoom.location.lng,
      )

      const overlay = new window.kakao.maps.CustomOverlay({
        position,
        content: overlayContent,
        yAnchor: 1,
      })

      overlay.setMap(map)
      overlayRef.current = overlay // 오버레이 참조 저장

      map.setCenter(position) // ✅ 선택된 채팅방 위치로 지도 이동
    }
  }, [map, markerChatRooms, selectedChatRoom])

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
