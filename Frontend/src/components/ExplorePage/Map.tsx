// import { useState, useRef, useEffect } from 'react'
// import CommunityModal from './Community/CommunityModal'
// import useSidebarStore from '@/store/sidebar'
// import { fetchAllData } from '@/services/mapService'

// declare global {
//   interface Window {
//     kakao: any
//   }
// }
// const KakaoMap = () => {
//   // 스토어에서 타이틀 가져오기
//   const { setTitles, clearTitles, setActiveTab } = useSidebarStore.getState()
//   const [jsonData, setJsonData] = useState<any[]>([])
//   useEffect(() => {
//     const loadMapData = async () => {
//       try {
//         const data = await fetchAllData()
//         setJsonData(data)
//         // jsonData 값은 여기서 확인할 수 없음
//       } catch (error) {
//         console.error('매물 정보를 불러오는 중 오류 발생:', error)
//       }
//     }

//     loadMapData()
//   }, [])

//   const mapRef = useRef<HTMLDivElement>(null)

//   useEffect(() => {
//     if (mapRef.current && window.kakao) {
//       // 카카오맵 기본 설정
//       const options = {
//         center: new window.kakao.maps.LatLng(
//           37.4867515563965,
//           126.925003051758,
//         ), // 초기 중심 좌표
//         level: 3, // 줌 레벨
//         draggable: true,
//         scrollwheel: true,
//       }

//       // 지도 생성
//       const map = new window.kakao.maps.Map(mapRef.current, options)
//       // 마커 클러스터러를 생성합니다
//       const clusterer = new window.kakao.maps.MarkerClusterer({
//         map: map, // 마커들을 클러스터로 관리하고 표시할 지도 객체
//         gridSize: 100, // 클러스터 포함 범위
//         averageCenter: true, // 클러스터에 포함된 마커들의 평균 위치를 클러스터 마커 위치로 설정
//         calculator: [10, 30, 100, 500], // 마커 개수 기준으로 스타일 구분
//         disableClickZoom: true, // 클러스터 마커를 클릭했을 때 지도가 확대되지 않도록 설정한다
//         styles: [
//           {
//             width: '20px',
//             height: '20px',
//             background: 'rgba(113, 113, 215, 0.70)', // 작은 클러스터 배경색
//             borderRadius: '50%',
//             color: '#ffffff',
//             textAlign: 'center',
//             lineHeight: '25px',
//           },
//           {
//             width: '40px',
//             height: '40px',
//             background: 'rgba(113, 113, 215, 0.70)', // 중간 클러스터 배경색
//             borderRadius: '50%',
//             color: '#ffffff',
//             textAlign: 'center',
//             lineHeight: '40px',
//           },
//           {
//             width: '60px',
//             height: '60px',
//             background: 'rgba(113, 113, 215, 0.70)', // 큰 클러스터 배경색
//             borderRadius: '50%',
//             color: '#ffffff',
//             textAlign: 'center',
//             lineHeight: '50px',
//           },
//           {
//             width: '80px',
//             height: '80px',
//             background: 'rgba(113, 113, 215, 0.70)', // 매우 큰 클러스터 배경색
//             borderRadius: '50%',
//             color: '#ffffff',
//             textAlign: 'center',
//             lineHeight: '150px',
//           },
//         ],
//       })

//       // 데이터를 기반으로 마커 생성 및 클러스터링에 추가
//       const markers = jsonData.map((data) => {
//         const marker = new kakao.maps.Marker({
//           title: data.propertyId, // propertyId를 title로 사용
//           position: new kakao.maps.LatLng(data.latitude, data.longitude), // latitude, longitude 사용
//           clickable: true, // 클릭 가능하도록 설정
//         })

//         // 개별 마커에 클릭 이벤트 추가
//         kakao.maps.event.addListener(marker, 'click', function () {
//           // 지도 중심을 해당 마커의 위치로 이동
//           map.setCenter(marker.getPosition())

