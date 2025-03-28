import { ChatRoom } from '@/types/community'
import { Search } from 'lucide-react'
import { useEffect, useState } from 'react'
import ChatRoomCard from './ChatRoomCard'
import { useCommunityStore } from '@/store/communityStore'

type Props = {
  onChatOpen: () => void
}

// 목업 데이터: 실제 API 연결 전 임시로 사용하는 데이터
const popularChatRooms: ChatRoom[] = [
  {
    id: 1,
    name: '강남역',
    line: ['2호선', '신분당선'],
    userCount: 152,
    lastMessage: '강남역 근처 카페 추천해요!',
    latitude: 37.501163,
    longitude: 127.025756,
  },
  {
    id: 2,
    name: '홍대입구역',
    line: ['2호선'],
    userCount: 98,
    lastMessage: '홍대에서 밥 같이 드실 분~',
    latitude: 37.5572,
    longitude: 126.9245,
  },
  {
    id: 3,
    name: '사당역',
    line: ['2호선', '4호선'],
    userCount: 52,
    lastMessage: '사당역 공원 어디 있나요?',
    latitude: 37.4769,
    longitude: 126.9816,
  },
]

const myChatRooms: ChatRoom[] = [
  {
    id: 2,
    name: '홍대입구역',
    line: ['2호선'],
    userCount: 98,
    lastMessage: '홍대에서 밥 같이 드실 분~',
    latitude: 37.5572,
    longitude: 126.9245,
  },
  {
    id: 4,
    name: '잠실역',
    line: ['2호선', '8호선'],
    userCount: 44,
    lastMessage: '잠실역 근처 병원 추천 부탁!',
    latitude: 37.5133,
    longitude: 127.1002,
  },
]

const searchableStations: ChatRoom[] = [
  {
    id: 100,
    name: '신촌역',
    line: ['2호선'],
    userCount: 0,
    lastMessage: '',
    latitude: 37.5551,
    longitude: 126.9368,
  },
  {
    id: 101,
    name: '건대입구역',
    line: ['2호선', '7호선'],
    userCount: 0,
    lastMessage: '',
    latitude: 37.54,
    longitude: 127.0694,
  },
  {
    id: 102,
    name: '성수역',
    line: ['2호선'],
    userCount: 0,
    lastMessage: '',
    latitude: 37.5444,
    longitude: 127.0565,
  },
]

const Sidebar = ({ onChatOpen }: Props) => {
  // 탭 상태 관리 -> list : 채팅방 목록 / my : 내가 참여한 채팅방
  const [activeTab, setActiveTab] = useState<'list' | 'my'>('list')

  // 검색어 상태 관리 (빈 문자열이면 인기 채팅방 보여줌)
  const [searchKeyword, setSearchKeyword] = useState('')

  // 검색어가 있을 경우 해당 역 이름이 포함된 채팅방만 필터링
  const searchedChatRooms = popularChatRooms.filter((room) =>
    room.name.includes(searchKeyword),
  )

  // 인기 채팅방에 없는 역 중 검색어와 일치하는 경우 (아직 생성되지 않은 채팅방)
  const fallbackRooms = searchableStations.filter(
    (stationRoom) =>
      stationRoom.name.includes(searchKeyword) &&
      !popularChatRooms.find((room) => room.name === stationRoom.name),
  )

  // 렌더링 채팅방 리스트 출력하기
  const chatRooms =
    activeTab === 'list'
      ? searchKeyword === ''
        ? popularChatRooms
        : [...searchedChatRooms, ...fallbackRooms]
      : myChatRooms

  // Zustand 상태 저장 함수 불러오기
  const setMarkerChatRooms = useCommunityStore((s) => s.setMarkerChatRooms)

  // chatRooms가 바뀔 때마다 지도 마커 상태를 업데이트
  useEffect(() => {
    setMarkerChatRooms(chatRooms)
  }, [chatRooms])

  const setSelectedChatRoom = useCommunityStore((s) => s.setSelectedChatRoom)

  const handleClickRoom = (room: ChatRoom) => {
    setSelectedChatRoom(room) // 클릭한 채팅방을 선택 상태로 저장
    // '내 채팅방' 탭일 때만 즉시 모달 열기
    if (activeTab === 'my') {
      onChatOpen()
    }
  }

  return (
    <aside className="w-96 border-r border-ssaeng-gray-1 bg-white py-6">
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
