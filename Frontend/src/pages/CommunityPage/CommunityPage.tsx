import ChatRoomModal from '@/components/CommunityPage/ChatRoomModal'
import MapView from '@/components/CommunityPage/MapView'
import Sidebar from '@/components/CommunityPage/Sidebar'

const CommunityPage = () => {
  return (
    <div className="flex h-screen w-screen">
      <Sidebar />
      <MapView />
      <ChatRoomModal />
    </div>
  )
}

export default CommunityPage
