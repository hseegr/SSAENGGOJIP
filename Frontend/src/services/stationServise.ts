import { STATION_END_POINT } from './endPoints'
import http from './http-common'
import { StationListResponse } from '@/types/station'

// 전체 역 불러오기
export const fetchAllStations = async (): Promise<StationListResponse> => {
  const res = await http.get(STATION_END_POINT.ALL_STATION)
  return res.data
}
