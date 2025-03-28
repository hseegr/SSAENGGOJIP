import Sidebar from '@/components/ExplorePage/SideBar'
import Map from '@/components/ExplorePage/Map'

const ExplorePage = () => {
  return (
    <div className="flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <Map />
    </div>
  )
}

export default ExplorePage
