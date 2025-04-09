import React, { useEffect, useState } from 'react'
import DaumPostcodeEmbed, { Address } from 'react-daum-postcode'
import { useForm } from 'react-hook-form'
import { MapPin } from 'lucide-react'
import useMatchInfoStore from '@/store/matchInfoStore'
import { getTransportTime } from '@/services/propertyDetailService'

interface AddressModalProps {
  setValue: (field: string, value: string) => void
  isOpen: boolean
  onClose: () => void
}

const AddressModal: React.FC<AddressModalProps> = ({
  isOpen,
  onClose,
  setValue,
}) => {
  const handleComplete = (data: Address) => {
    let fullAddress = data.address
    let extraAddress = ''

    if (data.addressType === 'R') {
      if (data.bname) extraAddress += data.bname
      if (data.buildingName) {
        extraAddress += extraAddress
          ? `, ${data.buildingName}`
          : data.buildingName
      }
      fullAddress += extraAddress ? ` (${extraAddress})` : ''
    }
    setValue('address', fullAddress)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96 relative">
        <button
          className="absolute top-2 right-2 text-gray-600 text-xl"
          onClick={onClose}
        >
          &times;
        </button>
        <h2 className="text-lg font-semibold mb-4">주소 검색</h2>
        <DaumPostcodeEmbed onComplete={handleComplete} />
      </div>
    </div>
  )
}

const TransportDetail: React.FC<any> = ({
  transportTimeList,
  transportMode,
  transferCount,
  target,
}) => {
  if (!transportTimeList || transportTimeList.length === 0) {
    return null
  }

  const getKoreanTransportationType = (mode: string) => {
    switch (mode) {
      case 'WALK':
        return '도보'
      case '도보':
        return '도보'
      case 'SUBWAY':
        return '지하철'
      case '지하철':
        return '지하철'
      case 'CAR':
        return '자차'
      case '자차':
        return '자차'
      default:
        return '알 수 없음'
    }
  }

  // steps 동적 생성
  const steps = []
  if (transportTimeList.length === 1) {
    // 길이가 1일 경우: walk, car, 또는 기타
    steps.push({
      type: transportMode,
      mode: getKoreanTransportationType(transportMode),
      destination: '집',
    })
    steps.push({
      type: transportMode,
      mode: getKoreanTransportationType(transportMode),
      destination: '설정 주소',
    })
  } else if (transportTimeList.length === 3) {
    // 길이가 3일 경우: walk-subway-walk
    steps.push({ type: 'WALK', mode: '도보', destination: '집' })
    steps.push({
      type: transportMode,
      mode: getKoreanTransportationType(transportMode),
      destination: '',
    })
    steps.push({ type: 'WALK', mode: '도보', destination: target })
  }

  const getIcon = (type: string) => {
    switch (type) {
      case 'WALK':
        return (
          <span role="img" aria-label="walking">
            🚶‍➡️
          </span>
        )
      case '도보':
        return (
          <span role="img" aria-label="walking">
            🚶‍➡️
          </span>
        )
      case 'SUBWAY':
        return (
          <span role="img" aria-label="subway">
            🚉
          </span>
        )
      case '지하철':
        return (
          <span role="img" aria-label="subway">
            🚉
          </span>
        )
      case 'CAR':
        return (
          <span role="img" aria-label="car">
            🚗
          </span>
        )
      case '자차':
        return (
          <span role="img" aria-label="car">
            🚗
          </span>
        )
      default:
        return (
          <span role="img" aria-label="unknown">
            ❓
          </span>
        )
    }
  }

  return (
    <div className="bg-white pt-6 px-2 rounded-lg">
      {steps.map((step, index) => (
        <React.Fragment key={index}>
          {/* 공과 설명 */}
          <div className="flex items-center">
            <div
              className={`w-2 h-2 rounded-full ${
                step.type === 'SUBWAY' ? 'bg-[#AFAFFF]' : 'bg-gray-300'
              }`}
            ></div>
            <div className="ml-2 flex items-center">
              {getIcon(step.type)} <span className="ml-1">{step.mode}</span>
              {step.destination && (
                <span className="ml-2 text-sm text-gray-400">
                  {step.destination}
                </span>
              )}
            </div>
            {step.type === 'SUBWAY' &&
              transferCount !== undefined &&
              transferCount > 0 && (
                <>
                  <span className="ml-2 text-sm text-gray-400"> 환승 횟수</span>
                  <span className="ml-2 px-3 text-sm font-bold bg-[rgba(175,175,255,0.3)] text-ssaeng-purple rounded-full">
                    {transferCount}번
                  </span>
                </>
              )}
          </div>

          {/* 선 (마지막 단계에는 선을 표시하지 않음) */}
          {index < steps.length - 1 && (
            <div className="px-1">
              <div className="w-px h-6 bg-gray-300"></div>
            </div>
          )}
        </React.Fragment>
      ))}
    </div>
  )
}

interface TrafficInfoProps {
  trafficData: any // 필요에 따라 더 구체적인 타입으로 변경
}

const AddressForm: React.FC<TrafficInfoProps> = ({ trafficData }) => {
  const { setValue, watch } = useForm<{ address: string }>()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { matchInfos } = useMatchInfoStore()
  const [transportTime, setTransportTime] = useState(null)
  const [isLoadingTime, setIsLoadingTime] = useState(false) // 로딩 상태 추가
  const [currentIndex, setCurrentIndex] = useState(0)

  const handleNextAddress = () => {
    if (matchInfos && currentIndex < matchInfos.length - 1) {
      setCurrentIndex(currentIndex + 1)
    }
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

  const TransportTimeBar = ({
    transportTimeList,
    totalTime,
  }: {
    transportTimeList: number[]
    totalTime: number
  }) => {
    const segments =
      transportTimeList.length > 0 ? transportTimeList : [totalTime]
    const segmentWidths = segments.map((time) =>
      totalTime > 0 ? `${(time / totalTime) * 100}%` : '0%',
    )

    return (
      <div className="relative w-full h-5 rounded-full overflow-hidden mt-3">
        {segmentWidths.map((width, index) => (
          <div
            key={index}
            className={`absolute top-0 left-0 h-full ${
              index === 1 ? 'bg-[#AFAFFF]' : 'bg-gray-300'
            } flex items-center justify-center text-white text-xs font-semibold`}
            style={{
              width: width,
              left:
                segmentWidths
                  .slice(0, index)
                  .reduce((sum, w) => sum + parseFloat(w), 0) + '%',
            }}
          >
            {segments[index]}분
          </div>
        ))}
      </div>
    )
  }

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
        <AddressModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          setValue={setValue}
        />
      </div>

      {/* 그림 */}
      <div className="p-3 my-5 rounded-lg bg-gray-100">
        <h3 className="text-xs text-ssaeng-purple">최소시간</h3>
        <p className="text-lg font-semibold pb-2">
          {isLoadingTime ? (
            <span>계산 중...</span>
          ) : transportTime?.totalTransportTime ? (
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
          ) : (
            <span>검색에 실패했어요</span> // 실패 메시지
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
            </div>
          )}
      </div>
    </>
  )
}

export default AddressForm
