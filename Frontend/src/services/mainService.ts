import { PropertyRecommendResponse } from '@/types/main'
import { MAIN_END_POINT } from './endPoints'
import http from './http-common'

// 로그인 유저 - 선호도 기반 추천
export const fetchPreferenceRecommendations = async (
  latitude: number,
  longitude: number,
  radius: number = 1000,
  k: number = 10,
): Promise<PropertyRecommendResponse> => {
  const res = await http.post(MAIN_END_POINT.RECOMMEND_PREFERENCE, {
    latitude,
    longitude,
    radius,
    k,
  })
  return res.data
}

// 비로그인 유저 - 위치 기반 추천
export const fetchLocationRecommendations = async (
  latitude: number,
  longitude: number,
  radius: number = 1000,
): Promise<PropertyRecommendResponse> => {
  const res = await http.post(MAIN_END_POINT.RECOMMEND_LOCATION, {
    latitude,
    longitude,
    radius,
  })
  return res.data
}
