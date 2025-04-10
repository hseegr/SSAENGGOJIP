// hooks/useMain.ts

import { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  fetchLocationRecommendations,
  fetchPreferenceRecommendations,
} from '@/services/mainService'
import { PropertyRecommendResult } from '@/types/main'
import { toast } from 'react-toastify'

// 위치 요청 실패 시 사용할 기본 좌표 (서울시청)
const DEFAULT_LOCATION = {
  latitude: 37.5665,
  longitude: 126.978,
}

// 위치 기반 추천 훅 (비로그인 유저용)
interface UseLocationRecommendationsOptions {
  radius?: number // 검색 반경 (미터)
  useFallback?: boolean // 위치 실패 시 기본 좌표 사용할지 여부
}

export const useLocationRecommendations = ({
  radius = 1000,
  useFallback = true,
}: UseLocationRecommendationsOptions = {}) => {
  const [location, setLocation] = useState<{
    latitude: number
    longitude: number
  } | null>(null)
  const [error, setError] = useState<string | null>(null)

  // 최초 마운트 시 사용자 위치 요청
  useEffect(() => {
    if (!navigator.geolocation) {
      const message = '이 브라우저에서는 위치 정보를 사용할 수 없습니다.'
      setError(message)
      // 중복 토스트 방지
      if (!toast.isActive('location-error')) {
        toast.warn(message, { toastId: 'location-error' })
      }

      if (useFallback) {
        setLocation(DEFAULT_LOCATION)
        if (!toast.isActive('location-fallback')) {
          toast.info('기본 위치로 추천을 불러옵니다.', {
            toastId: 'location-fallback',
          })
        }
      }
      return
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        })
      },
      () => {
        const message = '위치 정보를 가져오는 데 실패했습니다.'
        setError(message)
        // 중복 토스트 방지
        if (!toast.isActive('location-error')) {
          toast.error(message, { toastId: 'location-error' })
        }

        if (useFallback) {
          setLocation(DEFAULT_LOCATION)
          if (!toast.isActive('location-fallback')) {
            toast.info('기본 위치로 추천을 불러옵니다.', {
              toastId: 'location-fallback',
            })
          }
        }
      },
    )
  }, [useFallback])

  // 위치 정보를 기반으로 매물 추천 요청
  const { data, isLoading, isError } = useQuery<PropertyRecommendResult>({
    queryKey: [
      'location-recommendations',
      location?.latitude,
      location?.longitude,
      radius,
    ],
    queryFn: async () => {
      const res = await fetchLocationRecommendations(
        location!.latitude,
        location!.longitude,
        radius,
      )
      return res.result // 수정 포인트
    },
    enabled: !!location, // 위치가 존재할 때만 요청
  })

  return {
    data, // 추천 매물 리스트
    isLoading, // 로딩 중 여부
    isError, // 요청 에러 여부
    error, // 위치 요청 관련 에러 메시지
    location, // 최종 사용된 위치 정보
  }
}

// 선호도 기반 추천 훅 (로그인 유저용) - 사용자 위치 사용 버전
export const usePreferenceRecommendations = (k: number = 8) => {
  const [location, setLocation] = useState<{
    latitude: number
    longitude: number
  } | null>(null)
  const [error, setError] = useState<string | null>(null)
  const radius = 1000 // 기본 반경 1km

  // 사용자 위치 가져오기
  useEffect(() => {
    if (!navigator.geolocation) {
      setLocation(DEFAULT_LOCATION) // 지오로케이션을 지원하지 않는 경우 기본 위치 사용
      return
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        })
      },
      () => {
        // 위치 가져오기 실패 시 기본 위치 사용
        setLocation(DEFAULT_LOCATION)
      },
    )
  }, [])

  // 위치 정보와 k 값으로 추천 매물 요청
  const { data, isLoading, isError } = useQuery<PropertyRecommendResult>({
    queryKey: [
      'preference-recommendations',
      location?.latitude,
      location?.longitude,
      radius,
      k,
    ],
    queryFn: async () => {
      if (!location) throw new Error('위치 정보가 없습니다')
      const res = await fetchPreferenceRecommendations(
        location.latitude,
        location.longitude,
        radius,
        k,
      )
      return res.result
    },
    enabled: !!location, // 위치가 존재할 때만 요청
  })

  return {
    data,
    isLoading,
    isError,
    error,
    location,
  }
}
