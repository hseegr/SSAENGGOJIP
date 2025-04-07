import './App.css'
import AppRoutes from '@/routes/AppRoutes.tsx'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useEffect } from 'react'

// Kakao Map 로드 함수
const loadKakaoMap = () => {
  const script = document.createElement("script");
  script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${import.meta.env.VITE_KAKAO_MAP_KEY
    }&autoload=false&libraries=services,clusterer`;
  script.async = true;
  document.head.appendChild(script);

  script.onload = () => {
    // @ts-ignore
    window.kakao.maps.load(() => {
      console.log("카카오맵 로딩 완료");
    });
  };
};

const queryClient = new QueryClient()

function App() {
  useEffect(() => {
    loadKakaoMap();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AppRoutes />
    </QueryClientProvider>
  )
}

export default App