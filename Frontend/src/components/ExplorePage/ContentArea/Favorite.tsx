import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // 페이지 이동을 위한 useNavigate
import Card from '../SearchCard'; // Card 컴포넌트 임포트

interface Property {
  id: number;
}

const Favorites: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // 로그인 상태 관리
  const [properties, setProperties] = useState<Property[]>([]); // 관심 매물 데이터 관리

  useEffect(() => {
    // 로그인 상태 확인 (임시 데이터로 설정)
    const loggedInUser = localStorage.getItem('user'); // 로컬 스토리지에서 로그인 정보 확인
    setIsLoggedIn(!!loggedInUser);

    if (loggedInUser) {
      // 로그인된 경우 API 응답 시뮬레이션
      const apiResponse = {
        isSuccess: true,
        code: 'COMMON200',
        message: '성공입니다.',
        result: {
          total: 30,
          properties: Array.from({ length: 30 }, (_, i) => ({ id: i + 1 })),
        },
      };
      setProperties(apiResponse.result.properties);
    }
  }, []);

  const navigate = useNavigate();
  
  const handleLogin = () => {
    // 로그인 버튼 클릭 시 처리 (임시)
    localStorage.setItem('user', JSON.stringify({ name: 'Test User' }));
    setIsLoggedIn(true);
    console.log('로그인되었습니다.');
  };

  const handleCompareClick = () => {
    // 매물 비교하기 버튼 클릭 시 페이지 이동
    navigate('/mypage'); // '/compare' 경로로 이동
  };

  return (
    <div className="relative">
      {!isLoggedIn ? (
        <div className="text-center">
          <p className="text-lg text-gray-700 mb-4">
            로그인을 하고 관심 매물을 등록해보세요.
          </p>
          <button
            onClick={handleLogin}
            className="px-4 py-2 bg-blue-500 text-white rounded-md"
          >
            로그인하기
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {properties.map((property) => (
            <Card
              key={property.id}
              id={property.id}
              title={`매물 ${property.id}`}
              propertyType="아파트"
              dealType="매매"
              totalFloor={15}
              floor={5}
              area={25}
              price={50000000 + property.id * 1000000} // 임의 가격
              managementFee={100000}
              imageUrl={`/images/property${property.id}.jpg`} // 임의 이미지 경로
            />
          ))}
          {properties.length === 0 && (
            <p className="text-gray-500">관심 매물이 없습니다.</p>
          )}
        </div>
      )}
            {/* 하단 고정 버튼 */}
            {isLoggedIn && (
        <div className="sticky bottom-0 w-full flex justify-center py-3">
          <button
            onClick={handleCompareClick}
            className="w-full h-[40px] mx-3 bg-ssaeng-purple text-white text-md rounded-md"
          >
            매물 비교하기
          </button>
        </div>
      )}
    </div>
  );
};

export default Favorites;
