import { createBrowserRouter, RouterProvider } from 'react-router-dom'

// 페이지 컴포넌트
import OnboardingPage from '@/pages/OnboardingPage/OnboardingPage'
import MainPage from '@/pages/MainPage/MainPage'
import NotFound from '@/pages/NotFound/NotFound'
import ExplorePage from '@/pages/ExplorePage/ExplorePage'
// 레이아웃
import BaseLayout from '@/components/layout/BaseLayout'

const router = createBrowserRouter([
  // 공통 레이아웃이 적용되는 페이지들
  {
    path: '/',
    element: <BaseLayout />,
    children: [
      { index: true, element: <OnboardingPage /> }, // ✅ path: '' 대신 index route
      { path: 'main', element: <MainPage /> }, // /main
      { path: 'explore', element: <ExplorePage /> }, // /map
    ],
  },
  

  // 404 NotFound: 최상위에 둬야 함!
  {
    path: '*',
    element: <NotFound />,
  },
])

const AppRoutes = () => {
  return <RouterProvider router={router} />
}

export default AppRoutes
