import { useRef, useEffect } from 'react'
import CommunityModal from './Community/CommunityModal'
import useSidebarStore from '@/store/sidebar'

declare global {
  interface Window {
    kakao: any
  }
}

const KakaoMap = () => {

  // 스토어에서 타이틀 가져오기
  const { setTitles, clearTitles } = useSidebarStore.getState();

  const mapRef = useRef<HTMLDivElement>(null)

  // 지도 좌측상단에 지도 중심좌표에 대한 주소정보를 표출하는 함수입니다
  function displayCenterInfo(result: any, status: any) {
    if (status === window.kakao.maps.services.Status.OK) {
      const infoDiv = document.getElementById('centerAddr')

      for (let i = 0; i < result.length; i++) {
        // 행정동의 region_type 값은 'H' 이므로
        if (result[i].region_type === 'H') {
          if (infoDiv) {
            // address_name에서 마지막 부분(법정동) 추출
            const addressParts = result[i].address_name.split(' ')
            const lastPart = addressParts[addressParts.length - 1] // 예: "조원동"

            // HTML에 반영할 텍스트 생성
            infoDiv.innerHTML = `${lastPart} 인근 매물 보기`
          }
          break
        }
      }
    }
  }

  useEffect(() => {
    if (mapRef.current && window.kakao) {
      // 카카오맵 기본 설정
      const options = {
        center: new window.kakao.maps.LatLng(
          37.4867515563965,
          126.925003051758,
        ), // 초기 중심 좌표
        level: 8, // 줌 레벨
        draggable: true,
        scrollwheel: true,
      }

      // 지도 생성
      const map = new window.kakao.maps.Map(mapRef.current, options)

      // 마커 클러스터러를 생성합니다
      const clusterer = new window.kakao.maps.MarkerClusterer({
        map: map, // 마커들을 클러스터로 관리하고 표시할 지도 객체
        averageCenter: true, // 클러스터에 포함된 마커들의 평균 위치를 클러스터 마커 위치로 설정
        calculator: [10, 30, 100, 500], // 마커 개수 기준으로 스타일 구분
        disableClickZoom: true, // 클러스터 마커를 클릭했을 때 지도가 확대되지 않도록 설정한다
        styles: [
          {
              width: '50px',
              height: '50px',
              background: 'rgba(113, 113, 215, 0.70)', // 작은 클러스터 배경색
              borderRadius: '50%',
              color: '#ffffff',
              textAlign: 'center',
              lineHeight: '25px',
          },
          {
              width: '80px',
              height: '80px',
              background: 'rgba(113, 113, 215, 0.70)', // 중간 클러스터 배경색
              borderRadius: '50%',
              color: '#ffffff',
              textAlign: 'center',
              lineHeight: '40px',
          },
          {
              width: '100px',
              height: '100px',
              background: 'rgba(113, 113, 215, 0.70)', // 큰 클러스터 배경색
              borderRadius: '50%',
              color: '#ffffff',
              textAlign: 'center',
              lineHeight: '50px',
          },
          {
              width: '300px',
              height: '300px',
              background: 'rgba(113, 113, 215, 0.70)', // 매우 큰 클러스터 배경색
              borderRadius: '50%',
              color: '#ffffff',
              textAlign: 'center',
              lineHeight: '150px',
          }
      ],
      })

      // JSON 데이터 (샘플 데이터)
      const jsonData = [
        { title: 4412312, lat: 37.49302392, lng: 126.83817015 },
        { title: 4412312, lat: 37.53521202, lng: 126.92564225 },
        { title: 4412312, lat: 37.50975602, lng: 126.89876881 },
        { title: 4412312, lat: 37.53426722, lng: 126.93010821 },
        { title: 4412312, lat: 37.51571358, lng: 126.8254238 },
        { title: 4412312, lat: 37.40241787, lng: 126.80274273 },
        { title: 4412312, lat: 37.53643203, lng: 126.91468706 },
        { title: 4412312, lat: 37.48102335, lng: 126.92712519 },
        { title: 4412312, lat: 37.5539651, lng: 126.89009452 },
        { title: 4412312, lat: 37.43654489, lng: 126.87559288 },
        { title: 4412312, lat: 37.4347616, lng: 126.8816934 },
        { title: 4412312, lat: 37.47034287, lng: 126.95054014 },
        { title: 4412312, lat: 37.40798552, lng: 126.89649427 },
        { title: 4412312, lat: 37.45816811, lng: 126.99180002 },
        { title: 4412312, lat: 37.47493062, lng: 126.8656328 },
        { title: 4412312, lat: 37.42377559, lng: 126.94918993 },
        { title: 4412312, lat: 37.50015794, lng: 126.99661649 },
        { title: 4412312, lat: 37.41755752, lng: 126.81974434 },
        { title: 4412312, lat: 37.49600034, lng: 126.87888899 },
        { title: 4412312, lat: 37.52445709, lng: 126.95593783 },
        { title: 4412312, lat: 37.49082755, lng: 126.95246607 },
        { title: 4412312, lat: 37.55574636, lng: 126.97957421 },
        { title: 4412312, lat: 37.49053221, lng: 126.99235266 },
        { title: 4412312, lat: 37.54351071, lng: 126.83461327 },
        { title: 4412312, lat: 37.53738119, lng: 126.95050368 },
        { title: 4412312, lat: 37.50328253, lng: 126.9021647 },
        { title: 4412312, lat: 37.5352967, lng: 126.99780801 },
        { title: 4412312, lat: 37.53417957, lng: 126.94380023 },
        { title: 4412312, lat: 37.52947919, lng: 126.88050431 },
        { title: 4412312, lat: 37.47775147, lng: 126.98728818 },
        { title: 4412312,  lat: 37.54722749, lng: 126.85220083 },
        { title: 4412312, lat: 37.53792912, lng: 126.9849996 },
        { title: 4412312, lat: 37.42858807, lng: 126.99342058 },
        { title: 4412312, lat: 37.41912694, lng: 126.99273481 },
        { title: 4412312, lat: 37.52276124, lng: 126.85163491 },
        { title: 4412312, lat: 37.41243942, lng: 126.94775608 },
        { title: 4412312, lat: 37.510985, lng: 126.88838387 },
        { title: 4412312, lat: 37.48531172, lng: 126.94596609 },
        { title: 4412312, lat: 37.48527868, lng: 126.80966614 },
        { title: 4412312, lat: 37.45475807, lng: 126.89628068 },
        { title: 4412312, lat: 37.46519146, lng: 126.95945525 },
        { title: 4412312, lat: 37.52125841, lng: 126.94317621 },
        { title: 4412312, lat: 37.53580561, lng: 126.97857746 },
        { title: 4412312, lat: 37.4827119, lng: 126.97644904 },
        { title: 4412312, lat: 37.46874306, lng: 126.81344638 },
        { title: 4412312, lat: 37.48311009, lng: 126.80424352 },
        { title: 4412312, lat: 37.53848797, lng: 126.98595545 },
        { title: 4412312, lat: 37.55054494, lng: 126.83140463 },
        { title: 4412312, lat: 37.50127578, lng: 126.80028708 },
      ]

      // 데이터를 기반으로 마커 생성 및 클러스터링에 추가
      const markers = jsonData.map((data) => {
        const marker = new kakao.maps.Marker({
            title: String(data.title),
            position: new kakao.maps.LatLng(data.lat, data.lng),
            clickable: true, // 클릭 가능하도록 설정
        });

        // 개별 마커에 클릭 이벤트 추가
        kakao.maps.event.addListener(marker, 'click', function () {

            // 지도 중심을 해당 마커의 위치로 이동
            map.setCenter(marker.getPosition());

            // 지도 줌 레벨 변경 (예: 레벨 3로 설정)
            map.setLevel(3);

            // 알림창 표시 (선택 사항)
            // alert(`Marker clicked at ${data.lat}, ${data.lng}`);
        });

        return marker;
      });


      // 클러스터러에 마커들을 추가합니다
      clusterer.addMarkers(markers)

    // 클러스터 클릭 이벤트 추가
    kakao.maps.event.addListener(clusterer, 'clusterclick', function (cluster) {
      // 클릭한 클러스터에 포함된 마커 가져오기
      const includedMarkers = cluster.getMarkers();
          // 포함된 마커들의 title 값 추출
      const markerTitles = includedMarkers.map(marker => marker.getTitle());
      // 스토어에 저장하기 전 배열 초기화
      clearTitles()
          // 스토어에 title 값 저장
      setTitles(markerTitles); // 추출한 title 값을 Zustand 스토어에 저장
      // includedMarkers.forEach(marker => {
      //     console.log(marker.getPosition()); // 각 마커의 위치 정보 출력
      // });
    });



    // 지도 드래그 종료 시 실행될 함수 등록
    kakao.maps.event.addListener(map, 'dragend', function () {

      // Zustand 스토어의 titles 초기화
      clearTitles();
      map.relayout()

    });


      // 주소-좌표 변환 객체를 생성합니다
      const geocoder = new window.kakao.maps.services.Geocoder()

      function searchAddrFromCoords(coords: any, callback: any) {
        // 좌표로 행정동 주소 정보를 요청합니다
        geocoder.coord2RegionCode(coords.getLng(), coords.getLat(), callback)
      }

      // 현재 지도 중심좌표로 주소를 검색해서 지도 좌측 상단에 표시합니다
      searchAddrFromCoords(map.getCenter(), displayCenterInfo)

      // 중심 좌표나 확대 수준이 변경됐을 때 지도 중심 좌표에 대한 주소 정보를 표시하도록 이벤트 등록
      window.kakao.maps.event.addListener(map, 'idle', function () {
        searchAddrFromCoords(map.getCenter(), displayCenterInfo)
      })

      // 화면 크기가 변경될 때 지도를 재정렬
      const handleResize = () => {
        map.relayout()
      }


      // 줌 레벨 변경 이벤트 등록
      kakao.maps.event.addListener(map, 'zoom_changed', function () {
        const level = map.getLevel(); // 현재 줌 레벨 가져오기
        clearTitles()

        if (level > 8) {
            // 줌 레벨이 낮으면(멀리서 보면) 클러스터링 범위를 넓게 설정
            clusterer.setGridSize(120); // 클러스터링 범위를 넓게 설정
            clusterer.setMinClusterSize(1); // 최소 마커 개수 설정 (옵션)

        } else if (level > 5) {
            // 중간 줌 레벨에서는 기본 범위로 설정
            clusterer.setGridSize(100);
            clusterer.setMinClusterSize(1);
            // 줌 레벨이 5보다 크면 마커 숨기기

        } else {
            // 줌 레벨이 높으면(가까이 보면) 개별 마커가 보이도록 설정
            clusterer.setGridSize(30); // 클러스터링 범위를 좁게 설정
            clusterer.setMinClusterSize(1); // 최소 마커 개수를 줄여 개별 표시 가능
        }
      });


      window.addEventListener('resize', handleResize)
      return () => {
        window.removeEventListener('resize', handleResize)
      }
    }
  }, [setTitles, clearTitles])

  return (
<div className="relative w-[95vw] h-screen m-0 p-0">
  {/* 지도 영역 */}
  <div id="map" ref={mapRef} className="relative w-full h-full">
    {/* 주소 정보를 표시할 영역 */}
    <div
      id="centerAddr"
      className="absolute top-[6%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[260px] h-[45px]
       flex-shrink-0 rounded-[6px] bg-[#7171D7] shadow-md flex items-center justify-center text-white font-bold text-sm z-[10]"
    >
      로딩 중...
    </div>
  </div>

  {/* 커뮤니티 영역 */}
  <CommunityModal />
</div>

  )
}

export default KakaoMap
