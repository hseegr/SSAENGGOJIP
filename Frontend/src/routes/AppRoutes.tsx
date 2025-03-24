import { createBrowserRouter, RouterProvider } from 'react-router-dom'

// 페이지 컴포넌트
import OnboardingPage from '@/pages/OnboardingPage/OnboardingPage'
import MainPage from '@/pages/MainPage/MainPage'
import NotFound from '@/pages/NotFound/NotFound'

// 레이아웃
import BaseLayout from '@/components/layout/BaseLayout'

const router = createBrowserRouter([
  // 온보딩 (공통 레이아웃 없이)
  {
    path: '/',
    element: <OnboardingPage />,
  },

  // 메인 페이지
  {
    path: '/main',
    element: <BaseLayout />,
    children: [
      {
        index: true, // index 속성 추가
        element: <MainPage />,
      },
    ],
  },

  // 404 Not Found
  {
    path: '*',
    element: <NotFound />,
  },
])

const AppRoutes = () => {
  return <RouterProvider router={router} />
}

export default AppRoutes
