import React from "react";

// 역 정보를 나타내는 타입
interface Station {
  id: number | string; // 역 ID (고유값)
  name: string; // 역 이름
  line: string; // 호선 이름
}


const NearbyStations: React.FC<{stations : Station[]}> = ({ stations }) => {
  // 호선 색상 매핑 함수
  const getLineColor = (line: string): string => {
    const lineColors: Record<string, string> = {
      "1호선": "bg-blue-500 text-white",
      "2호선": "bg-green-500 text-white",
      "3호선": "bg-orange-500 text-white",
      "4호선": "bg-purple-500 text-white",
      "분당선": "bg-yellow-500 text-black",
      // 기타 호선 색상 추가 가능
    };
    return lineColors[line] || "bg-gray-500 text-white"; // 기본 색상 설정
  };

  // 역 데이터를 그룹화하여 같은 이름의 역을 묶음
  const groupedStations = stations.reduce<Record<string, Station[]>>((acc, station) => {
    acc[station.name] = acc[station.name] || [];
    acc[station.name].push(station);
    return acc;
  }, {});

  return (
    <div className="mb-6">
      {/* 헤더 */}
      <h2 className="text-lg font-bold mb-4">매물 인근 지하철역</h2>

      {/* 그룹화된 역 정보 */}
      {Object.entries(groupedStations).length > 0 ? (
        <ul className="space-y-4">
          {Object.entries(groupedStations).map(([name, lines]) => (
            <li key={name} className="flex items-center border p-4 rounded-md">
              {/* 왼쪽: 호선 아이콘 */}
              <div className="flex space-x-2">
                {lines.map((lineInfo) => (
                  <span
                    key={lineInfo.line}
                    className={`px-2 py-1 rounded-full text-sm font-medium ${getLineColor(lineInfo.line)}`}
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
  );
};

export default NearbyStations;
