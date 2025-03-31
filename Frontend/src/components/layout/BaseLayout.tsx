import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { useUserStore } from '@/store/userStore'

const BaseLayout = () => {
  const location = useLocation()
  const hideFooterRoutes = ['/explore', '/community'] // 푸터를 숨길 경로 목록
  const shouldHideFooter = hideFooterRoutes.includes(location.pathname)

  useEffect(() => {
    const token = localStorage.getItem('accessToken')
    // console.log('현재 경로:', location.pathname)
    // console.log('토큰:', token)
    if (!token) {
      // console.log('토큰 없음 → 로그아웃 상태 초기화')
      useUserStore.getState().logout()
    }
  }, [location.pathname])

  return (
    <div className="flex flex-col w-screen h-screen min-w-[1440px]">
      <Header />
      <main className="flex-1 ">
        <Outlet />
      </main>
      {!shouldHideFooter && <Footer />}
    </div>
  )
}

export default BaseLayout
