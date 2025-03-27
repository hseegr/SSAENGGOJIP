import Sidebar from '@/components/ExplorePage/SideBar'
import Map from '@/components/ExplorePage/Map'

const ExplorePage = () => {
  return (
    <div className="flex -ml-10 -mr-10">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <Map />
    </div>
  )
}

export default ExplorePage
