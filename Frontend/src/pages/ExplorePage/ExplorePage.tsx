// src/pages/ExplorePage/ExplorePage.tsx
import { useEffect, useState } from 'react'
import { useLocation, useSearchParams } from 'react-router-dom'
import Sidebar, { usePropertyStore } from '@/components/ExplorePage/SideBar'
import Map from '@/components/ExplorePage/Map'
import { useSearchParamsStore } from '@/store/searchParamsStore'
import useSidebarStore from '@/store/sidebarStore'
import useFilterStore from '@/store/filterStore'
import {
  fetchNormalSearchWithCoords,
  fetchMatchSearchWithQuery,
} from '@/services/mapService'
import { convertTimeStringToMinutes } from '@/utils/timeUtiles'
import { toast } from 'react-toastify'
import axios from 'axios'
import matchSearchStore from '@/store/matchSearchStore'
import useMatchSearchResultStore from '@/store/searchResultStore'
import MatchMap from '@/components/ExplorePage/MatchMap'

const ExplorePage = () => {
  // React Router hooks
  const location = useLocation()
  const [searchParams] = useSearchParams()

  // Sidebar store hooks
  const { activeTab, setActiveTab, setTitles } = useSidebarStore()

  // 로딩 상태
  const [isLoading, setIsLoading] = useState(false)

  // 검색 파라미터 스토어
  const {
    generalSearchQuery,
    generalSearchLat,
    generalSearchLng,
    customSearchQuery,
    customSearchLat,
    customSearchLng,
    travelTime,
    clearSearchParams,
  } = useSearchParamsStore()

  // 필터 스토어
  const filters = useFilterStore()

  useEffect(() => {
    // URL에서 탭 정보 가져오기
    const tabParam = searchParams.get('tab') as
      | 'normal_search'
      | 'match_search'
      | 'favorites'
      | null

    // ✅ 탭 상태 초기화 (tabParam이 없으면 normal_search로 기본 설정)
    setActiveTab(tabParam ?? 'normal_search')

    // 일반 검색 파라미터가 있고 normal_search 탭이면 검색 실행
    if (generalSearchQuery && tabParam === 'normal_search') {
      console.log(
        '일반 검색 실행:',
        generalSearchQuery,
        generalSearchLat,
        generalSearchLng,
      )

      // API 호출 실행 - 함수 이름 변경
      setIsLoading(true)
      fetchNormalSearchWithCoords(
        generalSearchQuery,
        {
          propertyTypes: filters.propertyTypes,
          dealType: filters.dealType,
          MindepositPrice: filters.MindepositPrice,
          MinmonthlyPrice: filters.MinmonthlyPrice,
          MaxdepositPrice: filters.MaxdepositPrice,
          MaxmonthlyPrice: filters.MaxmonthlyPrice,
          additionalFilters: filters.additionalFilters,
        },
        generalSearchLat,
        generalSearchLng,
      )
        .then((result) => {
          console.log('일반 검색 결과:', result)

          // 결과 처리 - 매물 ID 리스트를 사이드바 스토어에 저장
          if (result && result.properties) {
            // 매물 ID 목록을 문자열 배열로 변환
            const propertyIds = result.properties.map((prop) =>
              prop.id.toString(),
            )

            // 사이드바 스토어에 저장
            setTitles(propertyIds)

            // ✅ 결과 전체 저장
            usePropertyStore.getState().setProperties(result.properties)
          }
        })
        .catch((error) => {
          console.error('일반 검색 오류:', error)
          toast.error('검색 중 오류가 발생했습니다.')
        })
        .finally(() => {
          setIsLoading(false)
        })
    }

    // 맞춤 검색 파라미터가 있고 match_search 탭이면 검색 실행
    if (customSearchQuery && tabParam === 'match_search') {
      console.log(
        '맞춤 검색 실행:',
        customSearchQuery,
        travelTime,
        customSearchLat,
        customSearchLng,
      )

      // 시간 문자열을 분 단위로 변환 (예: "30분" -> 30)
      const timeValue = convertTimeStringToMinutes(travelTime)

      // API 호출 실행 - 함수 이름 변경
      setIsLoading(true)
      fetchMatchSearchWithQuery(
        customSearchQuery,
        timeValue,
        {
          propertyTypes: filters.propertyTypes,
          dealType: filters.dealType,
          MindepositPrice: filters.MindepositPrice,
          MinmonthlyPrice: filters.MinmonthlyPrice,
          MaxdepositPrice: filters.MaxdepositPrice,
          MaxmonthlyPrice: filters.MaxmonthlyPrice,
          additionalFilters: filters.additionalFilters,
        },
        customSearchLat,
        customSearchLng,
      )
        .then((result) => {
          console.log('맞춤 검색 결과:', result)

          // 결과 처리 - 매물 ID 리스트를 사이드바 스토어에 저장
          if (result && result.properties) {
            // 매물 ID 목록을 문자열 배열로 변환
            const propertyIds = result.properties.map((prop) =>
              prop.id.toString(),
            )

            // 사이드바 스토어에 저장
            console.log('🟣 매물 ID 저장 완료:', propertyIds)
            setTitles(propertyIds)

            usePropertyStore.getState().setProperties(result.properties)

            console.log('🟢 매물 리스트 저장 완료:', result.properties)
            useMatchSearchResultStore.getState().setResults(result)

            matchSearchStore.getState().setIsSearching(true)
          }
        })
        .catch((error) => {
          console.error('맞춤 검색 오류:', error)

          if (
            axios.isAxiosError(error) &&
            error.response?.data?.code === 'PROPERTY4013' &&
            !toast.isActive('search-error')
          ) {
            toast.error(
              '검색 결과가 너무 많아요. 매물탐색 페이지에서 좀 더 상세한 조건으로 검색해 주세요!',
              { toastId: 'search-error' },
            )
          } else {
            toast.error('맞춤 검색 중 오류가 발생했습니다.')
          }
        })
        .finally(() => {
          setIsLoading(false)
        })
    }

    // 컴포넌트 언마운트 시 검색 파라미터 초기화 (선택적)
    return () => {
      // clearSearchParams(); // 필요하면 주석 해제
    }
  }, [
    location,
    searchParams,
    generalSearchQuery,
    customSearchQuery,
    travelTime,
    filters,
    setActiveTab,
    setTitles,
  ])

  return (
    <div className="relative h-screen w-screen">
      {/* 로딩 인디케이터 */}
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-20 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg shadow-lg">
            <p className="text-ssaeng-purple font-bold">검색 중...</p>
          </div>
        </div>
      )}

      {/* Sidebar: 슬라이드 될 영역 */}
      <div className="absolute top-0 left-0 h-full z-10">
        <Sidebar />
      </div>

      {/* Map: 항상 고정된 전체 화면
      <div className="absolute top-0 left-0 w-full h-full z-0">
        <Map />
      </div>

      {/* MatchMap: 맞춤 검색 시 나올 화면 */}
      {/* <div className="absolute top-0 left-0 w-full h-full z-0">
        <MatchMap />
      </div> */}

      {/* 조건부 렌더링: tabParam에 따라 Map 또는 MatchMap 렌더링 */}
      {activeTab === 'match_search' ? (
        <div className="absolute top-0 left-0 w-full h-full z-0">
          <MatchMap />
        </div>
      ) : (
        <div className="absolute top-0 left-0 w-full h-full z-0">
          <Map />
        </div>
      )}
    </div>
  )
}

export default ExplorePage
