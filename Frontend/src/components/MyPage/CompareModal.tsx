import { X } from 'lucide-react'
import PropertyDetail from '@/components/common/property/PropertyDetail'

type Props = {
    selectedIds: number[]
    onClose: () => void
}

const CompareModal = ({ selectedIds, onClose }: Props) => {
    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-[1200px] max-h-[90vh] rounded-xl relative flex flex-col overflow-hidden">
                {/* 닫기 버튼 */}
                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 text-gray-500 hover:text-gray-700 z-10"
                >
                    <X size={24} />
                </button>

                {/* 타이틀 */}
                <h3 className="mt-10 mb-6 text-xl font-bold text-ssaeng-purple text-center">
                    관심 매물 비교하기
                </h3>

                {/* 스크롤이 적용되는 내부 영역 */}
                <div className="overflow-y-auto px-6 pb-6">
                    <div
                        className={`grid gap-6 ${selectedIds.length === 2 ? 'grid-cols-2' : 'grid-cols-3'}`}
                    >
                        {selectedIds.map((id) => (
                            <div
                                key={id}
                                className="border rounded-xl shadow-sm bg-white"
                            >
                                <PropertyDetail id={id} onClose={() => { }} isCompareMode />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CompareModal