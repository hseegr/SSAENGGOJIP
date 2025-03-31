import { PropertyRecommendResponse } from '@/types/main'
import { MAIN_END_POINT } from './endPoints'
import http from './http-common'

// 로그인 유저 - 선호도 기반 추천
export const fetchPreferenceRecommendations = async (
  k: number,
): Promise<PropertyRecommendResponse> => {
  const res = await http.post(MAIN_END_POINT.RECOMMEND_PREFERENCE, { k })
  return res.data
}

// 비로그인 유저 - 위치 기반 추천
export const fetchLocationRecommendations = async (
  latitude: number,
  longitude: number,
  radius: number,
): Promise<PropertyRecommendResponse> => {
  const res = await http.post(MAIN_END_POINT.RECOMMEND_LOCATION, {
    latitude,
    longitude,
    radius,
  })
  return res.data
}
