import { ChatRoom } from '@/types/community'
import { Search } from 'lucide-react'
import { useEffect, useState } from 'react'
import ChatRoomCard from './ChatRoomCard'
import { useCommunityStore } from '@/store/communityStore'

// 목업 데이터: 실제 API 연결 전 임시로 사용하는 데이터
const popularChatRooms: ChatRoom[] = [
  {
    id: '1',
    name: '뚝섬역 커뮤니티',
    station: '뚝섬역',
    location: { lat: 37.5472, lng: 127.0473 },
    participants: 123,
  },
  {
    id: '2',
    name: '강남역 커뮤니티',
    station: '강남역',
    location: { lat: 37.4979, lng: 127.0276 },
    participants: 89,
  },
  {
    id: '3',
    name: '사당역 커뮤니티',
    station: '사당역',
    location: { lat: 37.4769, lng: 126.9816 },
    participants: 52,
  },
]

const myChatRooms: ChatRoom[] = [
  {
    id: '2',
    name: '강남역 커뮤니티',
    station: '강남역',
    location: { lat: 37.4979, lng: 127.0276 },
    participants: 89,
  },
  {
    id: '4',
    name: '잠실역 커뮤니티',
    station: '잠실역',
    location: { lat: 37.5133, lng: 127.1002 },
    participants: 44,
  },
]

const searchableStations: ChatRoom[] = [
  {
    id: '100',
    name: '홍대입구역 커뮤니티',
    station: '홍대입구역',
    location: { lat: 37.5572, lng: 126.9245 },
    participants: 0, // 아직 채팅방 없음
  },
  {
    id: '101',
    name: '신촌역 커뮤니티',
    station: '신촌역',
    location: { lat: 37.5551, lng: 126.9368 },
    participants: 0,
  },
  {
    id: '102',
    name: '건대입구역 커뮤니티',
    station: '건대입구역',
    location: { lat: 37.54, lng: 127.0694 },
    participants: 0,
  },
]

const Sidebar = () => {
  // 탭 상태 관리 -> list : 채팅방 목록 / my : 내가 참여한 채팅방
  const [activeTab, setActiveTab] = useState<'list' | 'my'>('list')

  // 검색어 상태 관리 (빈 문자열이면 인기 채팅방 보여줌)
  const [searchKeyword, setSearchKeyword] = useState('')

  // 검색어가 있을 경우 해당 역 이름이 포함된 채팅방만 필터링
  const searchedChatRooms = popularChatRooms.filter((room) =>
    room.station.includes(searchKeyword),
  )

  // 인기 채팅방에 없는 역 중 검색어와 일치하는 경우 (아직 생성되지 않은 채팅방)
  const fallbackRooms = searchableStations.filter(
    (stationRoom) =>
      stationRoom.station.includes(searchKeyword) &&
      !popularChatRooms.find((room) => room.station === stationRoom.station),
  )

  // 렌더링 채팅방 리스트 출력하기
  const chatRooms =
    activeTab === 'list'
      ? searchKeyword === ''
        ? popularChatRooms
        : [...searchedChatRooms, ...fallbackRooms]
      : myChatRooms

  // ✅ Zustand 상태 저장 함수 불러오기
  const setMarkerChatRooms = useCommunityStore((s) => s.setMarkerChatRooms)

  // ✅ chatRooms가 바뀔 때마다 지도 마커 상태를 업데이트
  useEffect(() => {
    setMarkerChatRooms(chatRooms)
  }, [chatRooms])

  const setSelectedChatRoom = useCommunityStore((s) => s.setSelectedChatRoom)

  const handleClickRoom = (room: ChatRoom) => {
    setSelectedChatRoom(room) // ✅ 클릭한 채팅방을 선택 상태로 저장
  }

  return (
    <aside className="w-96 border-r border-ssaeng-gray-1 bg-white py-6 min-w-72">
      {/* 탭 */}
      <div className="flex -ml-0 text-base font-semibold border-b border-ssaeng-gray-2 w-64">
        <button
          className={`flex-1 pb-1 flex justify-center ${activeTab === 'list' ? 'text-ssaeng-purple border-b-4 border-ssaeng-purple w-28' : 'text-ssaeng-gray-2'}`}
          onClick={() => setActiveTab('list')}
        >
          채팅방 목록
        </button>

        {/* 맞춤 검색 */}
        <button
          className={`flex-1 pb-1 flex justify-center ${activeTab === 'my' ? 'text-ssaeng-purple border-b-4 border-ssaeng-purple w-28' : 'text-ssaeng-gray-2'}`}
          onClick={() => setActiveTab('my')}
        >
          내 채팅방
        </button>
      </div>

      {/* 검색창 */}
      {activeTab === 'list' && (
        <div className="flex border-2 border-ssaeng-purple rounded-lg px-4 py-2 w-64 mt-6">
          <input
            type="text"
            placeholder="채팅방 검색 (예: 홍대입구역)"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            className="flex-1 text-ssaeng-purple focus:outline-none placeholder:text-ssaeng-gray-2 placeholder:text-sm"
          />
          {/* 검색 버튼 */}
          <button className=" text-ssaeng-purple">
            <Search size={20} />
          </button>
        </div>
      )}

      {/* 결과 리스트 */}
      {activeTab === 'list' && searchKeyword === '' && (
        <h3 className="text-sm text-[#242424] font-semibold mt-6">
          인기 채팅방 목록 🔥
        </h3>
      )}
      <ul className="space-y-2">
        {chatRooms.length === 0 ? (
          <li className="text-ssaeng-gray-2 text-sm flex ml-16 mt-3">
            검색 결과가 없습니다.
          </li>
        ) : (
          chatRooms.map((room) => (
            <ChatRoomCard
              key={room.id}
              chatRoom={room}
              onClick={handleClickRoom}
            />
          ))
        )}
      </ul>
    </aside>
  )
}

export default Sidebar
