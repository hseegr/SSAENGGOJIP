import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { MapPin } from 'lucide-react'
import useMatchInfoStore from '@/store/matchInfoStore'
import { getTransportTime } from '@/services/propertyDetailService'
import TransportDetail from './TransportDetail'
import TransportTimeBar from './TransportTimeBar'
import DetailAddressModal from './DetailAddressModal'

interface TrafficInfoProps {
  trafficData: TrafficData // 구체적인 타입으로 변경
}

interface TrafficData {
  id: number // 고유 ID
  address: string // 주소
  area: number // 면적 (㎡)
  dealType: '월세' | '전세' | '매매' // 거래 유형
  facilities: string[] // 시설 목록 (빈 배열 가능)
  floor: string // 층수 (문자열로 표시됨)
  imageUrls: string[] // 이미지 URL 배열
  maintenancePrice: number // 관리비 (원 단위)
  name: string // 매물 이름
  price: number // 보증금 (원 단위)
  propertyType: string // 매물 유형 (예: "오피스텔")
  rentPrice?: number // 월세 금액 (원 단위, 월세가 아닌 경우 undefined일 수 있음)
  stations: StationInfo[] // 주변 역 정보 배열
  totalFloor: string // 총 층수 (문자열로 표시됨)
  transportInfos: TransportInfo[] // 교통 정보 배열
}

interface StationInfo {
  name: string // 역 이름
  distance: number // 거리 (단위 예시: m 또는 km)
}

interface TransportInfo {
  type: string // 교통수단 유형 (예: 버스, 지하철 등)
  line?: string // 노선 이름 (지하철의 경우, 예: "2호선")
  timeToStation?: number // 소요 시간 (분 단위)
}

