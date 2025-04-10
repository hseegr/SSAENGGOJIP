import { useEffect, useState } from 'react'
import NewTargetModal from './NewTarget'
import EditTargetModal from './EditTarget'
import useMatchInfoStore from '@/store/matchInfoStore'
import { getTargetAddress, deleteTargetAddress } from '@/services/targetService'
import ReactDOM from 'react-dom'
import { Check, X, ChevronRight } from 'lucide-react'
import { toast } from 'react-toastify'

interface Address {
  id: number
  address: string
  name: string
  transportMode: string
  travelTime: number
  walkTime: number
  isDefault: boolean
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
  const [isEditMode, setIsEditMode] = useState(false)
  const [editAddress, setEditAddress] = useState<Address | null>(null)
  const [notification, setNotification] = useState<string | null>(null)
  const { matchInfos, resetMatchInfos } = useMatchInfoStore()

  const showNotification = (message: string) => {
    setNotification(message)
    setTimeout(() => {
      setNotification(null)
    }, 3000)
  }

  // 주소 목록 가져오기
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
      toast.info('기본 주소는 삭제할 수 없습니다.', {
        style: {
          width: '500px',
        },
      })
      // showNotification('기본 타겟 주소는 삭제할 수 없습니다.')
      return
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

  // 모달이 열릴 때 주소 목록 가져오기
  useEffect(() => {
    if (isOpen) {
      fetchAddresses().then(() => {
        const initialSelectedIds = matchInfos.map((match) => match.id)
        setSelectedIds(initialSelectedIds)
      })
    } else {
      setSelectedIds([])
      setEditAddress(null)
      setIsEditMode(false)
    }
  }, [isOpen, matchInfos])

  // 선택 토글 처리
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

  // 주소 추가 완료 핸들러
  const handleNewTargetClosed = () => {
    fetchAddresses()
    setIsNewTargetModalOpen(false)
  }

  // 주소 수정 완료 핸들러
  const handleAddressUpdated = () => {
    showNotification('주소 정보가 성공적으로 수정되었습니다.')
    fetchAddresses()
    setEditAddress(null)
  }

  // 완료 버튼 클릭 핸들러
  const handleComplete = () => {
    const selectedAddresses = addresses.filter((address) =>
      selectedIds.includes(address.id),
    )

    const newMatchInfos = selectedAddresses.length
      ? selectedAddresses.map((address) => ({
          id: address.id,
          address: address.address,
          name: address.name,
          transportMode: address.transportMode,
          travelTime: address.travelTime,
          walkTime: address.walkTime,
          latitude: address.latitude,
          longitude: address.longitude,
        }))
      : [
          {
            id: Date.now(),
            address: '',
            name: '',
            transportMode: '',
            travelTime: 0,
            walkTime: 0,
            latitude: 0,
            longitude: 0,
          },
        ]

    resetMatchInfos(newMatchInfos)
    onClose()
  }

  if (!isOpen) return null

  return ReactDOM.createPortal(
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      {notification && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white py-2 px-4 rounded-md shadow-lg z-10">
          {notification}
        </div>
      )}
      <div className="relative bg-white rounded-xl shadow-2xl w-[420px] h-[588px] max-w-md max-h-[90vh] p-6 flex flex-col">
        {/* 닫기 버튼 */}
        <button
          className="absolute top-5 right-5 text-gray-500 hover:text-gray-800 text-xl"
          onClick={onClose}
        >
          <X />
        </button>

        {/* 헤더 부분 */}
        <div className="flex justify-between mb-3 px-3">
          <p className="text-lg font-bold mt-4 mb-1">내 맞춤 주소 목록</p>
          <div className="mt-6">
            <button
              className="text-ssaeng-purple text-sm font-normal mt-4 mb-1 mr-2 py-1 px-4 border border-ssaeng-purple  overflow-y-auto rounded-md hover:bg-ssaeng-gray-3"
              onClick={() => setIsEditMode(!isEditMode)}
            >
              {isEditMode ? '편집 완료' : '편집'}
            </button>

