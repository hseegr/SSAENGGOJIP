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

  // 공통 레이아웃이 적용되는 내부 페이지들
  {
    element: <BaseLayout />,
    children: [
      { path: '/main', element: <MainPage /> },
      // 추후 여기에 /chat, /mypage 등 추가
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
