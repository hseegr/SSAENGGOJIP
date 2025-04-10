import React, { useEffect } from 'react'

interface TransportProps {
  transportMode: string
  setTransportMode: React.Dispatch<React.SetStateAction<string>>
}

const Transport: React.FC<TransportProps> = ({
  transportMode,
  setTransportMode,
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
    </div>
  )
}

export default Transport
