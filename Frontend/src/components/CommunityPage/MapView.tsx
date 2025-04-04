import { useChatSocket } from '@/hooks/useChatSocket'
import { fetchEnterChatRoom } from '@/services/communityService'
import { useCommunityStore } from '@/store/communityStore'
import { useRef, useEffect, useState } from 'react'
import {
  useMyChatRoomQuery,
  usePopularChatRoomsQuery,
} from '@/hooks/useCommunity'

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
  const { connect } = useChatSocket()
  const { refetch: refetchMyChatRooms } = useMyChatRoomQuery()
  const { refetch: refetchPopularChatRooms } = usePopularChatRoomsQuery()

  const mapRef = useRef<HTMLDivElement>(null)
  const [map, setMap] = useState<any>(null)
  const overlayRef = useRef<any>(null)

  // Zustand 상태
  const markerChatRooms = useCommunityStore((s) => s.markerChatRooms)
  const selectedChatRoom = useCommunityStore((s) => s.selectedChatRoom)
  const setSelectedChatRoom = useCommunityStore((s) => s.setSelectedChatRoom)
  const myChatRooms = useCommunityStore((s) => s.myChatRooms)
  const shouldConnect = useCommunityStore((s) => s.shouldConnect)
  const setShouldConnect = useCommunityStore((s) => s.setShouldConnect)
  const setMyChatRooms = useCommunityStore((s) => s.setMyChatRooms)

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
      if (room.latitude && room.longitude) {
        const marker = new window.kakao.maps.Marker({
          map,
          position: new window.kakao.maps.LatLng(room.latitude, room.longitude),
        })
        // 마커 클릭 시 해당 채팅방 선택
        window.kakao.maps.event.addListener(marker, 'click', () => {
          setSelectedChatRoom(room)
        })
      }
    })

    // 오버레이 표시
    if (selectedChatRoom) {
      const overlayContent = document.createElement('div')

      overlayContent.innerHTML = `
        <div style="padding:10px; background:rgba(255,255,255,0.9); border-radius:8px; box-shadow:0 0 3px rgba(0,0,0,0.2); display: flex; flex-direction: column;">
          <div style="font-weight:bold; font-size: 14px; color: #000;">${selectedChatRoom.name}역 커뮤니티 </div>
          <div style="display: flex; justify-content: flex-end;">
            <button id="joinChatButton" style="margin-top:6px; color:white; background:#7171D7; border:none; border-radius:4px; padding:4px 8px; cursor:pointer; font-size: 12px;">
              참여하기
            </button>
          </div>
        </div>
      `

      if (selectedChatRoom.latitude && selectedChatRoom.longitude) {
        const position = new window.kakao.maps.LatLng(
          selectedChatRoom.latitude,
          selectedChatRoom.longitude,
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

                // ✅ 입장 성공 후, 내 채팅방 목록 refetch
                const result = await refetchMyChatRooms() // 🔁 최신 데이터 받아오기

                // 안전하게 result.data가 있을 때만 setMyChatRooms를 호출
                if (result.data) {
                  setMyChatRooms(result.data.result) // ✅ Zustand에 반영
                }

                // ✅ 입장 성공 후, 인기 채팅방 목록도 refetch해서 참여 인원 수 업데이트
                await refetchPopularChatRooms()

                console.log('✅ 입장 성공')
              } else {
                console.log('🟢 이미 입장한 채팅방 → API 생략')
              }
              // 여기서 WebSocket 연결은 하지 않고 플래그만 세운다
              setShouldConnect(true)
              onChatOpen()
            } catch (err: any) {
              const status = err?.response?.status
              if (status !== 400 && status !== 409) {
                console.error('❌ 입장 실패:', err)
                alert('채팅방 입장에 실패했습니다.')
                return
              } else {
                console.warn('⚠️ 이미 입장한 채팅방입니다. 연결만 진행')
                setShouldConnect(true)
                onChatOpen()
              }
            }
          })
        }

        // 지도 위치 이동
        map.setCenter(position)
      }
    }
    // ✅ 참여 버튼을 눌렀을 때만 WebSocket 연결
    if (shouldConnect && selectedChatRoom) {
      const token = localStorage.getItem('accessToken')
      if (!token) return

      connect({
        chatRoomId: selectedChatRoom.id,
        token,
        onMessage: (msg) => {
          console.log('📩 메시지 수신:', msg)
        },
      })

      setShouldConnect(false) // 연결 완료 후 초기화
    }
  }, [map, markerChatRooms, selectedChatRoom, shouldConnect])

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
