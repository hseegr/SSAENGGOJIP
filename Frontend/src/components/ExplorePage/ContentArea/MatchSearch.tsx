import React, { useState, useEffect } from 'react'
import Modal from './Modals/MatchModal'
import AddressModal from './Modals/Match/AddressModal'
import useMatchInfoStore from '@/store/matchInfoStore'
import PropertyFilter from './Modals/Match/PropertyInfo'
import { useUserStore } from '@/store/userStore'
import matchSearchStore from '@/store/matchSearchStore'
import MatchSearchResults from './Match/MatchSearchResult'
import { useSearchParamsStore } from '@/store/searchParamsStore'
import { fetchMatchSearchWithQuery } from '@/services/mapService'
import { convertTimeStringToMinutes } from '@/utils/timeUtiles'
import useFilterStore from '@/store/filterStore'
// import MatchCard from './Match/MatchCard'
import { getTargetAddress } from '@/services/targetService'
import LoadingModal from '@/components/common/LoadingModal'

interface MatchInfo {
  id: number
  address: string
  name: string
  transportMode: string
  travelTime: number
  walkTime: number
  latitude: number
  longitude: number
}

const CustomInfo: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedBoxId, setSelectedBoxId] = useState<number | null>(null)
  const [initialModalPage, setInitialModalPage] = useState(1) // 모달 초기 페이지 상태
  const { isLoggedIn } = useUserStore()
  const { resetMatchInfos, matchInfos, addMatchInfo } = useMatchInfoStore()
  const { isSearching } = matchSearchStore()
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // Zustand 스토어에서 맞춤 검색 파라미터 가져오기
  // 메인 페이지 검색 관련 코드
  const { customSearchQuery, customSearchLat, customSearchLng, travelTime } =
    useSearchParamsStore()

  // 필터 스토어 가져오기
  // 메인 페이지 검색 관련 코드
  const {
    propertyTypes,
    dealType,
    MindepositPrice,
    MinmonthlyPrice,
    MaxdepositPrice,
    MaxmonthlyPrice,
    additionalFilters,
  } = useFilterStore()

  // 맞춤 검색 결과를 위한 상태 추가
  // 메인 페이지 검색 관련 코드
  const [searchResults, setSearchResults] = useState<any[]>([])

  // 최초 렌더링 시 빈 맞춤 정보 슬롯 하나 추가
  useEffect(() => {
    if (isLoggedIn) {
      const fetchTargetAddress = async () => {
        const target = await getTargetAddress() // 비동기 함수로 가정
        console.log(target)
        if (target && target.length > 0) {
          addMatchInfo(target[0].id, target[0]) // 첫 번째 데이터를 초기 데이터로 사용
        } else {
          addMatchInfo() // 타겟 주소 없으면 빈 슬롯 추가
        }
      }

      fetchTargetAddress()
    } else {
      addMatchInfo() // 로그인 안 했으면 빈 슬롯 추가
    }
  }, [isLoggedIn, getTargetAddress, addMatchInfo])

  const handleBoxClick = (id: number, initialPage: 1) => {
    console.log(`Selected Box ID: ${id}, Initial Page: ${initialPage}`)
    setSelectedBoxId(id)
    setInitialModalPage(initialPage) // 초기 페이지 설정
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedBoxId(null)
    setInitialModalPage(1) // 모달 닫을 때 초기 페이지 상태 리셋
  }

  const handleAddBox = () => {
    if (useMatchInfoStore.getState().matchInfos.length >= 2) {
      alert('최대 2개의 주소만 추가할 수 있습니다.')
      return
    }
    const newId = addMatchInfo()
    handleBoxClick(newId)
  }

  const handleAddressModalOpen = () => {
    setIsAddressModalOpen(true)
  }

  const handleAddressModalClose = () => {
    setIsAddressModalOpen(false)
  }

  const handleRemoveBox = (e: React.MouseEvent, id: number) => {
    e.stopPropagation() // 부모 div의 onClick 이벤트 방지
    const confirmed = window.confirm('정말 삭제하시겠습니까?')
    if (confirmed) {
      console.log(`${id} 삭제됨`)
      const updated = matchInfos.filter((info) => info.id !== id)
      resetMatchInfos(updated)

      // 박스가 모두 사라졌다면 빈 박스 하나 다시 추가
      if (updated.length === 0) {
        addMatchInfo()
      }
      // if (matchInfos.length > 1) {
      //   // 2개 이상일 경우 해당 박스 제거
      //   resetMatchInfos(matchInfos.filter((info) => info.id !== id))
      // } else {
      //   // 1개만 있을 경우 내부 정보 초기화 (id는 유지)
      //   resetMatchInfos([
      //     {
      //       id: matchInfos[0].id,
      //       address: '',
      //       name: '',
      //       transportMode: '',
      //       travelTime: 0,
      //       walkTime: 0,
      //       latitude: 0,
      //       longitude: 0,
      //     },
      //   ])
      // }
    }
  }

  // ✅ customSearchQuery 변경 시 자동으로 맞춤 검색 API 호출
  // 메인 페이지 검색 관련 코드
  useEffect(() => {
    const fetchData = async () => {
      if (!customSearchQuery.trim()) return

      try {
        console.log('💬 맞춤 검색 자동 실행 - 쿼리:', customSearchQuery)
        console.log('⏱️ 설정된 시간:', travelTime)

        // 시간 문자열을 숫자로 변환
        const timeValue = convertTimeStringToMinutes(travelTime)

        // API 호출
        const results = await fetchMatchSearchWithQuery(
          customSearchQuery,
          timeValue,
          {
            propertyTypes,
            dealType,
            MindepositPrice,
            MinmonthlyPrice,
            MaxdepositPrice,
            MaxmonthlyPrice,
            additionalFilters,
          },
          customSearchLat,
          customSearchLng,
        )

        console.log('✅ 맞춤 검색 결과:', results)

        // 결과 처리 및 상태 업데이트
        if (results && results.properties) {
          setSearchResults(results.properties)
        } else {
          setSearchResults([])
        }
      } catch (err) {
        console.error('❌ 맞춤 검색 자동 실행 중 오류:', err)
        setSearchResults([])
      }
    }

    fetchData()
  }, [customSearchQuery])

  return (
    <div className="mb-6">
      {/* ✅ 로딩 모달은 항상 렌더 */}
      <LoadingModal isOpen={isLoading} />

      {isSearching ? (
        <MatchSearchResults />
      ) : customSearchQuery ? (
        // 검색어는 있지만 결과가 없는 경우
        <div className="text-center text-gray-500 py-8">
          &quot;{customSearchQuery}&quot; 검색 결과가 없습니다.
        </div>
      ) : (
        <>
          {/* 상단 텍스트와 버튼 */}
          <div className="flex items-center justify-between px-4 mt-6 mb-3">
            <div className="flex">
              <h2 className="text-lg font-bold mr-3">맞춤 정보</h2>
              <button
                onClick={handleAddBox}
                className="flex items-center justify-center w-5 h-5 mt-1 bg-ssaeng-purple text-white text-2xl rounded-lg hover:bg-indigo-500 transition"
              >
                +
              </button>
            </div>
            <div>
              {isLoggedIn && (
                <button
                  className="flex items-center justify-center bg-white border border-ssaeng-purple text-ssaeng-purple hover:border-ssaeng-purple hover:text-ssaeng-purple text-sm px-2 py-1 rounded-md transition"
                  onClick={handleAddressModalOpen}
                >
                  내 맞춤 정보
                </button>
              )}
            </div>
          </div>

          {/* 회색 박스들 */}
          {useMatchInfoStore.getState().matchInfos.map((info: MatchInfo) => (
            <div
              key={info.id}
              className="flex flex-col justify-center items-center w-[92%] max-w-3xl mx-auto h-[296px] bg-gray-100 rounded-lg text-gray-700 cursor-pointer mb-4"
              onClick={() => handleBoxClick(info.id)}
              role="button"
              aria-hidden="true"
            >
              {info.address ||
              info.name ||
              info.transportMode ||
              info.travelTime ||
              info.walkTime ? (
                <>
                  <div className="relative w-full px-4 py-2">
                    <h3 className="text-sm font-semibold mt-3 mb-2">주소</h3>
                    <button
                      className="absolute top-3 right-4 z-[9999] text-gray-400 hover:text-red-500 text-base"
                      onClick={(e) => handleRemoveBox(e, info.id)}
                    >
                      ✖
                    </button>
                    <div
                      className="flex items-center w-full h-[70px] justify-between bg-white px-3 py-2 rounded-lg shadow-md"
                      role="button"
                      aria-hidden="true"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleBoxClick(info.id, 1) // 주소 영역 클릭 시 1페이지로 모달 열기
                      }}
                    >
                      <div className="flex flex-col">
                        <span className="w-fit mb-2 text-xs font-semibold text-ssaeng-green bg-ssaeng-green-light-2 px-2 py-1 rounded-lg inline-block">
                          {info.name}
                        </span>
                        <span className="text-xs text-gray-700 ml-1 truncate">
                          {info.address}
                        </span>
                      </div>
                      <span className="text-gray-400 ml-auto text-base">
                        {'>'}
                      </span>
                    </div>
                  </div>

                  <div className="relative w-full px-4 py-2 mb-4">
                    <h3 className="text-sm font-semibold mb-2">교통</h3>
                    <div
                      className="flex items-center w-full h-[112px] justify-between bg-white px-3 py-2 rounded-lg shadow-md"
                      role="button"
                      aria-hidden="true"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleBoxClick(info.id, 2) // 교통 영역 클릭 시 2페이지로 모달 열기
                      }}
                    >
                      <div className="flex flex-col">
                        <span className="w-fit mt-1 mb-3 text-xs font-semibold text-ssaeng-purple bg-ssaeng-purple-light px-2 py-1 rounded-lg inline-block">
                          {info.transportMode}
                        </span>
                        <p className="text-xs mb-1 ml-1">
                          전체 이동시간은{' '}
                          <span className="text-xs font-medium text-ssaeng-purple bg-ssaeng-purple-light px-1 py-1 rounded-lg inline-block">
                            {info.travelTime}분 이내
                          </span>{' '}
                          이면 좋겠고,
                        </p>
                        <p className="text-xs ml-1">
                          도보 이동시간은{' '}
                          <span className="text-xs font-medium text-ssaeng-purple bg-ssaeng-purple-light px-1 py-1 rounded-lg inline-block">
                            {info.walkTime === 999
                              ? '상관없음'
                              : `${info.walkTime}분 이내`}
                          </span>{' '}
                          이면 좋겠어요.
                        </p>
                      </div>
                      <span className="text-gray-400 ml-auto text-base">
                        {'>'}
                      </span>
                    </div>
                  </div>
                </>
              ) : (
                <span className="flex justify-center items-center w-full inline-block h-[296px] bg-gray-100 rounded-lg text-sm text-gray-500 cursor-pointer hover:bg-gray-300 transition">
                  이곳을 클릭해 맞춤 정보를 설정해주세요.
                </span>
              )}
            </div>
          ))}

          {/* 공통 필터 컴포넌트 */}
          <PropertyFilter setIsLoading={setIsLoading} />

          {/* 모달 컴포넌트 */}
          {selectedBoxId && (
            <Modal
              isOpen={isModalOpen}
              onClose={handleCloseModal}
              boxId={selectedBoxId}
              initialPage={initialModalPage} // 초기 페이지 prop 전달
            />
          )}

          {/* Address Modal 컴포넌트 */}
          {isAddressModalOpen && (
            <AddressModal
              isOpen={isAddressModalOpen}
              onClose={handleAddressModalClose}
            />
          )}
        </>
      )}
    </div>
  )
}

export default CustomInfo
