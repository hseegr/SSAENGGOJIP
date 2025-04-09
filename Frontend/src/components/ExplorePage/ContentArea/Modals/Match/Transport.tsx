import React, { useEffect } from 'react'

interface TransportProps {
  transportMode: string
  setTransportMode: React.Dispatch<React.SetStateAction<string>>
  travelTime: number
  setTravelTime: React.Dispatch<React.SetStateAction<number>>
  walkTime: number | null
  setWalkTime: React.Dispatch<React.SetStateAction<number>>
}

// 스타일 (이전 컴포넌트에서 가져옴)
const getSliderStyle = (value: number) => ({
  background: `linear-gradient(to right, #8779f8 ${(value / 120) * 100}%, #e3e0fa ${(value / 120) * 100}%)`,
})

const formatTimeLabel = (value: number) => {
  if (value < 60) return `${value}분 이내`
  if (value % 60 === 0) return `${value / 60}시간 이내`
  const hours = Math.floor(value / 60)
  const minutes = value % 60
  return `${hours}시간 ${minutes}분 이내`
}

const Transport: React.FC<TransportProps> = ({
  transportMode,
  setTransportMode,
  travelTime,
  setTravelTime,
  walkTime,
  setWalkTime,
}) => {
  useEffect(() => {
    console.log(transportMode)
    // 최초 접속 시 transportMode에 따라 버튼 활성화 (선택적으로 필요하다면)
    if (transportMode === 'SUBWAY') {
      handleTransportTypeChange('지하철')
    } else if (transportMode === 'CAR') {
      handleTransportTypeChange('자차')
    } else if (transportMode === 'WALK') {
      handleTransportTypeChange('도보')
    }
  }, [])

  const handleTransportTypeChange = (type: string) => {
    setTransportMode(type)
    // 이동 수단이 변경되어도 도보 시간은 초기화하지 않음
  }

  const handleWalkingTimeChange = (time: string) => {
    if (time === '10분 이내') {
      setWalkTime(10)
    } else if (time === '20분 이내') {
      setWalkTime(20)
    } else if (time === '30분 이내') {
      setWalkTime(30)
    } else {
      setWalkTime(999) // '상관없음'을 이전 컴포넌트와 유사하게 큰 값으로 처리
    }
  }

  return (
    <div className="flex flex-col items-center gap-y-8 mt-6">
      <div className="flex space-x-4 justify-center">
        <button
          onClick={() => handleTransportTypeChange('지하철')}
          className={`py-2 px-4 rounded-md font-medium ${
            transportMode === '지하철'
              ? 'bg-ssaeng-purple text-white'
              : 'bg-gray-100 text-gray-500 hover:bg-gray-200 border border-gray-200'
          }`}
        >
          지하철
        </button>
        <button
          onClick={() => handleTransportTypeChange('자차')}
          className={`py-2 px-4 rounded-md font-medium ${
            transportMode === '자차'
              ? 'bg-ssaeng-purple text-white'
              : 'bg-gray-100 text-gray-500 hover:bg-gray-200 border border-gray-200'
          }`}
        >
          자차
        </button>
        <button
          onClick={() => handleTransportTypeChange('도보')}
          className={`py-2 px-4 rounded-md font-medium ${
            transportMode === '도보'
              ? 'bg-ssaeng-purple text-white'
              : 'bg-gray-100 text-gray-500 hover:bg-gray-200 border border-gray-200'
          }`}
        >
          도보
        </button>
      </div>

      {/* 총 이동 시간 설정 */}
      <div className="text-left w-80 relative">
        <p className="text-sm font-semibold mb-2">희망 전체 이동 시간</p>
        <div className="absolute right-0 -top-1 text-xs text-ssaeng-purple">
          {formatTimeLabel(travelTime)}
        </div>
        <input
          type="range"
          min={0}
          max={120}
          step={10}
          value={travelTime}
          onChange={(e) => setTravelTime(Number(e.target.value))}
          style={getSliderStyle(travelTime)}
          className="w-full h-2 rounded-full bg-ssaeng-purple-light appearance-none
              [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4
              [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full
              [&::-webkit-slider-thumb]:bg-ssaeng-purple"
        />
        <div className="flex justify-between text-sm mt-1 text-gray-500">
          <span>0분</span>
          <span>2시간 이내</span>
        </div>
      </div>

      {/* 도보 이동 시간 설정 (항상 표시) */}
      <div className="text-left w-70">
        <p className="text-sm font-semibold mb-2">희망 도보 이동 시간</p>
        <div className="flex gap-2 flex-wrap">
          {['10분 이내', '20분 이내', '30분 이내', '상관없음'].map((label) => {
            const timeValue =
              label === '10분 이내'
                ? 10
                : label === '20분 이내'
                  ? 20
                  : label === '30분 이내'
                    ? 30
                    : 999
            const isSelected = walkTime === timeValue
            return (
              <button
                key={label}
                onClick={() => handleWalkingTimeChange(label)}
                className={`w-[80px] py-1.5 rounded-md text-sm font-medium border
                    ${
                      isSelected
                        ? 'bg-ssaeng-purple-light text-ssaeng-purple border-ssaeng-purple'
                        : 'bg-gray-100 text-gray-500 border-transparent hover:bg-gray-200'
                    }`}
              >
                {label}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default Transport
