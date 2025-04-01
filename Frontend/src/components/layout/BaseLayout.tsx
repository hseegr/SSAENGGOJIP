// BaseLayout.tsx
import { Outlet, useLocation } from 'react-router-dom'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { ToastContainer } from 'react-toastify' // 토스트 메시지 추가
import 'react-toastify/dist/ReactToastify.css' // 스타일도 추가

const BaseLayout = () => {
  const location = useLocation()
  const hideFooterRoutes = ['/explore', '/community'] // 푸터를 숨길 경로 목록
  const shouldHideFooter = hideFooterRoutes.includes(location.pathname)

  return (
    <div className="flex flex-col w-screen h-screen min-w-[1440px]">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      {!shouldHideFooter && <Footer />}
      {/* 토스트 에러 처리 메시지를 위함 */}
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        draggable
        theme="light"
      />
    </div>
  )
}

export default BaseLayout