//           // 지도 줌 레벨 변경 (예: 레벨 3로 설정)
//           map.setLevel(3)

//           // 알림창 표시 (선택 사항)
//           // alert(`Marker clicked at ${data.latitude}, ${data.longitude}`);
//         })
//         return marker
//       })

//       // 클러스터러에 마커들을 추가합니다
//       clusterer.addMarkers(markers)

//       // 클러스터 클릭 이벤트 추가
//       kakao.maps.event.addListener(
//         clusterer,
//         'clusterclick',
//         function (cluster) {
//           // 클릭한 클러스터에 포함된 마커 가져오기
//           const includedMarkers = cluster.getMarkers()
//           // 포함된 마커들의 title 값 추출
//           const markerTitles = includedMarkers.map((marker) =>
//             marker.getTitle(),
//           )
//           // 스토어에 저장하기 전 배열 초기화
//           clearTitles()
//           // 스토어에 title 값 저장
//           setTitles(markerTitles) // 추출한 title 값을 Zustand 스토어에 저장

//           setActiveTab('normal_search')
//           // includedMarkers.forEach(marker => {
//           //     console.log(marker.getPosition()); // 각 마커의 위치 정보 출력
//           // });
//         },
//       )
//       // 지도 움직임 종료 시 상태 초기화
//       kakao.maps.event.addListener(map, 'idle', function () {
//         clearTitles()
//       })

//       // 지도 좌측상단에 지도 중심좌표에 대한 주소정보를 표출하는 함수입니다
//       function displayCenterInfo(result: any, status: any) {
//         if (status === window.kakao.maps.services.Status.OK) {
//           const infoDiv = document.getElementById('centerAddrButton')

//           for (let i = 0; i < result.length; i++) {
//             // 행정동의 region_type 값은 'H' 이므로
//             if (result[i].region_type === 'H') {
//               if (infoDiv) {
//                 // address_name에서 마지막 부분(법정동) 추출
//                 const addressParts = result[i].address_name.split(' ')
//                 const lastPart = addressParts[addressParts.length - 1] // 예: "조원동"

//                 // HTML에 반영할 텍스트 생성
//                 infoDiv.innerHTML = `${lastPart} 인근 매물 보기`
//                 infoDiv.onclick = () => {
//                   geocoder.addressSearch(
//                     result[i].address_name,
//                     function (searchResult, searchStatus) {
//                       if (
//                         searchStatus === window.kakao.maps.services.Status.OK
//                       ) {
//                         const coords = new window.kakao.maps.LatLng(
//                           searchResult[0].y,
//                           searchResult[0].x,
//                         )
//                         map.setCenter(coords)
//                       }
//                     },
//                   )
//                 }
//               }
//               break
//             }
//           }
//         }
//       }
//       // 주소-좌표 변환 객체를 생성합니다
//       const geocoder = new window.kakao.maps.services.Geocoder()

//       function searchAddrFromCoords(coords: any, callback: any) {
//         // 좌표로 행정동 주소 정보를 요청합니다
//         geocoder.coord2RegionCode(coords.getLng(), coords.getLat(), callback)
//       }

//       // 현재 지도 중심좌표로 주소를 검색해서 지도 좌측 상단에 표시합니다
//       searchAddrFromCoords(map.getCenter(), displayCenterInfo)

//       // 중심 좌표나 확대 수준이 변경됐을 때 지도 중심 좌표에 대한 주소 정보를 표시하도록 이벤트 등록
//       window.kakao.maps.event.addListener(map, 'idle', function () {
//         searchAddrFromCoords(map.getCenter(), displayCenterInfo)
//       })

//       // 화면 크기가 변경될 때 지도를 재정렬
//       const handleResize = () => {
//         map.relayout()
//       }

//       // 줌 레벨 변경 이벤트 등록
//       kakao.maps.event.addListener(map, 'zoom_changed', function () {
//         const level = map.getLevel() // 현재 줌 레벨 가져오기
//         clearTitles()

