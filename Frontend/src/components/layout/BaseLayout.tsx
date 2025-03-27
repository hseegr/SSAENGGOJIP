// BaseLayout.tsx
import { Outlet, useLocation } from 'react-router-dom'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

const BaseLayout = () => {
  const location = useLocation()
  const hideFooterRoutes = ['/explore', '/community'] // 푸터를 숨길 경로 목록
  const shouldHideFooter = hideFooterRoutes.includes(location.pathname)

  return (
    <div className="flex flex-col w-full h-screen min-w-[1440px]">
      <Header />
      <main className="flex-1 px-10">
        <Outlet />
      </main>
      {!shouldHideFooter && <Footer />}
    </div>
  )
}

export default BaseLayout
