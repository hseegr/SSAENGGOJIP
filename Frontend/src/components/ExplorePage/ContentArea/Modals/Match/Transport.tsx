import React, { useEffect } from 'react'

interface TransportProps {
  transportMode: string
  setTransportMode: React.Dispatch<React.SetStateAction<string>>
  travelTime: number
  setTravelTime: React.Dispatch<React.SetStateAction<number>>
  walkTime: number
  setWalkTime: React.Dispatch<React.SetStateAction<number>>
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
    // 최초 접속 시 transportMode에 따라 버튼 활성화
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
  }

  const handleWalkingTimeChange = (time: string) => {
    if (time === '10분 이내') {
      setWalkTime(10)
    } else if (time === '20분 이내') {
      setWalkTime(20)
    } else if (time === '30분 이내') {
      setWalkTime(30)
    } else {
      setWalkTime(0)
    }
  }

  return (
    <div className="space-y-6">
      {/* 교통 수단 선택 */}
      <div>
        <h2 className="text-lg font-bold mb-4">교통</h2>
        <div className="flex space-x-4">
          <button
            onClick={() => handleTransportTypeChange('지하철')}
            className={`py-2 px-4 rounded-lg ${
              transportMode === '지하철'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700'
            }`}
          >
            지하철
          </button>
          <button
            onClick={() => handleTransportTypeChange('자차')}
            className={`py-2 px-4 rounded-lg ${
              transportMode === '자차'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700'
            }`}
          >
            자차
          </button>
          <button
            onClick={() => handleTransportTypeChange('도보')}
            className={`py-2 px-4 rounded-lg ${
              transportMode === '도보'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700'
            }`}
          >
            도보
          </button>
        </div>
      </div>

      {/* 총 이동 시간 설정 */}
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-2">
          희망 전체 이동 시간
        </h3>
        <input
          type="range"
          min="0"
          max="60"
          value={travelTime}
          onChange={(e) => setTravelTime(Number(e.target.value))}
          className="w-full"
        />
        <p className="text-sm text-gray-500 mt-1">{travelTime}분 이하</p>
      </div>

      {/* 도보 이동 시간 설정 */}
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-2">
          희망 도보 이동 시간
        </h3>
        <div className="flex space-x-4">
          {['10분 이내', '20분 이내', '30분 이내', '상관없음'].map((time) => (
            <button
              key={time}
              onClick={() => handleWalkingTimeChange(time)}
              className={`py-2 px-4 rounded-lg ${
                walkTime ===
                {
                  '10분 이내': 10,
                  '20분 이내': 20,
                  '30분 이내': 30,
                  상관없음: 0,
                }[time]
                  ? 'bg-purple-500 text-white'
                  : 'bg-gray-200 text-gray-700'
              }`}
            >
              {time}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Transport