const TransportInfo: React.FC<TrafficInfoProps> = ({ trafficData }) => {
  const { setValue, watch } = useForm<{ address: string }>()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { matchInfos } = useMatchInfoStore()
  const [transportTime, setTransportTime] = useState(null)
  const [isLoadingTime, setIsLoadingTime] = useState(false) // 로딩 상태 추가
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAddressSearched, setIsAddressSearched] = useState(false)
  const [initialModalPage, setInitialModalPage] = useState(1)
  const [transportType, setTransportType] = useState('')

  const handleNextAddress = () => {
    if (matchInfos && currentIndex < matchInfos.length - 1) {
      setCurrentIndex(currentIndex + 1)
    }
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setInitialModalPage(1) // 모달 닫을 때 초기 페이지 상태 리셋
  }
  const handlePrevAddress = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
    }
  }

  useEffect(() => {
    const fetchTransportTime = async () => {
      console.log('매물 간 거리 구하기')
      setIsLoadingTime(true) // 로딩 시작

      const transportationType = matchInfos[currentIndex]?.transportMode
      let koreanTransportationType = transportationType

      switch (transportationType) {
        case 'SUBWAY':
          koreanTransportationType = '지하철'
          break
        case '지하철':
          koreanTransportationType = '지하철'
          break
        case 'CAR':
          koreanTransportationType = '자차'
          break
        case 'WALK':
          koreanTransportationType = '도보'
          break
        case '도보':
          koreanTransportationType = '도보'
          break
        case '자차':
          koreanTransportationType = '자차'
          break
        default:
          break
      }

      const tmp = {
        latitude: matchInfos[currentIndex]?.latitude,
        longitude: matchInfos[currentIndex]?.longitude,
        propertyId: trafficData.id,
        transportationType: koreanTransportationType,
      }
      console.log('매물 거리 구할때 payload', tmp)

      try {
        const response = await getTransportTime(tmp)
        console.log('받아온 데이터에요', response)
        setTransportTime(response) // 실제 결과 데이터 저장
      } catch (error) {
        console.error('교통 시간 정보 가져오기 실패:', error)
        setTransportTime({}) // 에러 발생 시 빈 객체 또는 에러 상태 저장
      } finally {
        setIsLoadingTime(false) // 로딩 완료
      }
    }

    if (matchInfos && matchInfos.length > 0 && trafficData?.id) {
      fetchTransportTime()
    }
  }, [trafficData, currentIndex, matchInfos])

  return (
    <>
      <div className="relative w-full flex items-center">
        {matchInfos && matchInfos.length > 0 ? (
          <div className="relative w-full">
            <div className="w-full p-3 border rounded focus:outline flex">
              <div className="rounded-full bg-lime-200 text-lime-800 text-sm font-semibold px-2 mr-2">
                {matchInfos[currentIndex]?.name || ''}
              </div>
              <p>{matchInfos[currentIndex]?.address || ''}</p>
            </div>
            {matchInfos.length > 1 && (
              <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                {currentIndex > 0 && (
                  <button
                    className="text-gray-400 cursor-pointer mr-2"
                    onClick={handlePrevAddress}
                  >
                    {/* 이전 주소 화살표 아이콘 */}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="15 18 9 12 15 6"></polyline>
                    </svg>
                  </button>
                )}
                {currentIndex < matchInfos.length - 1 && (
                  <button
                    className="text-gray-400 cursor-pointer"
                    onClick={handleNextAddress}
                  >
                    {/* 다음 주소 화살표 아이콘 */}{' '}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      {' '}
                      <polyline points="9 18 15 12 9 6"></polyline>{' '}
                    </svg>{' '}
                  </button>
                )}{' '}
              </div>
            )}
          </div>
        ) : (
          <>
            <MapPin
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              value={watch('address') || ''}
              readOnly
              className="w-full pl-10 p-2 border rounded cursor-pointer focus:outline"
              placeholder="도착지 검색 및 교통수단 선택"
              onClick={() => setIsModalOpen(true)}
            />
          </>
        )}
      </div>
      <DetailAddressModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        initialPage={initialModalPage}
        propertyId={trafficData.id}
        setTransportTime={setTransportTime}
        setIsLoadingTime={setIsLoadingTime}
        setIsAddressSearched={setIsAddressSearched}
        setTransportType={setTransportType}
      />

      {/* 그림 */}
      <div className="p-3 my-5 rounded-lg bg-gray-100">
        <h3 className="text-xs text-ssaeng-purple">최소시간</h3>
        <p className="text-lg font-semibold pb-2">
          {isLoadingTime ? (
            <span>계산 중...</span>
          ) : matchInfos &&
            matchInfos.length > 0 &&
            transportTime?.totalTransportTime ? (
            <>
              <span className="text-ssaeng-purple">
                {matchInfos[currentIndex]?.name}
              </span>
              까지{' '}
              <span className="text-ssaeng-purple">
                {transportTime.totalTransportTime}분
              </span>
              ✨ 걸려요!
            </>
          ) : isAddressSearched ? (
            transportTime?.totalTransportTime > 0 ? (
              <>
                <span className="text-ssaeng-purple">선택한 위치</span> 까지{' '}
                <span className="text-ssaeng-purple">
                  {transportTime.totalTransportTime}분
                </span>
                ✨ 걸려요!
              </>
            ) : (
              <span>
                경로를 찾을 수 없거나, 교통 정보를 불러오지 못했습니다.
              </span>
            )
          ) : (
            <span>
              출발지를 검색해서
              <br />
              교통 정보를 알아보세요
            </span>
          )}
        </p>

        {/* 하단 흰색 박스 */}
        {transportTime?.totalTransportTime > 0 &&
          transportTime?.transportTimeList && (
            <div className="mb-2 bg-white rounded-lg p-2 pb-6">
              <TransportTimeBar
                transportTimeList={transportTime.transportTimeList}
                totalTime={transportTime.totalTransportTime}
              />
              {matchInfos[currentIndex]?.transportMode && (
                <TransportDetail
                  transportTimeList={transportTime.transportTimeList}
                  transportMode={matchInfos[currentIndex]?.transportMode}
                  transferCount={transportTime.transferCount}
                  target={matchInfos[currentIndex].name}
                />
              )}
              {transportType && (
                <TransportDetail
                  transportTimeList={transportTime.transportTimeList}
                  transportMode={transportType}
                  transferCount={transportTime.transferCount}
                  target={'목표 지점'}
                />
              )}
            </div>
          )}
      </div>
    </>
  )
}

export default TransportInfo