            <NewTargetModal
              isOpen={isNewTargetModalOpen}
              onClose={handleNewTargetClosed}
            />
            <button
              className="text-ssaeng-purple text-sm font-normal mt-8 mb-1 py-1 px-4 border border-ssaeng-purple rounded-md hover:bg-ssaeng-gray-3"
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
                latitude: editAddress.latitude,
                longitude: editAddress.longitude,
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
          <div className=" overflow-y-auto">
            <ul className="flex-1">
              {' '}
              {/* flex-1로 변경하여 남은 공간 채우기 */}
              {addresses.map((info) => (
                <div key={info.id} className="px-3 mb-4">
                  {/* 주소 카드 */}
                  <div className="flex items-start gap-2">
                    {/* 체크박스 (편집 모드에서는 비활성화) */}
                    <div
                      className={`${!isEditMode ? 'cursor-pointer' : 'opacity-50'}`}
                      onClick={() =>
                        !isEditMode && handleSelectAddress(info.id)
                      }
                    >
                      <div
                        className={`w-5 h-5 rounded-sm border flex items-center justify-center ${
                          selectedIds.includes(info.id)
                            ? 'bg-ssaeng-purple border-ssaeng-purple'
                            : 'border-gray-300'
                        }`}
                      >
                        {selectedIds.includes(info.id) && (
                          <Check size={14} className="text-white" />
                        )}
                      </div>
                    </div>

                    {/* 주소 카드 내용 */}
                    <div className="flex-1 p-4 rounded-lg bg-ssaeng-gray-1 border border-ssaeng-gray-2">
                      {/* 편집 모드일 때 삭제 및 수정 버튼 */}
                      {isEditMode && (
                        <div className="flex justify-end mb-2">
                          <button
                            onClick={() => {
                              setEditAddress(info)
                            }}
                            className="text-ssaeng-purple hover:text-ssaeng-gray-0 text-sm  mr-4"
                          >
                            수정
                          </button>
                          <button
                            onClick={() => void handleDeleteAddress(info.id)}
                            className="text-ssaeng-purple hover:text-ssaeng-gray-0 text-sm"
                          >
                            삭제
                          </button>
                        </div>
                      )}

                      {/* 주소 섹션 */}
                      <h3 className="text-base font-bold text-gray-700">
                        주소
                      </h3>
                      <div className="bg-white p-2 rounded-md mt-1">
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex flex-col">
                            {/* 이름 */}
                            <span className="text-md font-medium text-[#A4D232] bg-[#F7FEE5] px-2 rounded-md w-fit">
                              {info.name}
                            </span>
                            {/* 주소 */}
                            <span className="text-sm text-gray-700 truncate mt-2">
                              {info.address}
                            </span>
                          </div>
                          {/* 오른쪽 화살표 아이콘 */}
                          <span className="text-gray-400 ml-auto">
                            <ChevronRight size={16} />
                          </span>
                        </div>
                      </div>

                      {/* 교통 섹션 */}
                      <h3 className="text-base font-bold text-gray-700 mt-4">
                        교통
                      </h3>
                      <div className="bg-white p-2 rounded-md mt-1">
                        <div className="mb-1 pt-2 pb-2">
                          <div className="mb-2">
                            <span className="text-xs font-semibold text-ssaeng-purple bg-ssaeng-purple-light px-2 py-1 rounded-md inline-block mb-1">
                              {info.transportMode}
                            </span>
                          </div>
                          <div className="flex flex-col">
                            <p className="text-xs text-gray-700 truncate mt-2">
                              전체 이동시간은
                              <span className="mx-2 text-ssaeng-purple bg-ssaeng-purple-light px-2 py-1 rounded-lg inline-block font-medium">
                                {info.travelTime}분 이내
                              </span>
                              이면 좋겠고,
                            </p>
                            <p className="text-xs text-gray-700 truncate mt-2">
                              도보 이동시간은
                              <span className="mx-2 text-ssaeng-purple bg-ssaeng-purple-light px-2 py-1 rounded-lg inline-block font-medium">
                                {info.walkTime}분 이내
                              </span>
                              이면 좋겠어요.
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* 기본 주소 여부 섹션 */}
                      <div className="mt-4 text-xs font-medium text-gray-700 flex items-center justify-center">
                        기본 주소
                        <div className="">
                          {info.isDefault ? (
                            <div>입니다.</div>
                          ) : (
                            <div>가 아닙니다.</div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </ul>
          </div>
        )}

        {/* 완료 버튼 */}
        {!isEditMode && (
          <div className="sticky bottom-0 left-0 right-0 bg-white flex justify-center mt-4 p-2">
            <button
              onClick={handleComplete}
              className="w-full py-3 bg-ssaeng-purple text-white rounded-lg font-bold hover:bg-opacity-90 transition"
            >
              완료
            </button>
          </div>
        )}
      </div>
    </div>,
    document.body,
  )
}

export default AddressModal
