import Sidebar from '@/components/ExplorePage/SideBar'
import Map from '@/components/ExplorePage/Map'

const ExplorePage = () => {
  return (
    <div className="relative h-screen w-screen">
      {/* Sidebar: 슬라이드 될 영역 */}
      <div className="absolute top-0 left-0 h-full z-10">
        <Sidebar />
      </div>

      {/* Map: 항상 고정된 전체 화면 */}
      <div className="absolute top-0 left-0 w-full h-full z-0">
        <Map />
      </div>
    </div>
  )
}

export default ExplorePage
