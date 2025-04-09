import { Property } from '@/types/main'
import ItemGrid from './ItemGrid'
import SectionTitle from './SectionTitle'
import { useUserStore } from '@/store/userStore'
import {
  useLocationRecommendations,
  usePreferenceRecommendations,
} from '@/hooks/useMain'
import { useEffect } from 'react'
import { toast } from 'react-toastify'

type Listing = {
  id: number
  name: string
  price: string
  area: number
  address: string
  floor: string
  latitude: number
  longitude: number
  mainImage: string | null
  dealType: string
  propertyType: string
}

// 목업 데이터
// const listings: Listing[] = [
//   {
//     id: 1,
//     type: '원룸',
//     price: '월세 80/1000 관리비 5만 원',
//     floor: '2층/총 8층 | 6평',
//     address: '근처 2호선 역삼역 / 2호선, 신분당선 강남역',
//     station: '역삼동',
//   },

//   {
//     id: 2,
//     type: '원룸',
//     price: '월세 80/1000 관리비 5만 원',
//     floor: '2층/총 8층 | 6평',
//     address: '근처 2호선 역삼역 / 2호선, 신분당선 강남역',
//     station: '역삼동',
//   },
//   {
//     id: 3,
//     type: '원룸',
//     price: '월세 80/1000 관리비 5만 원',
//     floor: '2층/총 8층 | 6평',
//     address: '근처 2호선 역삼역 / 2호선, 신분당선 강남역',
//     station: '역삼동',
//   },
//   {
//     id: 4,
//     type: '원룸',
//     price: '월세 80/1000 관리비 5만 원',
//     floor: '2층/총 8층 | 6평',
//     address: '근처 2호선 역삼역 / 2호선, 신분당선 강남역',
//     station: '역삼동',
//   },
//   {
//     id: 5,
//     type: '원룸',
//     price: '월세 80/1000 관리비 5만 원',
//     floor: '2층/총 8층 | 6평',
//     address: '근처 2호선 역삼역 / 2호선, 신분당선 강남역',
//     station: '역삼동',
//   },
//   {
//     id: 6,
//     type: '원룸',
//     price: '월세 80/1000 관리비 5만 원',
//     floor: '2층/총 8층 | 6평',
//     address: '근처 2호선 역삼역 / 2호선, 신분당선 강남역',
//     station: '역삼동',
//   },
//   {
//     id: 7,
//     type: '원룸',
//     price: '월세 80/1000 관리비 5만 원',
//     floor: '2층/총 8층 | 6평',
//     address: '근처 2호선 역삼역 / 2호선, 신분당선 강남역',
//     station: '역삼동',
//   },
//   {
//     id: 8,
//     type: '원룸',
//     price: '월세 80/1000 관리비 5만 원',
//     floor: '2층/총 8층 | 6평',
//     address: '근처 2호선 역삼역 / 2호선, 신분당선 강남역',
//     station: '역삼동',
//   },
// ]

// API에서 받은 Property를 Listing 형태로 변환하는 함수
const transformToListing = (property: Property): Listing => ({
  id: property.id,
  name: property.name,
  price: `${property.price.toLocaleString()}원`,
  area: property.area,
  address: property.address || '주소 정보 없음',
  floor: `${property.floor}층 |  ${Math.floor(property.area / 3.3058)}평`,
  latitude: property.latitude,
  longitude: property.longitude,
  mainImage: property.mainImage,
  dealType: property.dealType,
  propertyType: property.propertyType,
})

const RecommendedSection = () => {
  // 전역 로그인 상태 가져오기 (Zustand 등에서 관리 중)
  // 로그인 사용자용 선호도 기반 추천 (새로운 파라미터 형식으로 호출)
  const preference = usePreferenceRecommendations(8)
  const location = useLocationRecommendations()
  const isLoggedIn = useUserStore((state) => state.isLoggedIn)

  // 로그인 여부에 따라 적절한 추천 쿼리 훅 호출
  const { data, isLoading, isError, error } = isLoggedIn ? preference : location

  // 에러 발생 시 토스트로 알림
  useEffect(() => {
    if (isError) {
      console.error('❌ 에러 내용:', error) // 이 줄이 핵심!
      toast.error('추천 매물을 불러오지 못했습니다.')
    }
  }, [isError, error])

  // 로딩 중일 때 로딩 메시지 출력
  if (isLoading) return <div>매물 추천 로딩 중...</div>

  // 에러 또는 데이터 없음 시 아무것도 렌더링하지 않음 (토스트만 띄움)
  if (isError) return <div>추천 매물을 불러오지 못했습니다.</div>

  if (!data) {
    console.warn('❌ data가 없습니다:', data)
    return <div>데이터 없음</div>
  }

  // 디버깅용 로그
  // console.log('API 응답:', data)
  // console.log('매물 수:', data.properties.length)

  // 매물 데이터를 UI 카드 형태로 가공
  const listings: Listing[] = data.properties
    .slice(0, 8) // 최대 8개로 제한
    .map(transformToListing)
  //console.log('렌더링될 listings:', listings)

  return (
    <section className="mt-2 mb-10">
      <SectionTitle title={isLoggedIn ? '내 취향' : '내 주변'} />
      <ItemGrid listings={listings} />
    </section>
  )
}

export default RecommendedSection