//         if (level > 8) {
//           // 줌 레벨이 낮으면(멀리서 보면) 클러스터링 범위를 넓게 설정
//           clusterer.setGridSize(120) // 클러스터링 범위를 넓게 설정
//           clusterer.setMinClusterSize(1) // 최소 마커 개수 설정 (옵션)
//         } else if (level > 5) {
//           // 중간 줌 레벨에서는 기본 범위로 설정
//           clusterer.setGridSize(100)
//           clusterer.setMinClusterSize(1)
//           // 줌 레벨이 5보다 크면 마커 숨기기
//         } else {
//           // 줌 레벨이 높으면(가까이 보면) 개별 마커가 보이도록 설정
//           clusterer.setGridSize(30) // 클러스터링 범위를 좁게 설정
//           clusterer.setMinClusterSize(1) // 최소 마커 개수를 줄여 개별 표시 가능
//         }
//       })

//       window.addEventListener('resize', handleResize)
//       return () => {
//         window.removeEventListener('resize', handleResize)
//       }
//     }
//   }, [setTitles, clearTitles, setActiveTab, jsonData])

//   return (
//     <div className="relative w-[95vw] h-screen m-0 p-0">
//       {/* 지도 영역 */}
//       <div id="map" ref={mapRef} className="relative w-full h-full">
//         {/* 주소 정보를 표시할 영역 */}
//         <button
//           id="centerAddrButton"
//           className="absolute top-[6%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[260px] h-[45px]
//        flex-shrink-0 rounded-[6px] bg-[#7171D7] shadow-md flex items-center justify-center text-white font-bold text-sm z-[10]"
//         >
//           로딩 중...
//         </button>
//       </div>

//       {/* 커뮤니티 영역 */}
//       <CommunityModal />
//     </div>
//   )
// }

// export default KakaoMap

import { useState, useRef, useEffect } from 'react'
import useSidebarStore from '@/store/sidebarStore'
import { fetchDataByBounds } from '@/services/mapService' // fetchDataByBounds 사용
import usePropertyStore from '@/store/propertyStore'

declare global {
  interface Window {
    kakao: any
  }
}

