import { useEffect, useState } from 'react'
import NewTargetModal from './NewTarget'
import EditTargetModal from './EditTarget' // 새로운 주소 수정 모달
import useMatchInfoStore from '@/store/matchInfoStore' // Zustand 스토어 import

interface Address {
  id: number
  address: string
  name: string
  transportMode: string
  travelTime: number
  walkTime: number
  isDefault?: boolean // 선택적 속성으로 변경
}

interface AddressModalProps {
  isOpen: boolean
  onClose: () => void
}

const AddressModal = ({ isOpen, onClose }: AddressModalProps) => {
  // 임시 테스트 데이터
  const testData: Address[] = [
    {
      id: 1,
      address: '서울특별시 강남구 테헤란로 212',
      name: '캠퍼스',
      transportMode: 'SUBWAY',
      travelTime: 60,
      walkTime: 10,
      isDefault: true,
    },
    {
      id: 2,
      address: '서울특별시 강남구 테헤란로 212',
      name: '캠퍼스',
      transportMode: 'SUBWAY',
      travelTime: 60,
      walkTime: 10,
      isDefault: false,
    },
    {
      id: 3,
      address: '서울특별시 종로구 종로1길 50',
      name: '사무실',
      transportMode: 'BUS',
      travelTime: 30,
      walkTime: 5,
      isDefault: false,
    },
    {
      id: 4,
      address: '서울특별시 마포구 마포대로 33',
      name: '집',
      transportMode: 'WALK',
      travelTime: 15,
      walkTime: 15,
      isDefault: false,
    },
  ]

  // 상태 초기화에 임시 데이터 사용
  const [addresses, setAddresses] = useState<Address[]>(testData) // API 대신 임시 데이터 사용
  const [selectedIds, setSelectedIds] = useState<number[]>([]) // 선택된 주소 ID들
  const [isLoading] = useState<boolean>(false) // 로딩 상태 관리 (임시 데이터라 로딩 없음)
  const [isNewTargetModalOpen, setIsNewTargetModalOpen] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false) // 편집 모드 상태
  const [editAddress, setEditAddress] = useState<Address | null>(null) // 수정할 주소 데이터
  // Zustand 스토어에서 상태 및 액션 가져오기
  const { resetMatchInfos } = useMatchInfoStore()

  // 새로운 주소 추가
  const handleAddNewTarget = (newAddress: Omit<Address, 'id'>) => {
    setAddresses((prev) => [...prev, { id: prev.length + 1, ...newAddress }])
  }

  const handleDeleteAddress = async (id: number) => {
    try {
      // API로 DELETE 요청 보내기
      const response = await fetch(`/target-addresses/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      console.log(`주소 ID ${id}가 성공적으로 삭제되었습니다.`)

      // 로컬 상태 업데이트
      setAddresses((prev) => prev.filter((address) => address.id !== id))
      setSelectedIds((prev) => prev.filter((selectedId) => selectedId !== id)) // 선택된 ID에서도 제거
    } catch (error) {
      console.error('주소 삭제 실패:', error)
    }
  }

  // 주소 수정 완료
  const handleEditComplete = (updatedAddress: Omit<Address, 'id'>) => {
    if (!editAddress) return

    setAddresses((prev) =>
      prev.map((address) =>
        address.id === editAddress.id
          ? { ...address, ...updatedAddress }
          : address,
      ),
    )
    setEditAddress(null) // 수정 대상 초기화
    setIsEditMode(false) // 편집 모드 종료
  }

  // 기본 주소 초기화
  useEffect(() => {
    if (!isOpen) return // 모달이 열릴 때만 초기화

    // 기본 주소를 초기 선택 상태로 설정
    const defaultIds = addresses
      .filter((item) => item.isDefault)
      .map((item) => item.id)
    setSelectedIds(defaultIds)
  }, [isOpen, addresses])
  //   // editAddressId가 변경될 때 selectedAddress 업데이트
  //   useEffect(() => {
  //     if (editAddressId !== null) {
  //       const foundAddress = addresses.find(
  //         (address) => address.id === editAddressId,
  //       )
  //       setSelectedAddress(foundAddress ?? null)
  //     }
  //   }, [editAddressId, addresses])

  // 주소 선택/취소 핸들러
  const handleSelectAddress = (id: number) => {
    if (selectedIds.includes(id)) {
      // 이미 선택된 경우 -> 선택 취소
      setSelectedIds((prev) => prev.filter((selectedId) => selectedId !== id))
    } else {
      // 새로 선택 -> 최대 2개까지만 허용
      if (selectedIds.length < 2) {
        setSelectedIds((prev) => [...prev, id])
      } else {
        alert('최대 2개의 주소까지만 선택 가능해요.')
      }
    }
  }

  if (!isOpen) return null // 모달이 열리지 않으면 렌더링하지 않음

  const handleCloseWithStoreUpdate = () => {
    // 선택된 주소 필터링
    const selectedAddresses = addresses.filter((address) =>
      selectedIds.includes(address.id),
    )

    // 선택된 데이터를 기반으로 새로운 matchInfos 생성
    const newMatchInfos = selectedAddresses.map((address) => ({
      id: address.id, // 원래 ID 유지
      address: address.address,
      name: address.name,
      transportMode: address.transportMode,
      travelTime: address.travelTime,
      walkTime: address.walkTime,
    }))

    // Zustand 스토어의 matchInfos를 초기화하고 새로운 데이터로 설정
    resetMatchInfos(newMatchInfos)

    onClose() // 모달 닫기
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg relative h-3/4 w-1/4 overflow-y-auto">
        {/* 닫기 버튼 */}
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
          onClick={handleCloseWithStoreUpdate}
        >
          ✕
        </button>

        {/* 헤더 부분 */}
        <div className="flex justify-between mb-3">
          <p>주소</p>
          <button onClick={() => setIsNewTargetModalOpen(true)}>
            추가하기
          </button>
          <button onClick={() => setIsEditMode(!isEditMode)}>
            {isEditMode ? '편집 완료' : '편집'}
          </button>
          <NewTargetModal
            isOpen={isNewTargetModalOpen}
            onClose={() => setIsNewTargetModalOpen(false)}
            addNewAddress={handleAddNewTarget}
          />
          {/* 주소 수정 모달 */}
          {editAddress && (
            <EditTargetModal
              isOpen={!!editAddress}
              onClose={() => setEditAddress(null)}
              initialData={{
                address: editAddress.address,
                name: editAddress.name,
                transportMode: editAddress.transportMode,
                travelTime: editAddress.travelTime,
                walkTime: editAddress.walkTime,
              }}
              editAddress={handleEditComplete}
            />
          )}
        </div>

        {/* 로딩 상태 표시 */}
        {isLoading ? (
          <p className="text-center text-gray-500">로딩 중...</p>
        ) : addresses.length === 0 ? (
          <p className="text-center text-gray-500">표시할 주소가 없습니다.</p>
        ) : (
          /* 주소 목록 */
          <ul>
            {addresses.map((info) => (
              <div key={info.id} className="mb-6 p-4 rounded-lg shadow-md">
                {/* 편집 모드일 때 삭제 및 수정 버튼 */}
                {isEditMode && (
                  <div className="flex justify-between mb-2">
                    <button
                      onClick={() => void handleDeleteAddress(info.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      삭제
                    </button>
                    <button
                      onClick={() => {
                        setEditAddress(info) // 수정 대상 설정
                      }}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      수정
                    </button>
                  </div>
                )}

                {/* 주소 카드 */}
                <button
                  onClick={
                    () =>
                      isEditMode
                        ? setEditAddress(info) // 편집 모드에서는 수정 대상 설정
                        : handleSelectAddress(info.id) // 선택/취소 토글
                  }
                  className={`p-4 rounded-lg shadow-md cursor-pointer ${
                    selectedIds.includes(info.id)
                      ? 'bg-gray-300' // 선택된 경우 배경색 어두움
                      : 'bg-white' // 선택되지 않은 경우 배경색 밝음
                  }`}
                >
                  {/* 주소 섹션 */}
                  <h3 className="text-lg font-bold mb-2">주소</h3>
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                      {/* 이름 */}
                      <span className="text-md font-semibold text-green-600 bg-green-100 px-2 py-1 rounded-lg inline-block">
                        {info.name}
                      </span>
                      {/* 주소 */}
                      <span className="text-sm text-gray-700 ml-3 truncate">
                        {info.address}
                      </span>
                    </div>
                    {/* 오른쪽 화살표 아이콘 */}
                    <span className="text-gray-400 ml-auto">{'>'}</span>
                  </div>

                  {/* 교통 섹션 */}
                  <h3 className="text-lg font-bold mt-4 mb-2">교통</h3>
                  <div className="flex flex-col text-gray-700">
                    {/* 교통 수단 */}
                    <span className="text-xs font-semibold text-purple-600 bg-purple-100 px-2 py-1 rounded-lg inline-block mb-2">
                      {info.transportMode}
                    </span>

                    {/* 전체 이동 시간 */}
                    <p className="text-sm mb-1">
                      전체 이동시간은{' '}
                      <span className="text-blue-600 bg-blue-100 px-2 py-1 rounded-lg inline-block">
                        {info.travelTime}분 이내
                      </span>{' '}
                      이면 좋겠고,
                    </p>

                    {/* 도보 이동 시간 */}
                    <p className="text-sm">
                      도보 이동시간은{' '}
                      <span className="text-blue-600 bg-blue-100 px-2 py-1 rounded-lg inline-block">
                        {info.walkTime}분 이내
                      </span>{' '}
                      이면 좋겠어요.
                    </p>
                  </div>

                  {/* 기본 주소 여부 섹션 */}
                  <div className="mt-4 flex items-center">
                    기본 주소 여부:{' '}
                    {info.isDefault ? (
                      <span className="ml-2 text-green-600 font-semibold">
                        예
                      </span>
                    ) : (
                      <span className="ml-2 text-red-600 font-semibold">
                        아니오
                      </span>
                    )}
                  </div>
                </button>
              </div>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

export default AddressModal
