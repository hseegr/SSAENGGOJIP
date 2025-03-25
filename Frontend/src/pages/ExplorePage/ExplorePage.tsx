import Sidebar from "@/components/ExplorePage/SideBar";

const ExplorePage = () => {
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main Content */}
      <div className="flex flex-col items-center justify-center flex-1 bg-gray-100">
        <h1 className="text-3xl font-bold">🏠 지도 페이지</h1>
        <p className="mt-2 text-gray-600">여기는 부동산 지도 페이지~~</p>
      </div>
    </div>
  );
};

export default ExplorePage;
