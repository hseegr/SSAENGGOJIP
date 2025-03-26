import { Outlet } from 'react-router-dom'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

const BaseLayout = () => {
  return (
    <div className="flex flex-col w-full min-h-screen min-w-[1200px] overflow-auto scrollbar-hide">
      <Header />
      <main className="flex-1 px-10">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

export default BaseLayout
