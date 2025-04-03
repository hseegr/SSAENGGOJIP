import { ChatRoom } from '@/types/community'
import { create } from 'zustand'

// zustand 상태 구조를 정의하는 ts 인터페이스
interface CommunityState {
  // 지도에 마커로 표시할 채팅방 목록
  markerChatRooms: ChatRoom[]

  // 채팅방 마커를 업데이트하는 함수
  setMarkerChatRooms: (room: ChatRoom[]) => void

  // 현재 클릭해서 선택된 채팅방 (오버레이 띄울 때 사용)
  selectedChatRoom: ChatRoom | null

  // 선택된 채팅방을 설정하는 함수
  setSelectedChatRoom: (room: ChatRoom | null) => void

  // 내가 참여 중인 채팅방 목록
  myChatRooms: ChatRoom[]
  setMyChatRooms: (rooms: ChatRoom[]) => void

  // "참여하기" 버튼을 눌렀는지 여부
  shouldConnect: boolean
  setShouldConnect: (val: boolean) => void
}

// zustand 저장소 생성
// create 함수 안에 우리가 정의한 상태 구조를 넣음

// Zustand 저장소 만들기
export const useCommunityStore = create<CommunityState>((set) => ({
  markerChatRooms: [], // 기본값: 아무 마커도 없음

  setMarkerChatRooms: (rooms) => set({ markerChatRooms: rooms }),
  // → 이걸 호출하면 저장소에 있는 markerChatRooms를 바꿔줌

  selectedChatRoom: null, // 기본값: 아무것도 선택 안 됨

  setSelectedChatRoom: (room) => set({ selectedChatRoom: room }),
  // → 이걸 호출하면 클릭된 채팅방 상태가 바뀜

  // ✅ 참여 버튼 상태
  myChatRooms: [],
  setMyChatRooms: (rooms) => set({ myChatRooms: rooms }),

  shouldConnect: false,
  setShouldConnect: (val: boolean) => set({ shouldConnect: val }),
}))
