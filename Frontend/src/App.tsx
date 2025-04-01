import './App.css'
import AppRoutes from '@/routes/AppRoutes.tsx'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query' // ✅ 추가

// QueryClient 인스턴스 생성 (이 파일 안에서 해도 OK)
const queryClient = new QueryClient()

function App() {
  return (
    // react-query 전역 설정
    <QueryClientProvider client={queryClient}>
      <AppRoutes />
    </QueryClientProvider>
  )
}

export default App
