import { useEffect, useState } from 'react'
import NewTargetModal from './NewTarget'
import EditTargetModal from './EditTarget' // 새로운 주소 수정 모달
import useMatchInfoStore from '@/store/matchInfoStore' // Zustand 스토어 import
import { getTargetAddress, deleteTargetAddress } from '@/services/targetService'
import ReactDOM from 'react-dom' // ReactDOM import 추가
import { X } from 'lucide-react'

interface Address {
  id: number
  address: string
  name: string
  transportMode: string
  travelTime: number
  walkTime: number
  isDefault: boolean // 선택적 속성으로 변경
  latitude: number
  longitude: number
}

interface AddressModalProps {
  isOpen: boolean
  onClose: () => void
}

const AddressModal = ({ isOpen, onClose }: AddressModalProps) => {
  const [addresses, setAddresses] = useState<Address[]>([])
  const [selectedIds, setSelectedIds] = useState<number[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isNewTargetModalOpen, setIsNewTargetModalOpen] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false) // 편집 모드 상태
  const [editAddress, setEditAddress] = useState<Address | null>(null) // 수정할 주소 데이터
  const [notification, setNotification] = useState<string | null>(null)
  const { matchInfos, resetMatchInfos } = useMatchInfoStore()

  const showNotification = (message: string) => {
    setNotification(message)
    setTimeout(() => {
      setNotification(null)
    }, 3000) // 3초 후 알림 사라짐
  }

  // API를 통해 주소 목록 가져오기
  const fetchAddresses = async () => {
    setIsLoading(true)
    try {
      const data = await getTargetAddress()
      setAddresses(data)
    } catch (error) {
      console.error('주소 목록을 불러오는 데 실패했습니다:', error)
      showNotification('주소 목록을 불러오는 데 실패했습니다.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteAddress = async (id: number) => {
    const addressToDelete = addresses.find((addr) => addr.id === id)

    if (addressToDelete?.isDefault) {
      showNotification('기본 타겟 주소는 삭제할 수 없습니다.')
      return // 삭제 로직 중단
    }

    if (window.confirm('정말로 이 주소를 삭제하시겠습니까?')) {
      try {
        await deleteTargetAddress(id)
        showNotification(`주소가 성공적으로 삭제되었습니다.`)
        setAddresses((prev) => prev.filter((address) => address.id !== id))
        setSelectedIds((prev) => prev.filter((selectedId) => selectedId !== id))
      } catch (error) {
        console.error('주소 삭제 실패:', error)
        showNotification('주소 삭제에 실패했습니다.')
      }
    }
  }

  // 모달이 열릴 때 주소 목록을 가져오고 matchInfos에 있는 ID들을 selectedIds에 설정
  useEffect(() => {
    if (isOpen) {
      fetchAddresses().then(() => {
        // fetchAddresses 완료 후 matchInfos의 ID들을 selectedIds에 반영
        const initialSelectedIds = matchInfos.map((match) => match.id)
        setSelectedIds(initialSelectedIds)
      })
    } else {
      // 모달이 닫힐 때 상태 초기화 (선택 사항)
      setSelectedIds([])
      setEditAddress(null)
      setIsEditMode(false)
    }
  }, [isOpen, matchInfos])

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

  // 주소 추가가 완료되었을 때 실행될 함수
  const handleNewTargetClosed = () => {
    fetchAddresses() // 주소 목록 다시 불러오기
    setIsNewTargetModalOpen(false) // 모달 닫기
  }

  const handleAddressUpdated = () => {
    showNotification('주소 정보가 성공적으로 수정되었습니다.')
    fetchAddresses() // 수정 완료 후 목록 다시 불러오기
    setEditAddress(null)
  }

  if (!isOpen) return null // 모달이 열리지 않으면 렌더링하지 않음

  const handleCloseWithStoreUpdate = () => {
    // 선택된 주소 필터링
    const selectedAddresses = addresses.filter((address) =>
      selectedIds.includes(address.id),
    )

    let newMatchInfos: {
      id: number
      address: string
      name: string
      transportMode: string
      travelTime: number
      walkTime: number
      latitude: number
      longitude: number
    }[] = []

    if (selectedAddresses.length > 0) {
      // 선택된 데이터가 있을 경우 기존 로직 유지
      newMatchInfos = selectedAddresses.map((address) => ({
        id: address.id, // 원래 ID 유지
        address: address.address,
        name: address.name,
        transportMode: address.transportMode,
        travelTime: address.travelTime,
        walkTime: address.walkTime,
        latitude: address.latitude, // 위도 포함
        longitude: address.longitude, // 경도 포함
      }))
    } else {
      // 아무것도 선택하지 않았을 경우 깡통 matchInfos 생성
      const newId = Date.now() // 간단하게 현재 시간을 ID로 사용 (실제로는 고유 ID 생성 방식 적용 권장)
      newMatchInfos = [
        {
          id: newId,
          address: '',
          name: '',
          transportMode: '',
          travelTime: 0,
          walkTime: 0,
          latitude: 0,
          longitude: 0,
        },
      ]
    }

    // Zustand 스토어의 matchInfos를 초기화하고 새로운 데이터로 설정
    resetMatchInfos(newMatchInfos)

    onClose() // 모달 닫기
  }

  return ReactDOM.createPortal(
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      {notification && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white py-2 px-4 rounded-md shadow-lg z-10">
          {notification}
        </div>
      )}
      <div className="relative bg-white rounded-xl shadow-2xl w-[420px] h-[588px] max-w-md max-h-[90vh] overflow-y-auto p-6">
        {/* 닫기 버튼 */}
        <button
          className="absolute top-5 right-5 text-gray-500 hover:text-gray-800 text-xl"
          onClick={handleCloseWithStoreUpdate}
        >
          <X />
        </button>

        {/* 헤더 부분 */}
        <div className="flex justify-between mb-3">
          <p className="text-lg font-bold mt-4 mb-1">주소</p>
          <div className="mt-6">
            <button
              className="text-lg font-normal mt-4 mb-1 mr-4"
              onClick={() => setIsEditMode(!isEditMode)}
            >
              {isEditMode ? '편집 완료' : '편집'}
            </button>

            <NewTargetModal
              isOpen={isNewTargetModalOpen}
              onClose={() => handleNewTargetClosed()}
            />
            <button
              className="text-lg font-normal mt-4 mb-1"
              onClick={() => setIsNewTargetModalOpen(true)}
            >
              추가하기
            </button>
          </div>

          {/* 주소 수정 모달 */}
          {editAddress && (
            <EditTargetModal
              isOpen={!!editAddress}
              onClose={handleAddressUpdated}
              isDefault={editAddress.isDefault}
              initialData={{
                id: editAddress.id,
                address: editAddress.address,
                name: editAddress.name,
                transportMode: editAddress.transportMode,
                travelTime: editAddress.travelTime,
                walkTime: editAddress.walkTime,
              }}
            />
          )}
        </div>

        {/* 로딩 상태 표시 */}
        {isLoading ? (
          <p className="text-center text-gray-500">로딩 중...</p>
        ) : addresses.length === 0 ? (
          <p className="text-center mt-[200px] text-gray-500">
            표시할 주소가 없습니다.
          </p>
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
                    selectedIds.includes(info.id) ? 'bg-gray-300' : 'bg-white'
                  }`}
                >
                  {/* 주소 섹션 */}
                  <div className="flex items-center justify-between mb-2">
                    <div>
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
                  <div className="mb-2">
                    <h3 className="text-sm font-bold text-gray-700">교통</h3>
                    <span className="text-xs font-semibold text-purple-600 bg-purple-100 px-2 py-1 rounded-lg inline-block mb-1">
                      {info.transportMode}
                    </span>
                    <p className="text-xs text-gray-700">
                      전체 이동시간:
                      <span className="text-blue-600 bg-blue-100 px-2 py-1 rounded-lg inline-block">
                        {info.travelTime}분 이내
                      </span>
                    </p>
                    <p className="text-xs text-gray-700">
                      도보 이동시간:
                      <span className="text-blue-600 bg-blue-100 px-2 py-1 rounded-lg inline-block">
                        {info.walkTime}분 이내
                      </span>
                    </p>
                  </div>

                  {/* 기본 주소 여부 섹션 */}
                  <div className="mt-2">
                    기본 주소 여부:{' '}
                    {info.isDefault ? (
                      <div className="ml-2 bg-green-500 text-white py-1 px-2 rounded-md text-xs font-semibold">
                        예
                      </div>
                    ) : (
                      <div className="ml-2 bg-red-500 text-white py-1 px-2 rounded-md text-xs font-semibold">
                        아니오
                      </div>
                    )}
                  </div>
                </button>
              </div>
            ))}
          </ul>
        )}
      </div>
    </div>,
    document.body,
  )
}

export default AddressModal
