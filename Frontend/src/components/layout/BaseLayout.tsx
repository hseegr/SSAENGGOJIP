import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { ToastContainer } from 'react-toastify' // 토스트 메시지 추가
import 'react-toastify/dist/ReactToastify.css' // 스타일도 추가
import { useUserStore } from '@/store/userStore'
import { getUserInfo } from '@/services/userService'


const BaseLayout = () => {
  const location = useLocation()
  const hideFooterRoutes = ['/explore', '/community'] // 푸터를 숨길 경로 목록
  const shouldHideFooter = hideFooterRoutes.includes(location.pathname)

  useEffect(() => {
    const token = localStorage.getItem('accessToken')
    const { isLoggedIn, logout } = useUserStore.getState()
    // console.log('현재 경로:', location.pathname)
    // console.log('토큰:', token)
    if (!token) {
      // console.log('토큰 없음 → 로그아웃 상태 초기화')
      logout()
    } else if (isLoggedIn) {
      // accessToken이 있지만 유효한지 확인
      getUserInfo().catch(() => {
        logout()
      })
    }
  }, [location.pathname])

  return (
    <div className="flex flex-col w-screen h-screen min-w-[1440px]">
      <Header />
      <main className="flex-1 ">
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
