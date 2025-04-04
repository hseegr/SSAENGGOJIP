import { useEffect, useState } from 'react'
import PropertyGrid from '@/components/common/PropertyGrid'
// import mockProperties from '@/mocks/mockProperty'
import { Button } from '@/components/ui/button'
import { toast } from 'react-toastify'
import CompareModal from '@/components/MyPage/CompareModal'
import { fetchLikedProperties, LikedProperty } from '@/services/propertyService'

const FavoriteListingsTab = () => {
    const [isCompareMode, setIsCompareMode] = useState(false)
    const [selectedIds, setSelectedIds] = useState<number[]>([])
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [likedProperties, setLikedProperties] = useState<LikedProperty[]>([])

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await fetchLikedProperties()
                setLikedProperties(data)
            } catch (error) {
                console.error('관심 매물 조회 실패:', error)
                toast.error('관심 매물을 불러오는데 실패했습니다.')
            }
        }

        fetchData()
    }, [])

    const toggleCompareMode = () => {
        if (isCompareMode) {
            setSelectedIds([]) // 종료 시 선택 초기화
        }
        setIsCompareMode((prev) => !prev)
    }

    const handleSelect = (id: number) => {
        if (selectedIds.includes(id)) {
            setSelectedIds(selectedIds.filter((v) => v !== id))
        } else {
            if (selectedIds.length >= 3) {
                toast.warning('매물은 최대 3개까지 선택할 수 있어요!')
                return
            }
            setSelectedIds([...selectedIds, id])
        }
    }

    const handleCompareClick = () => {
        if (selectedIds.length < 2) {
            toast.info('매물을 2개 이상 선택해야 비교할 수 있어요!')
            return
        }
        setIsModalOpen(true)
    }

    const handleModalClose = () => setIsModalOpen(false)

    return (
        <div className="relative p-10 pb-28">
            <h2 className="text-2xl font-bold text-ssaeng-purple mb-8">관심 매물</h2>

            <PropertyGrid
                // properties={mockProperties}
                properties={likedProperties}
                columns={3}
                isCompareMode={isCompareMode}
                selectedIds={selectedIds}
                onSelect={handleSelect}
            />

            {/* 고정 하단 바 */}
            <div className="fixed bottom-0 left-0 w-full bg-ssaeng-purple text-white px-6 py-4 z-50">
                <div className="max-w-screen-xl mx-auto flex justify-between items-center">
                    <div className="text-sm flex gap-6 items-center flex-wrap">
                        {isCompareMode ? (
                            <>
                                <span className="pr-6">최대 3개까지 비교할 수 있어요!</span>
                                {[0, 1, 2].map((i) => {
                                    const selected = selectedIds[i]
                                    // const property = mockProperties.find((p) => p.id === selected)
                                    const property = likedProperties.find((p) => p.id === selected)
                                    return (
                                        <span
                                            key={i}
                                            className={`px-12 py-2 border-2 rounded-full text-sm ${selected ? 'border-white' : 'border-dashed border-white'
                                                }`}
                                        >
                                            {selected
                                                ? `${i + 1}. ${property?.propertyType} ${property?.dealType === '전세'
                                                    ? `전세 ${property?.price.toLocaleString()}`
                                                    : `월세 ${property?.price.toLocaleString()} / ${property?.rentPrice.toLocaleString()}`
                                                }`
                                                : `${i + 1}. 비교할 매물을 선택해주세요`}
                                        </span>
                                    )
                                })}
                                <Button
                                    variant="ghost"
                                    className="ml-2 text-white bg-white/10 px-5 hover:bg-white/20"
                                    onClick={toggleCompareMode}
                                >
                                    취소
                                </Button>
                                <Button
                                    className="bg-lime-200 text-gray-900 px-5 hover:bg-lime-300"
                                    onClick={handleCompareClick}
                                >
                                    비교하기
                                </Button>
                            </>
                        ) : (
                            <>
                                <span>오른쪽의 비교하기 버튼을 누르고 매물을 선택해 주세요!</span>
                                <Button
                                    className="bg-white text-ssaeng-purple hover:bg-gray-100 px-6"
                                    onClick={toggleCompareMode}
                                >
                                    비교하기
                                </Button>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* 비교 모달 */}
            {isModalOpen && (
                <CompareModal selectedIds={selectedIds} onClose={handleModalClose} />
            )}
        </div>
    )
}

export default FavoriteListingsTab