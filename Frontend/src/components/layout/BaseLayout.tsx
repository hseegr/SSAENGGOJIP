// BaseLayout.jsx
import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useUserStore } from '@/store/userStore'
import { getUserInfo } from '@/services/userService'

const BaseLayout = () => {
  const location = useLocation()
  const hideFooterRoutes = ['/explore', '/community']
  const shouldHideFooter = hideFooterRoutes.includes(location.pathname)

  const nonStickyRoutes = ['/explore', '/community']
  const isNonSticky = nonStickyRoutes.includes(location.pathname)

  useEffect(() => {
    const token = localStorage.getItem('accessToken')
    const { isLoggedIn, logout } = useUserStore.getState()
    if (!token) {
      logout()
    } else if (isLoggedIn) {
      getUserInfo().catch(() => {
        logout()
      })
    }
  }, [location.pathname])

  return (
    <div className="flex flex-col w-screen h-screen min-w-[1440px]">
      {/* isNonSticky 값을 Header 컴포넌트로 전달 */}
      <Header isNonSticky={isNonSticky} />
      <main className="flex-1">
        <Outlet />
      </main>
      {!shouldHideFooter && <Footer />}
      <ToastContainer
        position="top-center"
        autoClose={1500}
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
