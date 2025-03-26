import { useRef, useEffect } from 'react'
import CommunityModal from './Community/CommunityModal'

declare global {
  interface Window {
    kakao: any
  }
}

const KakaoMap = () => {
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
        level: 4, // 줌 레벨
        draggable: true,
        scrollwheel: true,
      }

      // 지도 생성
      const map = new window.kakao.maps.Map(mapRef.current, options)

      // 마커 클러스터러를 생성합니다
      const clusterer = new window.kakao.maps.MarkerClusterer({
        map: map, // 마커들을 클러스터로 관리하고 표시할 지도 객체
        averageCenter: true, // 클러스터에 포함된 마커들의 평균 위치를 클러스터 마커 위치로 설정
        minLevel: 8, // 클러스터 할 최소 지도 레벨
      })

      // JSON 데이터 (샘플 데이터)
      const jsonData = [
        { lat: 37.49302392, lng: 126.83817015 },
        { lat: 37.53521202, lng: 126.92564225 },
        { lat: 37.50975602, lng: 126.89876881 },
        { lat: 37.53426722, lng: 126.93010821 },
        { lat: 37.51571358, lng: 126.8254238 },
        { lat: 37.40241787, lng: 126.80274273 },
        { lat: 37.53643203, lng: 126.91468706 },
        { lat: 37.48102335, lng: 126.92712519 },
        { lat: 37.5539651, lng: 126.89009452 },
        { lat: 37.43654489, lng: 126.87559288 },
        { lat: 37.4347616, lng: 126.8816934 },
        { lat: 37.47034287, lng: 126.95054014 },
        { lat: 37.40798552, lng: 126.89649427 },
        { lat: 37.45816811, lng: 126.99180002 },
        { lat: 37.47493062, lng: 126.8656328 },
        { lat: 37.42377559, lng: 126.94918993 },
        { lat: 37.50015794, lng: 126.99661649 },
        { lat: 37.41755752, lng: 126.81974434 },
        { lat: 37.49600034, lng: 126.87888899 },
        { lat: 37.52445709, lng: 126.95593783 },
        { lat: 37.49082755, lng: 126.95246607 },
        { lat: 37.55574636, lng: 126.97957421 },
        { lat: 37.49053221, lng: 126.99235266 },
        { lat: 37.54351071, lng: 126.83461327 },
        { lat: 37.53738119, lng: 126.95050368 },
        { lat: 37.50328253, lng: 126.9021647 },
        { lat: 37.5352967, lng: 126.99780801 },
        { lat: 37.53417957, lng: 126.94380023 },
        { lat: 37.52947919, lng: 126.88050431 },
        { lat: 37.47775147, lng: 126.98728818 },
        { lat: 37.54722749, lng: 126.85220083 },
        { lat: 37.53792912, lng: 126.9849996 },
        { lat: 37.42858807, lng: 126.99342058 },
        { lat: 37.41912694, lng: 126.99273481 },
        { lat: 37.52276124, lng: 126.85163491 },
        { lat: 37.41243942, lng: 126.94775608 },
        { lat: 37.510985, lng: 126.88838387 },
        { lat: 37.48531172, lng: 126.94596609 },
        { lat: 37.48527868, lng: 126.80966614 },
        { lat: 37.45475807, lng: 126.89628068 },
        { lat: 37.46519146, lng: 126.95945525 },
        { lat: 37.52125841, lng: 126.94317621 },
        { lat: 37.53580561, lng: 126.97857746 },
        { lat: 37.4827119, lng: 126.97644904 },
        { lat: 37.46874306, lng: 126.81344638 },
        { lat: 37.48311009, lng: 126.80424352 },
        { lat: 37.53848797, lng: 126.98595545 },
        { lat: 37.55054494, lng: 126.83140463 },
        { lat: 37.50127578, lng: 126.80028708 },
      ]

      // 데이터를 기반으로 마커 생성 및 클러스터링
      const markers = jsonData.map((data) => {
        return new window.kakao.maps.Marker({
          position: new window.kakao.maps.LatLng(data.lat, data.lng),
        })
      })

      // 클러스터러에 마커들을 추가합니다
      clusterer.addMarkers(markers)

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

      window.addEventListener('resize', handleResize)
      return () => {
        window.removeEventListener('resize', handleResize)
      }
    }
  }, [])

  return (
    <div className="relative w-[95vw] h-screen m-0 p-0">
      {/* 지도 영역 */}
      <div id="map" ref={mapRef} className="w-full h-full" />

      {/* 주소 정보를 표시할 영역 */}
      <div
        id="centerAddr"
        className="fixed top-[12%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[260px] h-[45px]
         flex-shrink-0 rounded-[6px] bg-[#7171D7] shadow-md flex items-center justify-center text-white font-bold text-sm z-[10]"
      >
        로딩 중...
      </div>
      {/* 커뮤니티 영역 */}
      <CommunityModal />
    </div>
  )
}

export default KakaoMap
