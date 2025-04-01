import { fetchAllStations } from '@/services/stationServise'
import { useQuery } from '@tanstack/react-query'

// 모든 역 불러오기
export const useAllStationsQuery = () => {
  return useQuery({
    queryKey: ['stations'], // 캐시 키
    queryFn: fetchAllStations, // 실제 요청
    staleTime: 1000 * 60 * 60, // 1시간 동안 캐시 유지
  })
}
