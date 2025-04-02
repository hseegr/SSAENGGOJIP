import { useChatSocket } from '@/hooks/useChatSocket'
import { fetchEnterChatRoom } from '@/services/communityService'
import { useCommunityStore } from '@/store/communityStore'
import { useRef, useEffect, useState } from 'react'
const { connect } = useChatSocket()

// ts를 위한 코드
declare global {
  interface Window {
    kakao: any
  }
}

// props: 모달을 열기 위한 콜백 함수 전달
type Props = {
  onChatOpen: () => void
}

// MapView 컴포넌트
const MapView = ({ onChatOpen }: Props) => {
  const mapRef = useRef<HTMLDivElement>(null)
  const [map, setMap] = useState<any>(null)
  const overlayRef = useRef<any>(null)

  // Zustand 상태
  const markerChatRooms = useCommunityStore((s) => s.markerChatRooms)
  const selectedChatRoom = useCommunityStore((s) => s.selectedChatRoom)
  const setSelectedChatRoom = useCommunityStore((s) => s.setSelectedChatRoom)
  const myChatRooms = useCommunityStore((s) => s.myChatRooms)

  // 초기 지도 생성 (1회만 실행)
  useEffect(() => {
    if (!mapRef.current || !window.kakao) return

    const mapOption = {
      center: new window.kakao.maps.LatLng(37.496, 127.028),
      level: 3,
    }

    const createdMap = new window.kakao.maps.Map(mapRef.current, mapOption)
    setMap(createdMap)

    const handleResize = () => createdMap.relayout()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // 마커 표시 및 오버레이 제어
  useEffect(() => {
    if (!map || !window.kakao) return

    // 이전 오버레이 제거
    if (overlayRef.current) {
      overlayRef.current.setMap(null)
    }

    // 채팅방 마커 생성
    markerChatRooms.forEach((room) => {
      const firstLocation = room.locationList?.[0]

      if (!firstLocation) return

      const marker = new window.kakao.maps.Marker({
        map,
        position: new window.kakao.maps.LatLng(
          firstLocation.latitude,
          firstLocation.longitude,
        ),
      })
      // 마커 클릭 시 해당 채팅방 선택
      window.kakao.maps.event.addListener(marker, 'click', () => {
        setSelectedChatRoom(room)
      })
    })

    // 오버레이 표시
    if (selectedChatRoom) {
      const overlayContent = document.createElement('div')

      overlayContent.innerHTML = `
        <div style="padding:10px; background:rgba(255,255,255,0.9); border-radius:8px; box-shadow:0 0 3px rgba(0,0,0,0.2); display: flex; flex-direction: column;">
          <div style="font-weight:bold; font-size: 14px; color: #000;">${selectedChatRoom.name} 커뮤니티 </div>
          <div style="display: flex; justify-content: flex-end;">
            <button id="joinChatButton" style="margin-top:6px; color:white; background:#7171D7; border:none; border-radius:4px; padding:4px 8px; cursor:pointer; font-size: 12px;">
              참여하기
            </button>
          </div>
        </div>
      `
      const firstLocation = selectedChatRoom.locationList?.[0]
      if (!firstLocation) return

      const position = new window.kakao.maps.LatLng(
        firstLocation.latitude,
        firstLocation.longitude,
      )

      const overlay = new window.kakao.maps.CustomOverlay({
        position,
        content: overlayContent,
        yAnchor: 1,
      })

      overlay.setMap(map)
      overlayRef.current = overlay

      // 오버레이 표시 후 참여하기 버튼 이벤트 연결
      const joinBtn =
        overlayContent.querySelector<HTMLButtonElement>('#joinChatButton')
      if (joinBtn) {
        joinBtn.addEventListener('click', async () => {
          const token = localStorage.getItem('accessToken')
          if (!token) {
            alert('로그인이 필요합니다!')
            return
          }

          const isAlreadyJoined = myChatRooms.some(
            (room) => room.id === selectedChatRoom.id,
          )

          try {
            if (!isAlreadyJoined) {
              console.log('📤 입장 요청 시작', selectedChatRoom.id)
              await fetchEnterChatRoom(selectedChatRoom.id)
              console.log('✅ 입장 성공')
            } else {
              console.log('🟢 이미 입장한 채팅방 → API 생략')
            }
          } catch (err: any) {
            const status = err?.response?.status
            if (status !== 400 && status !== 409) {
              console.error('❌ 입장 실패:', err)
              alert('채팅방 입장에 실패했습니다.')
              return
            } else {
              console.warn('⚠️ 이미 입장한 채팅방입니다. 연결만 진행')
            }
          }

          connect({
            chatRoomId: selectedChatRoom.id,
            token,
            onMessage: (msg) => {
              console.log('📩 메시지 수신:', msg)
            },
          })

          onChatOpen()
        })
      }

      // 지도 위치 이동
      map.setCenter(position)
    }
  }, [map, markerChatRooms, selectedChatRoom])

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
