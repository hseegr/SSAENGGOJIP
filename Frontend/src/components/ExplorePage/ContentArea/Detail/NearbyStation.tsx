import React, { useEffect } from 'react'

// 역 정보를 나타내는 타입
interface Station {
  id: number | string // 역 ID (고유값)
  name: string // 역 이름
  line: string // 호선 이름
}

const NearbyStations: React.FC<{ stations: Station[] }> = ({ stations }) => {
  // 호선 색상 매핑 함수
  const getLineColor = (line: string): string => {
    const lineColors: Record<string, string> = {
      '1호선': 'bg-[#00498B] text-white',
      '2호선': 'bg-[#009246] text-white',
      '3호선': 'bg-[#F36630] text-white',
      '4호선': 'bg-[#00A2D1] text-white',
      '5호선': 'bg-[#A064A3] text-white',
      '6호선': 'bg-[#9E4510] text-white',
      '7호선': 'bg-[#5D6519] text-white',
      '8호선': 'bg-[#D6406A] text-white',
      '9호선': 'bg-[#8E764B] text-white',
      경춘선: 'bg-[#29bfd0] text-white',
      인천1호선: 'bg-[#6E98BB] text-white',
      중앙선: 'bg-[#29bfd0] text-white',
      경의중앙선: 'bg-[#29bfd0] text-white',
      신분당선: 'bg-[#BB1833] text-white',
      공항철도: 'bg-[#006D9D] text-white',
      우이신설선: 'bg-[#c6bf28] text-white',
      의정부선: 'bg-[#FF850D] text-white',
      서해선: 'bg-[#81A914] text-white',
      인천2호선: 'bg-[#95BEE6] text-white',
      수인분당선: 'bg-[#F7D056] text-white',
      분당선: 'bg-[#F7D056] text-white',
      경부선: 'bg-[#00498B] text-white',
      경원선: 'bg-[#4088c9] text-white',
      과천선: 'bg-[#4b92d1] text-white',
      공항철도1호선: 'bg-[#006D9D] text-white',
      일산선: 'bg-[#F36630] text-white',
    }
    return lineColors[line] || 'bg-gray-500 text-black' // 기본 색상 설정
  }

  useEffect(() => {
    console.log('들어온 역들, stations', stations)
  })
  // 역 데이터를 그룹화하여 같은 이름의 역을 묶음
  const groupedStations = stations.reduce<Record<string, Station[]>>(
    (acc, station) => {
      acc[station.name] = acc[station.name] || []
      acc[station.name].push(station)
      return acc
    },
    {},
  )

  return (
    <div className="mb-6">
      {/* 헤더 */}
      <h2 className="text-lg font-bold mb-4">매물 인근 지하철역</h2>

      {/* 그룹화된 역 정보 */}
      {Object.entries(groupedStations).length > 0 ? (
        <ul className="space-y-4">
          {Object.entries(groupedStations).map(([name, lines]) => (
            <li key={name} className="flex items-center border p-2 rounded-md">
              {/* 왼쪽: 호선 아이콘 */}
              <div className="flex space-x-2">
                {lines.map((lineInfo) => (
                  <span
                    key={lineInfo.line}
                    className={`px-2 py-1 rounded-full text-sm font-small ${getLineColor(lineInfo.line)}`}
                  >
                    {lineInfo.line}
                  </span>
                ))}
              </div>
              {/* 오른쪽: 역 이름 */}
              <span className="ml-auto font-medium text-gray-800">{name}</span>
            </li>
          ))}
        </ul>
      ) : (
        // 역 정보가 없을 때
        <p className="text-gray-500 text-center">
          인근 지하철역 정보를 찾을 수 없습니다.
        </p>
      )}
    </div>
  )
}

export default NearbyStations
