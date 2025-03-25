import ItemGrid from './ItemGrid'
import SectionTitle from './SectionTitle'

type Listing = {
  id: number
  type: string
  price: string
  floor: string
  address: string
  station: string
  imageUrl?: string
}

// 목업 데이터
const listings: Listing[] = [
  {
    id: 1,
    type: '원룸',
    price: '월세 80/1000 관리비 5만 원',
    floor: '2층/총 8층 | 6평',
    address: '근처 2호선 역삼역 / 2호선, 신분당선 강남역',
    station: '역삼동',
  },
  // 2~8까지 동일하게 추가해도 돼요 (id만 바꾸기)
  {
    id: 2,
    type: '원룸',
    price: '월세 80/1000 관리비 5만 원',
    floor: '2층/총 8층 | 6평',
    address: '근처 2호선 역삼역 / 2호선, 신분당선 강남역',
    station: '역삼동',
  },
  {
    id: 3,
    type: '원룸',
    price: '월세 80/1000 관리비 5만 원',
    floor: '2층/총 8층 | 6평',
    address: '근처 2호선 역삼역 / 2호선, 신분당선 강남역',
    station: '역삼동',
  },
  {
    id: 4,
    type: '원룸',
    price: '월세 80/1000 관리비 5만 원',
    floor: '2층/총 8층 | 6평',
    address: '근처 2호선 역삼역 / 2호선, 신분당선 강남역',
    station: '역삼동',
  },
  {
    id: 5,
    type: '원룸',
    price: '월세 80/1000 관리비 5만 원',
    floor: '2층/총 8층 | 6평',
    address: '근처 2호선 역삼역 / 2호선, 신분당선 강남역',
    station: '역삼동',
  },
  {
    id: 6,
    type: '원룸',
    price: '월세 80/1000 관리비 5만 원',
    floor: '2층/총 8층 | 6평',
    address: '근처 2호선 역삼역 / 2호선, 신분당선 강남역',
    station: '역삼동',
  },
  {
    id: 7,
    type: '원룸',
    price: '월세 80/1000 관리비 5만 원',
    floor: '2층/총 8층 | 6평',
    address: '근처 2호선 역삼역 / 2호선, 신분당선 강남역',
    station: '역삼동',
  },
  {
    id: 8,
    type: '원룸',
    price: '월세 80/1000 관리비 5만 원',
    floor: '2층/총 8층 | 6평',
    address: '근처 2호선 역삼역 / 2호선, 신분당선 강남역',
    station: '역삼동',
  },
]

const RecommendedSection = () => {
  return (
    <section className="mt-2 mb-10">
      <SectionTitle title="역삼동" />
      <ItemGrid listings={listings} />
    </section>
  )
}

export default RecommendedSection