const KakaoMap = () => {
  const { setTitles, clearTitles, setActiveTab } = useSidebarStore()
  const { setProperties } = usePropertyStore()
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstance = useRef<any>(null) // 지도 인스턴스를 저장할 ref
  const clustererInstance = useRef<any>(null) // 클러스터러 인스턴스를 저장할 ref

  const searchAddrFromCoords = (coords: any, callback: any) => {
    if (window.kakao) {
      const geocoder = new window.kakao.maps.services.Geocoder()
      geocoder.coord2RegionCode(coords.getLng(), coords.getLat(), callback)
    }
  }

  const displayCenterInfo = (result: any, status: any) => {
    if (status === window.kakao.maps.services.Status.OK) {
      const infoDiv = document.getElementById('centerAddrButton')
      const geocoder = new window.kakao.maps.services.Geocoder()

      for (let i = 0; i < result.length; i++) {
        if (result[i].region_type === 'H') {
          if (infoDiv) {
            const addressParts = result[i].address_name.split(' ')
            const lastPart = addressParts[addressParts.length - 1]
            infoDiv.innerHTML = `${lastPart} 인근 매물 보기`
            infoDiv.onclick = () => {
              geocoder.addressSearch(
                result[i].address_name,
                (searchResult: any, searchStatus: any) => {
                  if (searchStatus === window.kakao.maps.services.Status.OK) {
                    const coords = new window.kakao.maps.LatLng(
                      searchResult[0].y,
                      searchResult[0].x,
                    )
                    mapInstance.current.setCenter(coords)
                  }
                },
              )
            }
          }
          break
        }
      }
    }
  }

  const loadMapDataByBounds = async (bounds: any, center: any) => {
    try {
      const sw = bounds.getSouthWest()
      const ne = bounds.getNorthEast()

      const data = await fetchDataByBounds(bounds, {
        latitude: center.getLat(),
        longitude: center.getLng(),
        southWestLatitude: sw.getLat(),
        southWestLongitude: sw.getLng(),
        northEastLatitude: ne.getLat(),
        northEastLongitude: ne.getLng(),
      })
      setProperties(data)
      updateMarkers(data)
    } catch (error) {
      console.error('지도 영역 기반 매물 정보를 불러오는 중 오류 발생:', error)
    }
  }

  const updateMarkers = (data: any[]) => {
    if (mapInstance.current && clustererInstance.current && window.kakao) {
      clustererInstance.current.clear() // 기존 마커 제거
      const markers = data.map((item) => {
        const marker = new window.kakao.maps.Marker({
          title: item.propertyId,
          position: new window.kakao.maps.LatLng(item.latitude, item.longitude),
          clickable: true,
        })

        window.kakao.maps.event.addListener(marker, 'click', function () {
          mapInstance.current.setCenter(marker.getPosition())
          mapInstance.current.setLevel(3)
        })
        return marker
      })
      clustererInstance.current.addMarkers(markers)
    }
  }

  const updateClustererGridSize = (level: number) => {
    if (clustererInstance.current) {
      if (level > 8) {
        clustererInstance.current.setGridSize(2000)
      } else if (level > 5) {
        clustererInstance.current.setGridSize(800)
      } else {
        clustererInstance.current.setGridSize(200)
      }
    }
  }

  // 지도 초기화 및 데이터 로딩
  useEffect(() => {
    if (mapRef.current && window.kakao && !mapInstance.current) {
      const initialCenter = new window.kakao.maps.LatLng(
        37.4867515563965,
        126.925003051758,
      )
      const options = {
        center: initialCenter,
        level: 3,
        draggable: true,
        scrollwheel: true,
      }

      const map = new window.kakao.maps.Map(mapRef.current, options)
      mapInstance.current = map

      const clusterer = new window.kakao.maps.MarkerClusterer({
        map: map,
        gridSize: 200,
        averageCenter: true,
        calculator: [25, 50, 100, 300, 600],
        disableClickZoom: true,
        styles: [
          {
            width: '40px',
            height: '40px',
            background: 'rgba(113, 113, 215, 0.70)',
            borderRadius: '50%',
            color: '#ffffff',
            textAlign: 'center',
            lineHeight: '25px',
          },
          {
            width: '60px',
            height: '60px',
            background: 'rgba(113, 113, 215, 0.70)',
            borderRadius: '50%',
            color: '#ffffff',
            textAlign: 'center',
            lineHeight: '40px',
          },
          {
            width: '80px',
            height: '80px',
            background: 'rgba(113, 113, 215, 0.70)',
            borderRadius: '50%',
            color: '#ffffff',
            textAlign: 'center',
            lineHeight: '50px',
          },
          {
            width: '120px',
            height: '120px',
            background: 'rgba(113, 113, 215, 0.70)',
            borderRadius: '50%',
            color: '#ffffff',
            textAlign: 'center',
            lineHeight: '150px',
          },
          {
            width: '200px',
            height: '200px',
            background: 'rgba(113, 113, 215, 0.70)',
            borderRadius: '50%',
            color: '#ffffff',
            textAlign: 'center',
            lineHeight: '150px',
          },
        ],
      })
      clustererInstance.current = clusterer

      // 최초 로딩 시 중심 좌표로 주소 정보 가져오기
      searchAddrFromCoords(initialCenter, displayCenterInfo)

      // 최초 로딩 시 데이터 로딩 (경계 값 포함)
      const initialBounds = map.getBounds()
      loadMapDataByBounds(initialBounds, initialCenter)

      // 지도 이동 이벤트 리스너
      window.kakao.maps.event.addListener(map, 'idle', () => {
        const bounds = map.getBounds()
        const center = map.getCenter()
        loadMapDataByBounds(bounds, center)
        searchAddrFromCoords(center, displayCenterInfo)
        clearTitles()
      })

      // 줌 레벨 변경 이벤트 리스너
      window.kakao.maps.event.addListener(map, 'zoom_changed', () => {
        const level = map.getLevel()
        clearTitles()
        updateClustererGridSize(level)
      })

      // 클러스터 클릭 이벤트 - 선택된 클러스터의 매물 ID값 추출
      window.kakao.maps.event.addListener(
        clusterer,
        'clusterclick',
        (cluster: any) => {
          // 선택된 클러스터들 ID 추출 및 store에 저장
          const includedMarkers = cluster.getMarkers()
          const markerTitles = includedMarkers.map((marker: any) =>
            marker.getTitle(),
          )
          clearTitles()
          setTitles(markerTitles)
          setActiveTab('normal_search')
        },
      )

      let previouslySelectedOverlay = null
      const originalBackgroundColor = 'rgba(113, 113, 215, 0.7)' // 원래 배경색을 저장할 변수

      // 마우스 오버 시 색 변경
      window.kakao.maps.event.addListener(
        clusterer,
        'clusterover',
        (cluster: any) => {
          const overlay = cluster.getClusterMarker().getContent()
          if (overlay && overlay !== previouslySelectedOverlay) {
            overlay.style.backgroundColor = 'lightgreen' // 마우스 오버 시 원하는 색상
          }
        },
      )
      // 마우스 아웃 시 색 변경
      window.kakao.maps.event.addListener(
        clusterer,
        'clusterout',
        (cluster: any) => {
          const overlay = cluster.getClusterMarker().getContent()
          if (overlay && overlay !== previouslySelectedOverlay) {
            overlay.style.backgroundColor = originalBackgroundColor // 마우스 아웃 시 원래 색상으로
          } else if (overlay === previouslySelectedOverlay) {
            overlay.style.backgroundColor = 'lightgreen' // 선택된 클러스터는 유지
          }
        },
      )

      // 클러스터 클릭 이벤트 - 선택된 클러스터의 디자인 변경
      window.kakao.maps.event.addListener(
        clusterer,
        'clusterclick',
        (cluster: any) => {
          const currentOverlay = cluster.getClusterMarker().getContent()
          // 현재 배경색과 유사한 테두리 색상 추출 (rgba에서 rgb로 변환)
          // 배경색을 연두색으로 변경
          // overlay.style.backgroundColor = 'lightgreen'
          // 이전에 선택된 오버레이가 있다면 원래 색으로 되돌리기
          if (previouslySelectedOverlay) {
            previouslySelectedOverlay.style.backgroundColor =
              originalBackgroundColor
          }

          // 현재 선택된 오버레이의 원래 배경색 저장 및 색상 변경
          // originalBackgroundColor = currentOverlay.style.backgroundColor
          currentOverlay.style.backgroundColor = 'lightgreen'

          // 현재 선택된 오버레이를 previouslySelectedOverlay 변수에 저장
          previouslySelectedOverlay = currentOverlay
        },
      )

      // 마우스 올렸을때 선택 표시

      // 화면 크기 변경 시 지도 리사이징
      const handleResize = () => {
        map.relayout()
      }
      window.addEventListener('resize', handleResize)
      return () => {
        window.removeEventListener('resize', handleResize)
      }
    }
  }, [setTitles, clearTitles, setActiveTab])

  return (
    <div className="relative w-[100vw] h-screen m-0 p-0">
      {/* 지도 영역 */}
      <div id="map" ref={mapRef} className="relative w-full h-full">
        {/* 주소 정보를 표시할 영역 */}
        <button
          id="centerAddrButton"
          className="absolute top-[6%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[260px] h-[45px]
          flex-shrink-0 rounded-[6px] bg-[#7171D7] shadow-md flex items-center justify-center text-white font-bold text-sm z-[10]"
        >
          로딩 중...
        </button>
      </div>
      {/* 커뮤니티 영역 */}
      {/* <CommunityModal /> */}
    </div>
  )
}

export default KakaoMap
