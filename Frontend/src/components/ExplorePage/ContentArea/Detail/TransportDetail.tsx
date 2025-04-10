import React from 'react'

interface TranportDeatils {
  transportTimeList: number[]
  transportMode: string
  transferCount: number
  target: string
}

const TransportDetail: React.FC<TranportDeatils> = ({
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

export default TransportDetail
