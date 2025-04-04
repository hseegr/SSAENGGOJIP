import { ChatRoom } from '@/types/community'
import { Search } from 'lucide-react'
import { useEffect, useState } from 'react'
import ChatRoomCard from './ChatRoomCard'
import { useCommunityStore } from '@/store/communityStore'
import {
  useMyChatRoomQuery,
  usePopularChatRoomsQuery,
  useSearchChatRoomsQuery,
} from '@/hooks/useCommunity'
import { useAllStationsQuery } from '@/hooks/useStation'
import { useChatSocket } from '@/hooks/useChatSocket'
const { connect } = useChatSocket()

type Props = {
  onChatOpen: () => void
}

const Sidebar = ({ onChatOpen }: Props) => {
  // 탭 상태 관리 -> list : 채팅방 목록 / my : 내가 참여한 채팅방
  const [activeTab, setActiveTab] = useState<'list' | 'my'>('list')

  // 검색어 상태 관리 (빈 문자열이면 인기 채팅방 보여줌)
  const [searchKeyword, setSearchKeyword] = useState('')

  // api 호출하기
  // 인기 채팅방
  const { data: popularData, refetch: refetchPopular } =
    usePopularChatRoomsQuery()

  // 내 채팅방
  const { data: myData, refetch: refetchMy } = useMyChatRoomQuery()

  // 검색
  const { data: searchedData } = useSearchChatRoomsQuery(searchKeyword)

  // 전체 역 받아오기
  const { data: stationData } = useAllStationsQuery()

  // 현재 탭이 my인지 확인하는 상태 추가
  const isMyTab = activeTab === 'my'

  // 전체 역에서 아직 생성되지 않은 채팅방 (검색어 + 기존 채팅방과 중복 x)
  const fallbackRooms = (stationData?.result ?? []).filter(
    (station) =>
      station.name.includes(searchKeyword) &&
      !chatRooms.some((room) => room.name === station.name),
  )

  // 응답 데이터가 없을 경우 대비
  const popularChatRooms = popularData?.result ?? []
  const myChatRooms = myData?.result ?? []
  const searchedChatRooms = searchedData?.result ?? []

  // 렌더링 채팅방 리스트 출력하기
  const chatRooms =
    activeTab === 'list'
      ? searchKeyword === ''
        ? popularChatRooms
        : searchedChatRooms
      : myChatRooms

  // Zustand 상태 저장 함수 불러오기
  const setMarkerChatRooms = useCommunityStore((s) => s.setMarkerChatRooms)
  const setSelectedChatRoom = useCommunityStore((s) => s.setSelectedChatRoom)
  const setMyChatRooms = useCommunityStore((s) => s.setMyChatRooms)

  useEffect(() => {
    if (myData?.result) {
      setMyChatRooms(myData.result)
    }
  }, [myData])

  // 탭이 변경될 때마다 해당 탭의 데이터를 새로 요청 (refetch)
  useEffect(() => {
    if (activeTab === 'list') {
      refetchPopular()
    } else {
      refetchMy()
    }
  }, [activeTab])

  // chatRooms가 바뀔 때마다 지도 마커 상태를 업데이트
  useEffect(() => {
    setMarkerChatRooms(chatRooms)
  }, [chatRooms])

  // 채팅방 클릭 시 선택된 채팅방 상태 저장 + 탭이 'my'일 경우 모달 열기

  // 채팅방 클릭 시 처리
  const handleClickRoom = async (room: ChatRoom) => {
    const token = localStorage.getItem('accessToken')!
    const isAlreadyJoined = myChatRooms.some((r) => r.id === room.id)

    // 선택한 채팅방을 상태에 저장 (오버레이 or 모달용)
    setSelectedChatRoom(room)

    if (isAlreadyJoined) {
      console.log('🟢 이미 참여한 채팅방 → 모달 열기', room.id)

      // connect({
      //   chatRoomId: room.id,
      //   token,
      //   onMessage: (msg) => console.log('📩 받은 메시지:', msg),
      // })

      onChatOpen()
    } else {
      console.log('🟡 참여하지 않은 채팅방 → 오버레이만 표시', room.id)
      // ❗ 참여하기 버튼 눌러야 입장/연결됨 (MapView.tsx에서 처리)
      // 이미 모달이 열려있다면 닫기 (중요!)
    }
  }

  return (
    <aside
      className="w-96 border-r border-ssaeng-gray-1 bg-white py-6"
      style={{
        height: '100vh', // 💡 높이를 고정
        overflowY: 'auto', // 💡 스크롤 가능하게
        flexShrink: 0, // 💡 크기 줄어들지 않게
      }}
    >
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
        {chatRooms.length === 0 && fallbackRooms.length === 0 ? (
          <li className="text-ssaeng-gray-2 text-sm flex ml-16 mt-3">
            검색 결과가 없습니다.
          </li>
        ) : (
          <>
            {chatRooms.map((room) => (
              <ChatRoomCard
                key={room.id}
                chatRoom={room}
                onClick={handleClickRoom}
              />
            ))}
            {/* 아직 생성되지 않았지만 추천 가능한 역 목록 */}
            {fallbackRooms.map((station) => (
              <ChatRoomCard
                key={station.id}
                chatRoom={{
                  ...station,
                  userCount: 0,
                  lastMessage: '',
                  locationList: [],
                }}
                onClick={handleClickRoom}
              />
            ))}
          </>
        )}
      </ul>
    </aside>
  )
}

export default Sidebar
